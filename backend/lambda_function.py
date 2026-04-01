import json
import boto3
import uuid
from datetime import datetime

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table('unidosforgabriel-registros')

def lambda_handler(event, context):
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    try:
        body = json.loads(event.get('body', '{}'))
        item = {
            'id': str(uuid.uuid4()),
            'nombre': body.get('nombre', ''),
            'email': body.get('email', ''),
            'ciudad': body.get('ciudad', ''),
            'estado': body.get('estado', ''),
            'fecha': datetime.utcnow().isoformat(),
            'fuente': 'unidosforgabriel-web'
        }
        table.put_item(Item=item)
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'Registro exitoso'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }
