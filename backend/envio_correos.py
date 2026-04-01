#!/usr/bin/env python3
# envio_correos.py — Estrategia GH
# Envío automático de correos a medios via AWS SES
# Ejecutar: python3 envio_correos.py

import boto3
from botocore.exceptions import ClientError

REMITENTE = "Eli David <unidosporgabriel2026@gmail.com>"
REGION = "us-east-1"

# ─── CUERPO EMAIL 1 ─────────────────────────────────────────────────────────

def email1_html(saludo):
    return f"""
<html><body style="font-family:Arial,sans-serif;font-size:15px;color:#1a1a1a;max-width:680px;margin:0 auto;padding:20px;">
<p>{saludo},</p>

<p>Le escribo en seguimiento a nuestra conversación telefónica. Mi nombre es Eli David, soy oficial de policía en Texas.</p>

<p>Hace poco me enteré de la situación del oficial Gabriel Hernández Ramos — un servidor público puertorriqueño con 20 años de servicio, que enfrenta una cirugía crítica en New Jersey sin los recursos económicos para costear su recuperación.</p>

<p>Cuando supe de su situación, hice lo que cualquier compañero de ley haría: activé los recursos que tengo a mi alcance aquí en Texas. La <strong>Dallas Police Association (DPA)</strong> y la <strong>Assist the Officer Foundation (ATO)</strong> respondieron de inmediato. La <strong>Blue Guardian Foundation</strong> y la <strong>Iglesia Taller del Alfarero</strong> en Texas también se sumaron. Juntos establecimos una campaña oficial de recaudación de fondos:</p>

<p style="text-align:center;margin:24px 0;">
  🔗 <a href="https://justgiving.com/campaign/unidosforgabriel" style="color:#002868;font-weight:bold;">justgiving.com/campaign/unidosforgabriel</a>
</p>

<p>Para nosotros en la hermandad policial, la frontera no cambia el compromiso. Un compañero en apuros es un compañero en apuros — sin importar el estado o el territorio.</p>

<p>Un pequeño grupo de puertorriqueños en la diáspora se unió también, porque cuando uno de los nuestros necesita ayuda, respondemos. Así somos.</p>

<p>Le adjunto en el próximo correo el perfil completo de Gabriel Hernández Ramos. Creo que su historia merece ser contada — no solo como una historia de solidaridad humana, sino como un espejo de una realidad que muchos puertorriqueños en los 50 estados conocen muy bien.</p>

<p>Quedo disponible para una llamada o entrevista cuando lo estimen conveniente.</p>

<p>Respetuosamente,</p>

<p><strong>Eli David</strong><br>
Oficial de Policía — Texas<br>
📞 281-839-4231<br>
📧 <a href="mailto:eli_david@live.com">eli_david@live.com</a></p>
</body></html>
"""

def email1_text(saludo):
    return f"""{saludo},

Le escribo en seguimiento a nuestra conversación telefónica. Mi nombre es Eli David, soy oficial de policía en Texas.

Hace poco me enteré de la situación del oficial Gabriel Hernández Ramos — un servidor público puertorriqueño con 20 años de servicio, que enfrenta una cirugía crítica en New Jersey sin los recursos económicos para costear su recuperación.

Cuando supe de su situación, hice lo que cualquier compañero de ley haría: activé los recursos que tengo a mi alcance aquí en Texas. La Dallas Police Association (DPA) y la Assist the Officer Foundation (ATO) respondieron de inmediato. La Blue Guardian Foundation y la Iglesia Taller del Alfarero en Texas también se sumaron. Juntos establecimos una campaña oficial de recaudación de fondos:

justgiving.com/campaign/unidosforgabriel

Para nosotros en la hermandad policial, la frontera no cambia el compromiso. Un compañero en apuros es un compañero en apuros — sin importar el estado o el territorio.

Un pequeño grupo de puertorriqueños en la diáspora se unió también, porque cuando uno de los nuestros necesita ayuda, respondemos.

Le adjunto en el próximo correo el perfil completo de Gabriel Hernández Ramos.

Respetuosamente,
Eli David
Oficial de Policía — Texas
281-839-4231
eli_david@live.com
"""

# ─── CUERPO EMAIL 2 ─────────────────────────────────────────────────────────

