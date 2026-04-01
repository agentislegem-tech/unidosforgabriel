#!/usr/bin/env python3
import boto3
from botocore.exceptions import ClientError

REMITENTE = "Eli David <unidosporgabriel2026@gmail.com>"
REGION = "us-east-1"

ASUNTO_1 = "Seguimiento a nuestra conversación — Historia de solidaridad: La comunidad policial de Texas responde por un compañero puertorriqueño"
ASUNTO_2 = "Como prometí: ¿Quién es Gabriel Hernández Ramos? — Perfil con documentación verificada"
ASUNTO_GENERAL = "Llamado de apoyo — Gabriel Hernández Ramos | Unidos por Gabriel"

EMAIL_1_TEXT = """Estimada Mar González,

Le escribo en seguimiento a nuestra conversación telefónica. Gracias por tomarse el tiempo.

Mi nombre es Eli David. Soy oficial de policía en Texas. Como puertorriqueño — y como alguien que también sirvió en la uniformada de la isla — hay historias que uno no puede ignorar. La de Gabriel Hernández Ramos es una de ellas.

Gabriel sirvió 20 años en el Negociado de la Policía de Puerto Rico. Hoy, retirado, enfrenta una cirugía de alto riesgo el próximo 1 de abril en New Jersey. Su pensión oficial es de $487.81 al mes — y el dinero acumulado durante esos 20 años de servicio no estará disponible para él hasta que cumpla 65 años. Tiene 47.

Cuando me enteré de su situación, reaccioné como cualquier compañero de ley haría. Sé lo que es servir en esa institución. Sé lo que le cuesta a un hombre de familia salir adelante con esas condiciones. Gabriel además tiene una hija con necesidades especiales. Y tiene una cirugía en tres días.

Busqué cómo ayudar. La respuesta aquí en Texas fue inmediata.

La campaña está activa hoy:
justgiving.com/campaign/unidosforgabriel

Para nosotros en la hermandad policial, la geografía no cambia el compromiso. Un compañero en apuros es un compañero en apuros — sin importar si está en Texas, en San Juan, o en cualquier punto entre los dos.

En el próximo correo le envío el perfil completo de Gabriel Hernández Ramos — su trayectoria, sus logros documentados, y su pasión y dedicación por el prójimo con compromiso leal.

Quedo a su disposición.

Respetuosamente,

Eli David
Oficial de Policía — Texas
281-839-4231
eli_david@live.com"""

EMAIL_2_TEXT = """Estimada Mar González,

Como le prometí, aquí está el perfil completo de Gabriel Hernández Ramos. Todo lo que encontrará es verificable — con fuentes directas al final.

UN HOMBRE QUE NO NECESITA PRESENTACIÓN — PERO QUE MERECE UNA

Gabriel Hernández Ramos sirvió 20 años en el Negociado de la Policía de Puerto Rico. Se retiró en 2019. Como tantos puertorriqueños, emigró a Estados Unidos en busca de un mejor porvenir para su familia. No se fue en silencio.

$1,550,000,000 — EN 117 DÍAS

El 19 de octubre de 2021, desde Estados Unidos, comenzó a levantar su voz a través de las redes sociales. Sin gremio. Sin estructura. Sin recursos. Solo con la credibilidad de quien lo había vivido en carne propia.

En 117 días, logró que el gobierno de Puerto Rico y la Junta de Supervisión Fiscal asignaran $1,550 millones de dólares para los policías de la isla:
• $850 millones para el fondo de retiro
• $700 millones para el Plan Vital

Ninguna organización policial había logrado algo de esta magnitud en la historia reciente de Puerto Rico.

Primera Hora — Nace un nuevo gremio de policías:
https://www.primerahora.com/noticias/policia-tribunales/notas/nace-un-nuevo-gremio-de-policias/

FUE AL CONGRESO DE LOS ESTADOS UNIDOS

En marzo de 2023, viajó a Washington D.C. y fue citado oficialmente al Congreso. Se reunió con la entonces Comisionada Residente de Puerto Rico — quien hoy ocupa la Gobernación de la isla.

Sus palabras al salir de esa reunión:
"Venimos aquí para que escuchen la queja, el dolor, todo lo que nos ha estado pasando desde el 2013. Gracias a Dios fuimos citados oficialmente al Congreso. Fue una reunión muy exitosa donde gracias a Dios nos escucharon en terreno de Estados Unidos, donde jamás una organización de policías ha llegado."

Primera Hora — APUL eleva reclamo ante Comisionada Residente en Washington:
https://www.primerahora.com/noticias/policia-tribunales/notas/apul-eleva-reclamo-para-un-retiro-justo-ante-la-comisionada-residente-en-washington/

DEPUSO ANTE LA CÁMARA. LLEGÓ AL SENADO.

En mayo de 2022, Gabriel compareció en vista pública ante la Cámara de Representantes de Puerto Rico. Sus palabras quedaron en el registro oficial:
"Yo no estoy aquí porque esto me lo inventé, estoy aquí porque lo viví en carne propia. Mi credibilidad es mi propia persona que se encuentra aquí ante ustedes. Me tuve que ir de la Policía porque suicidaron mi retiro. Hoy día sigo trabajando porque mi pensión de la Policía de Puerto Rico será de $487.00 al mes."

Se reunió también con los expresidentes del Senado Thomas Rivera Schatz y José Luis Dalmau, y con el presidente de la Cámara José "Tatito" Hernández Montañez — en todos los casos, para exigir soluciones concretas.

Primera Hora — Más cerca el retiro digno:
https://www.primerahora.com/noticias/policia-tribunales/notas/mas-cerca-el-retiro-digno-para-los-policias-tras-manifestacion-frente-al-capitolio/

Primera Hora — Policías se tiran a la calle:
https://www.primerahora.com/noticias/policia-tribunales/notas/policias-se-tiran-a-la-calle-contra-accion-de-lider-senatorial-que-estanca-su-retiro/

LAS PROMESAS.

El 18 de diciembre de 2025, la gobernadora prometió a los gremios que el aumento salarial para los policías se concretaría en el primer semestre de 2026.

A 30 de marzo de 2026, el Superintendente de la Policía no tiene fecha. No tiene cantidad. No tiene compromiso concreto.

Los policías de Puerto Rico no han recibido aumento desde 2018. Se les adeudan $132 millones en horas compensatorias sin pagar desde 2017. La Policía, con matrícula de 10,200 efectivos, opera con 5,700 en calle.

Primera Hora — Superintendente sin fecha para el alza salarial:
https://www.primerahora.com/noticias/policia-tribunales/notas/superintendente-se-canta-sin-fecha-para-el-alza-salarial-a-los-policias/

HOY.

Gabriel Hernández Ramos — el hombre que negoció $1,550 millones para los policías de Puerto Rico en 117 días — tiene una pensión de $487.81 al mes.

Ese dinero es además todo lo que recibe. El capital acumulado durante sus 20 años de servicio permanece retenido en el sistema hasta que cumpla 65 años. Tiene 47. El 1 de abril se somete a una cirugía de alto riesgo en New Jersey.

Como puertorriqueño, esto me pesa. Esta es mi gente. Y cuando uno ve que nadie mueve un dedo, uno mueve el suyo.

Nosotros, los que estamos aquí queriendo volver, debemos responder por Gabriel — porque él es el único que ha peleado sin descanso por la seguridad de los nuestros. Y sin seguridad no hay educación. Y sin educación no hay salud.

justgiving.com/campaign/unidosforgabriel

Respetuosamente,

Eli David
Oficial de Policía — Texas
281-839-4231
eli_david@live.com"""

