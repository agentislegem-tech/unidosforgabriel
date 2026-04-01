#!/bin/bash
# ===== INFRAESTRUCTURA AWS — UNIDOS POR GABRIEL =====
# Ejecutar una sola vez para crear DynamoDB + Lambda + API Gateway

REGION="us-east-1"
TABLE="unidosforgabriel-registros"
FUNCTION="unidosforgabriel-registro"
ROLE_NAME="unidosforgabriel-lambda-role"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "=== Creando tabla DynamoDB ==="
aws dynamodb create-table \
  --table-name $TABLE \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region $REGION

echo "=== Creando rol IAM para Lambda ==="
aws iam create-role \
  --role-name $ROLE_NAME \
  --assume-role-policy-document '{
    "Version":"2012-10-17",
    "Statement":[{
      "Effect":"Allow",
      "Principal":{"Service":"lambda.amazonaws.com"},
      "Action":"sts:AssumeRole"
    }]
  }'

aws iam attach-role-policy \
  --role-name $ROLE_NAME \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam put-role-policy \
  --role-name $ROLE_NAME \
  --policy-name DynamoDBAccess \
  --policy-document "{
    \"Version\":\"2012-10-17\",
    \"Statement\":[{
      \"Effect\":\"Allow\",
      \"Action\":[\"dynamodb:PutItem\",\"dynamodb:Scan\"],
      \"Resource\":\"arn:aws:dynamodb:$REGION:$ACCOUNT_ID:table/$TABLE\"
    }]
  }"

echo "=== Esperando 10s para que el rol propague ==="
sleep 10

echo "=== Empaquetando Lambda ==="
cd backend && zip -r function.zip lambda_function.py && cd ..

echo "=== Creando función Lambda ==="
aws lambda create-function \
  --function-name $FUNCTION \
  --runtime python3.12 \
  --role arn:aws:iam::$ACCOUNT_ID:role/$ROLE_NAME \
  --handler lambda_function.lambda_handler \
  --zip-file fileb://backend/function.zip \
  --region $REGION

echo "=== Creando API Gateway ==="
API_ID=$(aws apigatewayv2 create-api \
  --name "unidosforgabriel-api" \
  --protocol-type HTTP \
  --cors-configuration AllowOrigins="*",AllowMethods="POST,OPTIONS",AllowHeaders="Content-Type" \
  --region $REGION \
  --query ApiId --output text)

LAMBDA_ARN="arn:aws:lambda:$REGION:$ACCOUNT_ID:function:$FUNCTION"

INTEGRATION_ID=$(aws apigatewayv2 create-integration \
  --api-id $API_ID \
  --integration-type AWS_PROXY \
  --integration-uri $LAMBDA_ARN \
  --payload-format-version "2.0" \
  --region $REGION \
  --query IntegrationId --output text)

aws apigatewayv2 create-route \
  --api-id $API_ID \
  --route-key "POST /registro" \
  --target integrations/$INTEGRATION_ID \
  --region $REGION

aws apigatewayv2 create-stage \
  --api-id $API_ID \
  --stage-name prod \
  --auto-deploy \
  --region $REGION

aws lambda add-permission \
  --function-name $FUNCTION \
  --statement-id apigateway \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*" \
  --region $REGION

API_URL="https://$API_ID.execute-api.$REGION.amazonaws.com/prod/registro"
echo ""
echo "====================================================="
echo "INFRAESTRUCTURA LISTA"
echo "API URL: $API_URL"
echo "Añade esta URL al formulario en docs/index.html:"
echo "  <form ... data-endpoint=\"$API_URL\">"
echo "====================================================="