def email2_html(saludo):
    return f"""
<html><body style="font-family:Arial,sans-serif;font-size:15px;color:#1a1a1a;max-width:680px;margin:0 auto;padding:20px;">
<p>{saludo},</p>

<p>Como prometí, les presento el perfil completo de Gabriel Hernández Ramos — con documentación verificable — para que evalúen el alcance real de esta historia.</p>

<hr style="border:1px solid #002868;margin:20px 0;">

<h2 style="color:#002868;">GABRIEL HERNÁNDEZ RAMOS — QUIÉN ES</h2>

<p>Gabriel Hernández Ramos sirvió durante <strong>20 años</strong> en la Policía de Puerto Rico (PPR). Retirado en 2019, no desapareció en silencio.</p>

<p>Fundó la <strong>Asociación de Policías Unidos Luchando (APUL)</strong> y negoció, en <strong>117 días</strong>, más de <strong>$1,550 millones en beneficios</strong> para los policías de la isla — $850 millones para el fondo de retiro y $700 millones para el Plan Vital de salud — en plena quiebra fiscal de Puerto Rico.</p>

<p>📎 <a href="https://www.primerahora.com/noticias/policia-tribunales/notas/nace-un-nuevo-gremio-de-policias/" style="color:#002868;">Primera Hora — "Nace un nuevo gremio de policías"</a></p>

<hr style="border:0.5px solid #ccc;margin:20px 0;">

<h2 style="color:#002868;">FUE A WASHINGTON. DEPUSO ANTE LA CÁMARA.</h2>

<p>En mayo de 2022, Gabriel compareció en vista pública ante la Cámara de Representantes de Puerto Rico. Sus palabras ante los legisladores quedaron en el registro oficial:</p>

<blockquote style="border-left:4px solid #D4A017;padding:12px 20px;margin:20px 0;background:#fffdf0;font-style:italic;color:#333;">
"Yo no estoy aquí porque esto me lo inventé, estoy aquí porque lo viví en carne propia. Mi credibilidad es mi propia persona que se encuentra aquí ante ustedes. Me tuve que ir de la Policía porque suicidaron mi retiro... Hoy día sigo trabajando porque mi pensión de la Policía de Puerto Rico será de $487.00 al mes."
</blockquote>

<p>Fue también al Congreso de los Estados Unidos. Se reunió oficialmente con la entonces Comisionada Residente en Washington:</p>

<blockquote style="border-left:4px solid #D4A017;padding:12px 20px;margin:20px 0;background:#fffdf0;font-style:italic;color:#333;">
"Gracias a Dios fuimos citados oficialmente al Congreso. Fue una reunión muy exitosa donde gracias a Dios nos escucharon en terreno de Estados Unidos, donde jamás una organización de policías ha llegado."
</blockquote>

<p>📎 <a href="https://www.primerahora.com/noticias/policia-tribunales/notas/apul-eleva-reclamo-para-un-retiro-justo-ante-la-comisionada-residente-en-washington/" style="color:#002868;">Primera Hora — "APUL eleva reclamo ante Comisionada Residente en Washington"</a></p>

<p>También se reunió con el Presidente del Senado <strong>Thomas Rivera Schatz</strong>, con el Presidente del Senado <strong>José Luis Dalmau</strong>, y con el Presidente de la Cámara <strong>José "Tatito" Hernández Montañez</strong>.</p>

<p>📎 <a href="https://www.primerahora.com/noticias/policia-tribunales/notas/mas-cerca-el-retiro-digno-para-los-policias-tras-manifestacion-frente-al-capitolio/" style="color:#002868;">Primera Hora — "Más cerca el retiro digno para los policías"</a></p>
<p>📎 <a href="https://www.primerahora.com/noticias/policia-tribunales/notas/policias-se-tiran-a-la-calle-contra-accion-de-lider-senatorial-que-estanca-su-retiro/" style="color:#002868;">Primera Hora — "Policías se tiran a la calle contra acción de líder senatorial"</a></p>
<p>📎 <a href="https://www.primerahora.com/noticias/policia-tribunales/notas/rinde-frutos-manifestacion-de-apul-por-proyecto-que-garantiza-fondo-de-retiro/" style="color:#002868;">Primera Hora — "Rinde frutos manifestación de APUL"</a></p>

<hr style="border:0.5px solid #ccc;margin:20px 0;">

<h2 style="color:#002868;">LO QUE RECIBE HOY.</h2>

<p>Pensión oficial: <strong>$487.81 al mes</strong>.</p>

<p>El capital acumulado durante sus veinte años de servicio permanece retenido en el sistema hasta que cumpla 65 años. Tiene 47.</p>

<p>Los policías de Puerto Rico no cotizaron al Seguro Social federal durante décadas — excluidos hasta la <strong>Ley 71 de 2019</strong>, el mismo año en que Gabriel se retiró. Un oficial retirado en el continente recibe pensión estatal, Seguro Social y acceso inmediato a su fondo acumulado desde el primer día del retiro. Gabriel Hernández Ramos — ciudadano americano, en territorio americano: $487.81 al mes. Su fondo: bloqueado dieciocho años más.</p>

<hr style="border:0.5px solid #ccc;margin:20px 0;">

<h2 style="color:#002868;">LAS PROMESAS.</h2>

<p>Los policías de Puerto Rico no han recibido aumento salarial desde <strong>2018</strong>. Se les adeudan <strong>$132 millones</strong> en horas compensatorias sin pagar desde 2017. La Policía opera con 5,700 efectivos de una matrícula de 10,200.</p>

<p>El <strong>18 de diciembre de 2025</strong>, la gobernadora Jenniffer González Colón prometió que el aumento salarial se concretaría en el primer semestre de 2026.</p>

<p>A la fecha de este correo: el Superintendente de la Policía no tiene fecha, no tiene cifra, no tiene compromiso concreto.</p>

<p>📎 <a href="https://www.primerahora.com/noticias/policia-tribunales/notas/superintendente-se-canta-sin-fecha-para-el-alza-salarial-a-los-policias/" style="color:#002868;">Primera Hora — "Superintendente se canta sin fecha para el alza salarial"</a></p>

<hr style="border:0.5px solid #002868;margin:20px 0;">

<h2 style="color:#002868;">¿QUIÉN RESPONDIÓ?</h2>

<p>La respuesta proviene de Texas.</p>

<p style="text-align:center;margin:24px 0;">
  🔗 <a href="https://justgiving.com/campaign/unidosforgabriel" style="color:#002868;font-weight:bold;font-size:16px;">justgiving.com/campaign/unidosforgabriel</a>
</p>

<p>Quedo disponible para cualquier pregunta o coordinación.</p>

<p>Respetuosamente,</p>

<p><strong>Eli David</strong><br>
Oficial de Policía — Texas<br>
📞 281-839-4231<br>
📧 <a href="mailto:eli_david@live.com">eli_david@live.com</a></p>
</body></html>
"""

