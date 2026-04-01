# Unidos por Gabriel — Repositorio Oficial

Campaña humanitaria de apoyo a Gabriel Hernández Ramos, oficial retirado de la Policía de Puerto Rico y fundador de APUL.

## Estructura

```
docs/           → Página web (GitHub Pages)
  index.html    → Página principal
  css/style.css → Estilos
  js/main.js    → Interactividad
  assets/       → Imágenes y logos

backend/        → AWS Lambda (formulario de registro)
infrastructure/ → Script de configuración AWS
```

## Despliegue

La página vive en GitHub Pages: https://agentislegem-tech.github.io/unidosforgabriel

## Backend AWS

Para activar el formulario de registro:
1. Ejecutar `infrastructure/setup.sh`
2. Copiar la API URL generada
3. Añadirla al `<form>` en `docs/index.html` como `data-endpoint="URL"`

## Donaciones

Todas las donaciones van directamente a: https://justgiving.com/campaign/unidosforgabriel
