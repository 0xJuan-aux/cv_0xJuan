# cv_0xJuan

Repositorio fuente del Site profesional de Curriculum Vitae.

## Arquitectura
- `index.html`: estructura principal del Site.
- `css/style.css`: estilos generales.
- `css/animations.css`: efectos y transiciones.
- `css/responsive.css`: adaptación móvil.
- `js/main.js`: carga dinámica del contenido.
- `data/cv.json`: fuente principal de datos del CV.

## Regla principal
El contenido profesional debe mantenerse en `data/cv.json`. El Site consume esos datos para construir las secciones del CV.

## Flujo
CV / LinkedIn / proyectos -> data/cv.json -> Site HTML5/CSS/JS -> publicación.