def email2_text(saludo):
    return f"""{saludo},

Como prometí, les presento el perfil completo de Gabriel Hernández Ramos — con documentación verificable.

GABRIEL HERNÁNDEZ RAMOS — QUIÉN ES

Gabriel Hernández Ramos sirvió 20 años en la Policía de Puerto Rico (PPR). Fundó APUL y negoció en 117 días más de $1,550 millones en beneficios para los policías — $850M fondo de retiro + $700M Plan Vital.

Primera Hora — "Nace un nuevo gremio de policías":
primerahora.com/noticias/policia-tribunales/notas/nace-un-nuevo-gremio-de-policias/

FUE A WASHINGTON. DEPUSO ANTE LA CÁMARA.

En mayo de 2022, ante la Cámara de Representantes de Puerto Rico, declaró:
"Yo no estoy aquí porque esto me lo inventé, estoy aquí porque lo viví en carne propia. Me tuve que ir de la Policía porque suicidaron mi retiro. Hoy día sigo trabajando porque mi pensión de la Policía de Puerto Rico será de $487.00 al mes."

Se reunió en Washington con la entonces Comisionada Residente. Se reunió con el Presidente del Senado Thomas Rivera Schatz, con el Presidente del Senado José Luis Dalmau, y con el Presidente de la Cámara José "Tatito" Hernández Montañez.

Primera Hora — APUL en Washington:
primerahora.com/noticias/policia-tribunales/notas/apul-eleva-reclamo-para-un-retiro-justo-ante-la-comisionada-residente-en-washington/

LO QUE RECIBE HOY.

Pensión oficial: $487.81 al mes. No puede acceder a su fondo acumulado hasta los 65. Tiene 47.

Los policías de Puerto Rico no cotizaron al Seguro Social federal durante décadas — excluidos hasta la Ley 71 de 2019, el mismo año en que Gabriel se retiró.

LAS PROMESAS.

Los policías no han recibido aumento salarial desde 2018. Se les adeudan $132 millones en horas compensatorias. La Policía opera con 5,700 de 10,200 efectivos.

El 18 de diciembre de 2025, la gobernadora prometió el aumento para el primer semestre de 2026. A la fecha: sin fecha, sin cifra, sin compromiso concreto.

Primera Hora — Sin fecha para el aumento:
primerahora.com/noticias/policia-tribunales/notas/superintendente-se-canta-sin-fecha-para-el-alza-salarial-a-los-policias/

¿QUIÉN RESPONDIÓ?

La respuesta proviene de Texas.

justgiving.com/campaign/unidosforgabriel

Eli David
Oficial de Policía — Texas
281-839-4231
eli_david@live.com
"""

