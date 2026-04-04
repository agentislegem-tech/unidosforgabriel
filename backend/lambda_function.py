import json
import boto3
import uuid
from datetime import datetime

dynamodb   = boto3.resource('dynamodb', region_name='us-east-1')
comprehend = boto3.client('comprehend', region_name='us-east-1')

tabla_registros  = dynamodb.Table('unidosforgabriel-registros')
tabla_mensajes   = dynamodb.Table('unidosforgabriel-mensajes')
tabla_contadores = dynamodb.Table('unidosforgabriel-contadores')

HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
}

PALABRAS_BLOQUEADAS = [
    'mierda','coño','puta','puto','idiota','imbecil','imbécil','estupido','estúpido',
    'maldito','maldita','pendejo','pendeja','cabron','cabrón','joder','verga','chinga',
    'chingada','culero','marica','maricon','maricón','fuck','shit','damn','asshole',
    'bitch','bastard','cunt','nigger','faggot','whore','kill','hate','odio','muere',
    'muerte','terrorista','nazi','racista','asco','basura','inutil','inútil'
]

def respuesta(status, body):
    return {'statusCode': status, 'headers': HEADERS, 'body': json.dumps(body, ensure_ascii=False)}

def contiene_palabras_bloqueadas(texto):
    texto_lower = texto.lower()
    for palabra in PALABRAS_BLOQUEADAS:
        if palabra in texto_lower:
            return True
    return False

def es_contenido_toxico(texto):
    try:
        r = comprehend.detect_sentiment(Text=texto[:4500], LanguageCode='es')
        sentiment = r.get('Sentiment', '')
        scores    = r.get('SentimentScore', {})
        if sentiment == 'NEGATIVE' and scores.get('Negative', 0) > 0.85:
            return True
        try:
            t = comprehend.detect_toxic_content(
                TextSegments=[{'Text': texto[:4500]}],
                LanguageCode='en'
            )
            for seg in t.get('ResultList', []):
                for label in seg.get('Labels', []):
                    if label.get('Score', 0) > 0.75:
                        return True
        except Exception:
            pass
        return False
    except Exception:
        return False

def moderar_mensaje(texto):
    if contiene_palabras_bloqueadas(texto):
        return False, 'filtro-local'
    if es_contenido_toxico(texto):
        return False, 'comprehend'
    return True, None

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
            body      = json.loads(event.get('body') or '{}')
            nombre    = body.get('nombre', '').strip()
            mensaje   = body.get('mensaje', '').strip()
            lugar     = body.get('lugar', '').strip()
            lugar_key = body.get('lugar_key', '').strip()
            registrado = body.get('registrado', False)

            if not nombre or not mensaje:
                return respuesta(400, {'ok': False, 'error': 'Nombre y mensaje son requeridos'})
            if len(nombre) > 60:
                return respuesta(400, {'ok': False, 'error': 'Nombre demasiado largo'})
            if len(mensaje) > 300:
                return respuesta(400, {'ok': False, 'error': 'Mensaje muy largo (máx. 300 caracteres)'})

            aprobado, _ = moderar_mensaje(mensaje)
            if not aprobado:
                return respuesta(400, {
                    'ok': False,
                    'error': 'Tu mensaje no cumple con las normas de la comunidad.',
                    'blocked': True
                })

            item = {
                'id':         str(uuid.uuid4()),
                'nombre':     nombre,
                'mensaje':    mensaje,
                'lugar':      lugar,
                'lugar_key':  lugar_key,
                'registrado': registrado,
                'fecha':      datetime.utcnow().isoformat(),
                'fuente':     'unidosforgabriel-web'
            }
            tabla_mensajes.put_item(Item=item)
            return respuesta(200, {'ok': True, 'message': 'Mensaje publicado'})

        if method == 'GET' and path.endswith('/mensajes'):
            result = tabla_mensajes.scan(
                ProjectionExpression='id, nombre, lugar, lugar_key, mensaje, fecha, registrado'
            )
            items = sorted(result.get('Items', []), key=lambda x: x.get('fecha', ''), reverse=True)
            return respuesta(200, {'ok': True, 'mensajes': items})

        if method == 'POST' and path.endswith('/visita'):
            try:
                r = tabla_contadores.update_item(
                    Key={'id': 'visitas'},
                    UpdateExpression='ADD #c :inc',
                    ExpressionAttributeNames={'#c': 'count'},
                    ExpressionAttributeValues={':inc': 1},
                    ReturnValues='UPDATED_NEW'
                )
                total = int(r['Attributes'].get('count', 0))
            except Exception:
                total = 0
            return respuesta(200, {'ok': True, 'visitas': total})

        if method == 'GET' and path.endswith('/visitas'):
            try:
                r = tabla_contadores.get_item(Key={'id': 'visitas'})
                total = int(r.get('Item', {}).get('count', 0))
            except Exception:
                total = 0
            return respuesta(200, {'ok': True, 'visitas': total})

        return respuesta(404, {'ok': False, 'error': 'Ruta no encontrada'})

    except Exception as e:
        return respuesta(500, {'ok': False, 'error': str(e)})
