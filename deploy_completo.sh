#!/bin/bash
set -e

REGION="us-east-1"
TABLE_REG="unidosforgabriel-registros"
TABLE_MSG="unidosforgabriel-mensajes"
FUNCTION="unidosforgabriel-api"
ROLE_NAME="unidosforgabriel-lambda-role"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "====================================================="
echo " UNIDOS POR GABRIEL — DEPLOY BACKEND COMPLETO"
echo "====================================================="
echo " Cuenta : $ACCOUNT_ID | Región : $REGION"
echo "====================================================="
echo ""

echo "[1/6] DynamoDB..."
aws dynamodb describe-table --table-name $TABLE_REG --region $REGION &>/dev/null \
  && echo "  → $TABLE_REG ya existe" \
  || (aws dynamodb create-table --table-name $TABLE_REG \
        --attribute-definitions AttributeName=id,AttributeType=S \
        --key-schema AttributeName=id,KeyType=HASH \
        --billing-mode PAY_PER_REQUEST --region $REGION --output text > /dev/null \
      && echo "  → $TABLE_REG creada")

aws dynamodb describe-table --table-name $TABLE_MSG --region $REGION &>/dev/null \
  && echo "  → $TABLE_MSG ya existe" \
  || (aws dynamodb create-table --table-name $TABLE_MSG \
        --attribute-definitions AttributeName=id,AttributeType=S \
        --key-schema AttributeName=id,KeyType=HASH \
        --billing-mode PAY_PER_REQUEST --region $REGION --output text > /dev/null \
      && echo "  → $TABLE_MSG creada")

echo "[2/6] IAM..."
aws iam get-role --role-name $ROLE_NAME &>/dev/null \
  && echo "  → Rol ya existe" \
  || (aws iam create-role --role-name $ROLE_NAME \
        --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}' \
        --output text > /dev/null \
      && aws iam attach-role-policy --role-name $ROLE_NAME \
           --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole \
      && echo "  → Rol creado")

aws iam put-role-policy --role-name $ROLE_NAME --policy-name DynamoDBAccess \
  --policy-document "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"dynamodb:PutItem\",\"dynamodb:Scan\"],\"Resource\":[\"arn:aws:dynamodb:$REGION:$ACCOUNT_ID:table/$TABLE_REG\",\"arn:aws:dynamodb:$REGION:$ACCOUNT_ID:table/$TABLE_MSG\"]}]}"
echo "  → Política DynamoDB aplicada — esperando propagación..."
sleep 12

echo "[3/6] Lambda..."
cd "$REPO_DIR/backend" && zip -q -r function.zip lambda_function.py && cd "$REPO_DIR"
ROLE_ARN="arn:aws:iam::$ACCOUNT_ID:role/$ROLE_NAME"

aws lambda get-function --function-name $FUNCTION --region $REGION &>/dev/null \
  && (aws lambda update-function-code --function-name $FUNCTION \
        --zip-file fileb://backend/function.zip --region $REGION --output text > /dev/null \
      && echo "  → Código actualizado") \
  || (aws lambda create-function --function-name $FUNCTION \
        --runtime python3.12 --role $ROLE_ARN \
        --handler lambda_function.lambda_handler \
        --zip-file fileb://backend/function.zip --region $REGION --output text > /dev/null \
      && echo "  → Función creada")

aws lambda wait function-active --function-name $FUNCTION --region $REGION
echo "  → Lambda activa"

echo "[4/6] API Gateway..."
LAMBDA_ARN="arn:aws:lambda:$REGION:$ACCOUNT_ID:function:$FUNCTION"
EXISTING_API=$(aws apigatewayv2 get-apis --region $REGION \
  --query "Items[?Name=='unidosforgabriel-api'].ApiId" --output text)

if [ -n "$EXISTING_API" ] && [ "$EXISTING_API" != "None" ]; then
  API_ID=$EXISTING_API
  echo "  → API ya existe: $API_ID"
else
  API_ID=$(aws apigatewayv2 create-api --name "unidosforgabriel-api" \
    --protocol-type HTTP \
    --cors-configuration AllowOrigins="*",AllowMethods="GET,POST,OPTIONS",AllowHeaders="Content-Type" \
    --region $REGION --query ApiId --output text)

  INTEGRATION_ID=$(aws apigatewayv2 create-integration --api-id $API_ID \
    --integration-type AWS_PROXY --integration-uri $LAMBDA_ARN \
    --payload-format-version "2.0" --region $REGION --query IntegrationId --output text)

  for ROUTE in "POST /registro" "POST /mensaje" "GET /mensajes"; do
    aws apigatewayv2 create-route --api-id $API_ID --route-key "$ROUTE" \
      --target integrations/$INTEGRATION_ID --region $REGION --output text > /dev/null
  done

  aws apigatewayv2 create-stage --api-id $API_ID --stage-name prod \
    --auto-deploy --region $REGION --output text > /dev/null

  aws lambda add-permission --function-name $FUNCTION \
    --statement-id apigateway-invoke --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*" \
    --region $REGION --output text > /dev/null
  echo "  → API creada: $API_ID"
fi

API_BASE="https://$API_ID.execute-api.$REGION.amazonaws.com/prod"
URL_REGISTRO="$API_BASE/registro"
URL_MENSAJE="$API_BASE/mensaje"

echo "[5/6] Inyectando URLs en index.html..."
sed -i '' "s|id=\"registroForm\"|id=\"registroForm\" data-endpoint=\"$URL_REGISTRO\"|g" \
  "$REPO_DIR/docs/index.html"
sed -i '' "s|id=\"muroForm\"|id=\"muroForm\" data-endpoint=\"$URL_MENSAJE\"|g" \
  "$REPO_DIR/docs/index.html"
echo "  → URLs inyectadas"

echo "[6/6] Git push..."
cd "$REPO_DIR"
git add docs/index.html docs/js/main.js backend/lambda_function.py
git commit -m "feat: backend AWS conectado — registro, mensajes, API Gateway"
git push origin main

echo ""
echo "====================================================="
echo " LISTO"
echo " POST /registro : $URL_REGISTRO"
echo " POST /mensaje  : $URL_MENSAJE"
echo " GET  /mensajes : $API_BASE/mensajes"
echo "====================================================="