# ─── LISTA DE DESTINATARIOS ──────────────────────────────────────────────────

DESTINATARIOS = [
    {
        "email": "MarGonzalez@univision.net",
        "saludo": "Estimada Mar González",
        "medio": "Univisión Dallas",
        "enviar_email2": True,
    },
    {
        "email": "23@univision.net",
        "saludo": "Estimado Calixto González",
        "medio": "Univisión Dallas (Director)",
        "enviar_email2": True,
    },
    {
        "email": "noticierodallas@telemundo.com",
        "saludo": "Estimado equipo de noticias",
        "medio": "Telemundo Dallas",
        "enviar_email2": True,
    },
    {
        "email": "wnjucontent@nbcuni.com",
        "saludo": "Estimado equipo de noticias",
        "medio": "Telemundo NY/NJ (WNJU 47)",
        "enviar_email2": True,
    },
    {
        "email": "WXTV-Assignmentdesk@televisaunivision.com",
        "saludo": "Estimado equipo de noticias",
        "medio": "Univisión NY/NJ (WXTV 41)",
        "enviar_email2": True,
    },
    {
        "email": "noticias41ny@televisaunivision.com",
        "saludo": "Estimado equipo de noticias",
        "medio": "Univisión NY Noticias",
        "enviar_email2": True,
    },
    {
        "email": "Kevin.Gray@nbcuni.com",
        "saludo": "Estimado Kevin Gray",
        "medio": "Telemundo Nacional",
        "enviar_email2": True,
    },
]

# ─── FUNCIÓN DE ENVÍO ────────────────────────────────────────────────────────

def enviar_correo(ses_client, destinatario, asunto, html_body, text_body):
    try:
        response = ses_client.send_email(
            Source=REMITENTE,
            Destination={"ToAddresses": [destinatario]},
            Message={
                "Subject": {"Data": asunto, "Charset": "UTF-8"},
                "Body": {
                    "Text": {"Data": text_body, "Charset": "UTF-8"},
                    "Html": {"Data": html_body, "Charset": "UTF-8"},
                },
            },
        )
        return response["MessageId"]
    except ClientError as e:
        return f"ERROR: {e.response['Error']['Message']}"


# ─── EJECUCIÓN ───────────────────────────────────────────────────────────────

def main():
    ses = boto3.client("sesv2", region_name=REGION)

    print("=" * 60)
    print("ENVÍO DE CORREOS — UNIDOS POR GABRIEL")
    print("=" * 60)

    for d in DESTINATARIOS:
        print(f"\n→ {d['medio']} ({d['email']})")

        # Email 1
        asunto1 = "Historia urgente: Comunidad policial de Texas apoya a oficial puertorriqueño"
        mid1 = enviar_correo(
            ses,
            d["email"],
            asunto1,
            email1_html(d["saludo"]),
            email1_text(d["saludo"]),
        )
        print(f"  Email 1 enviado — ID: {mid1}")

        # Email 2
        if d["enviar_email2"]:
            asunto2 = "¿Quién es Gabriel Hernández Ramos? — Perfil completo con documentación"
            mid2 = enviar_correo(
                ses,
                d["email"],
                asunto2,
                email2_html(d["saludo"]),
                email2_text(d["saludo"]),
            )
            print(f"  Email 2 enviado — ID: {mid2}")

    print("\n" + "=" * 60)
    print("ENVÍO COMPLETADO")
    print("=" * 60)


if __name__ == "__main__":
    main()
