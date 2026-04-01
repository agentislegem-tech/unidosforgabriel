import json
import boto3
import uuid
from datetime import datetime

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
tabla_registros = dynamodb.Table('unidosforgabriel-registros')
tabla_mensajes  = dynamodb.Table('unidosforgabriel-mensajes')

HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
}

def respuesta(status, body):
    return {'statusCode': status, 'headers': HEADERS, 'body': json.dumps(body, ensure_ascii=False)}

def lambda_handler(event, context):
    method = event.get('requestContext', {}).get('http', {}).get('method') or event.get('httpMethod', '')
    path   = event.get('requestContext', {}).get('http', {}).get('path') or event.get('path', '')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': HEADERS, 'body': ''}

    try:
        if method == 'POST' and path.endswith('/registro'):
            body = json.loads(event.get('body') or '{}')
            item = {
                'id':     str(uuid.uuid4()),
                'nombre': body.get('nombre', '').strip(),
                'email':  body.get('email', '').strip(),
                'ciudad': body.get('ciudad', '').strip(),
                'estado': body.get('estado', '').strip(),
                'fecha':  datetime.utcnow().isoformat(),
                'fuente': 'unidosforgabriel-web'
            }
            tabla_registros.put_item(Item=item)
            return respuesta(200, {'ok': True, 'message': 'Registro exitoso'})

        if method == 'POST' and path.endswith('/mensaje'):
            body = json.loads(event.get('body') or '{}')
            item = {
                'id':      str(uuid.uuid4()),
                'nombre':  body.get('nombre', '').strip(),
                'lugar':   body.get('lugar', '').strip(),
                'mensaje': body.get('mensaje', '').strip(),
                'fecha':   datetime.utcnow().isoformat(),
                'fuente':  'unidosforgabriel-web'
            }
            if not item['nombre'] or not item['mensaje']:
                return respuesta(400, {'ok': False, 'error': 'Nombre y mensaje son requeridos'})
            tabla_mensajes.put_item(Item=item)
            return respuesta(200, {'ok': True, 'message': 'Mensaje recibido'})

        if method == 'GET' and path.endswith('/mensajes'):
            result = tabla_mensajes.scan(
                ProjectionExpression='id, nombre, lugar, mensaje, fecha'
            )
            items = sorted(result.get('Items', []), key=lambda x: x.get('fecha', ''), reverse=True)
            return respuesta(200, {'ok': True, 'mensajes': items})

        return respuesta(404, {'ok': False, 'error': 'Ruta no encontrada'})

    except Exception as e:
        return respuesta(500, {'ok': False, 'error': str(e)})
