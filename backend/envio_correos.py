#!/usr/bin/env python3
import boto3
from botocore.exceptions import ClientError

REMITENTE = "Eli David <unidosporgabriel2026@gmail.com>"
REGION = "us-east-1"

ASUNTO_GENERAL = "Llamado de apoyo — Gabriel Hernández Ramos | Unidos por Gabriel"

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
    {"email": "23@univision.net",                          "saludo": "Estimado Calixto González"},
    {"email": "noticierodallas@telemundo.com",             "saludo": "Estimado equipo de noticias"},
    {"email": "wnjucontent@nbcuni.com",                    "saludo": "Estimado equipo de noticias"},
    {"email": "WXTV-Assignmentdesk@televisaunivision.com", "saludo": "Estimado equipo de noticias"},
    {"email": "noticias41ny@televisaunivision.com",        "saludo": "Estimado equipo de noticias"},
    {"email": "Kevin.Gray@nbcuni.com",                     "saludo": "Estimado Kevin Gray"},
]

def enviar(ses, destino, asunto, texto):
    try:
        r = ses.send_email(
            FromEmailAddress=REMITENTE,
            Destination={"ToAddresses": [destino]},
            Content={
                "Simple": {
                    "Subject": {"Data": asunto, "Charset": "UTF-8"},
                    "Body": {"Text": {"Data": texto, "Charset": "UTF-8"}},
                }
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
        mid = enviar(ses, d["email"], ASUNTO_GENERAL, email_general_text(d["saludo"]))
        print(f"  ID: {mid}")
    print("\n" + "=" * 60)
    print("COMPLETADO")
    print("=" * 60)

if __name__ == "__main__":
    main()