def email_general_text(saludo):
    return f"""{saludo},

Mi nombre es Eli David. Soy oficial de policía en Texas.

Me dirijo a usted en nombre de la campaña Unidos por Gabriel, una iniciativa humanitaria de solidaridad que hoy necesita su apoyo.

Gabriel Hernández Ramos es un oficial retirado de la Policía de Puerto Rico con 20 años de servicio. El pasado 1 de abril fue sometido a una cirugía de alto riesgo en New Jersey. Su recuperación requerirá cuidados continuos que representarán miles de dólares en gastos médicos y de subsistencia — recursos que en este momento su familia no tiene.

Gabriel no devenga salario. Su pensión de retiro es de $487.81 al mes y, por ley, no puede acceder a ella hasta los 65 años. Tiene 47. Su esposa se dedica al cuidado de su hija, quien tiene necesidades especiales y requiere tratamiento continuo.

La Dallas Police Association (DPA), la Assist the Officer Foundation (ATO), la Blue Guardian Foundation y la Iglesia Taller del Alfarero de Texas han formalizado su respaldo institucional a esta campaña. Otras organizaciones continúan sumándose.

Donación oficial: justgiving.com/campaign/unidosforgabriel
Página oficial: unidosporgabriel.org

Cada donación cuenta. Cada mensaje importa.

Eli David
Oficial de Policía — Texas
unidosporgabriel2026@gmail.com"""

DESTINATARIOS = [
    {"email": "MarGonzalez@univision.net",                       "saludo": "Estimada Mar González",      "tipo": "mar"},
    {"email": "23@univision.net",                                 "saludo": "Estimado Calixto González",  "tipo": "general"},
    {"email": "noticierodallas@telemundo.com",                    "saludo": "Estimado equipo de noticias","tipo": "general"},
    {"email": "wnjucontent@nbcuni.com",                           "saludo": "Estimado equipo de noticias","tipo": "general"},
    {"email": "WXTV-Assignmentdesk@televisaunivision.com",        "saludo": "Estimado equipo de noticias","tipo": "general"},
    {"email": "noticias41ny@televisaunivision.com",               "saludo": "Estimado equipo de noticias","tipo": "general"},
    {"email": "Kevin.Gray@nbcuni.com",                            "saludo": "Estimado Kevin Gray",        "tipo": "general"},
]

def enviar(ses, destino, asunto, texto):
    try:
        r = ses.send_email(
            Source=REMITENTE,
            Destination={"ToAddresses": [destino]},
            Message={
                "Subject": {"Data": asunto, "Charset": "UTF-8"},
                "Body": {"Text": {"Data": texto, "Charset": "UTF-8"}},
            },
        )
        return r["MessageId"]
    except ClientError as e:
        return f"ERROR: {e.response['Error']['Message']}"

def main():
    ses = boto3.client("sesv2", region_name=REGION)
    print("=" * 60)
    print("ENVÍO — UNIDOS POR GABRIEL")
    print("=" * 60)

    for d in DESTINATARIOS:
        print(f"\n→ {d['email']}")
        if d["tipo"] == "mar":
            print(f"  Email 1: {enviar(ses, d['email'], ASUNTO_1, EMAIL_1_TEXT)}")
            print(f"  Email 2: {enviar(ses, d['email'], ASUNTO_2, EMAIL_2_TEXT)}")
        else:
            print(f"  General: {enviar(ses, d['email'], ASUNTO_GENERAL, email_general_text(d['saludo']))}")

    print("\n" + "=" * 60)
    print("COMPLETADO")
    print("=" * 60)

if __name__ == "__main__":
    main()
