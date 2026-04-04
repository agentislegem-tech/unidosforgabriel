#!/usr/bin/env python3
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

REMITENTE = "unidosporgabriel2026@gmail.com"
NOMBRE_REMITENTE = "Eli David"
GMAIL_APP_PASSWORD = "xshsjbxdwcppfxin"

ASUNTO_GENERAL = "Llamado de apoyo — Gabriel Hernández Ramos | Unidos por Gabriel"

def email_general_text(saludo):
    return (saludo + """,

Mi nombre es Eli David. Soy oficial de policía en Texas.

Me dirijo a usted en nombre de la campaña Unidos por Gabriel, una iniciativa humanitaria de solidaridad que hoy necesita su apoyo.

Gabriel Hernández Ramos es un oficial retirado de la Policía de Puerto Rico con 20 años de servicio. El pasado 1 de abril fue sometido a una cirugía de alto riesgo en New Jersey. Su recuperación requerirá cuidados continuos que representarán miles de dólares en gastos médicos y de subsistencia — recursos que en este momento su familia no tiene.

Gabriel no devenga salario. Su pensión de retiro es de $487.81 al mes y, por ley, no puede acceder a ella hasta los 65 años. Tiene 48. Su esposa se dedica al cuidado de su hija, quien tiene necesidades especiales y requiere tratamiento continuo.

La Dallas Police Association (DPA), la Assist the Officer Foundation (ATO), la Blue Guardian Foundation y la Iglesia Taller del Alfarero de Texas han formalizado su respaldo institucional a esta campaña. Otras organizaciones continúan sumándose.

Donación oficial: justgiving.com/campaign/unidosforgabriel
Página oficial: unidosporgabriel.org

Cada donación cuenta. Cada mensaje importa.

Eli David
Oficial de Policía — Texas
unidosporgabriel2026@gmail.com""")

DESTINATARIOS = [
    {"email": "23@univision.net",                          "saludo": "Estimado Calixto González"},
    {"email": "noticierodallas@telemundo.com",             "saludo": "Estimado equipo de noticias"},
    {"email": "wnjucontent@nbcuni.com",                    "saludo": "Estimado equipo de noticias"},
    {"email": "WXTV-Assignmentdesk@televisaunivision.com", "saludo": "Estimado equipo de noticias"},
    {"email": "noticias41ny@televisaunivision.com",        "saludo": "Estimado equipo de noticias"},
    {"email": "Kevin.Gray@nbcuni.com",                     "saludo": "Estimado Kevin Gray"},
]

def enviar(destino, saludo):
    try:
        msg = MIMEMultipart()
        msg["From"] = f"{NOMBRE_REMITENTE} <{REMITENTE}>"
        msg["To"] = destino
        msg["Subject"] = ASUNTO_GENERAL
        msg.attach(MIMEText(email_general_text(saludo), "plain", "utf-8"))
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(REMITENTE, GMAIL_APP_PASSWORD)
            server.sendmail(REMITENTE, destino, msg.as_string())
        return "ENVIADO"
    except Exception as e:
        return f"ERROR: {e}"

def main():
    print("=" * 60)
    print("ENVÍO — UNIDOS POR GABRIEL")
    print("=" * 60)
    for d in DESTINATARIOS:
        print(f"\n→ {d['email']}")
        resultado = enviar(d["email"], d["saludo"])
        print(f"  {resultado}")
    print("\n" + "=" * 60)
    print("COMPLETADO")
    print("=" * 60)

if __name__ == "__main__":
    main()
