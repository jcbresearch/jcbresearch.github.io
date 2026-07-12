# STOCHAST — Manual del sitio

Sitio web de análisis de mercados de **Juan Carlos Baya**.
Bilingüe (EN/ES) · Estático · Hosting gratuito en GitHub Pages · Sin dependencias de pago.

---

## 1. Estructura del proyecto

```
stochast/
├── index.html              ← Página principal
├── post.html               ← Plantilla que muestra cada nota de análisis
├── README.md               ← Este manual
├── assets/
│   ├── css/style.css       ← Todo el diseño (colores, tipografía, layout)
│   ├── js/main.js          ← Idiomas, lista de posts, animación del hero
│   ├── js/post.js          ← Carga y muestra cada nota
│   └── img/                ← Fotos (portrait_bw.jpg y portrait_color.jpg)
└── posts/
    ├── posts.json          ← ÍNDICE de todas las notas (ver sección 3)
    └── *.md                ← Cada nota de análisis es un archivo Markdown
```

---

## 2. Cómo publicar el sitio GRATIS (GitHub Pages)

Solo se hace **una vez**:

1. Crea una cuenta gratuita en https://github.com (si no tienes).
2. Crea un repositorio **público** llamado exactamente: `TUUSUARIO.github.io`
   (por ejemplo, si tu usuario es `jcbaya`, el repo se llama `jcbaya.github.io`).
3. Sube TODOS los archivos de esta carpeta al repositorio
   (botón **"Add file" → "Upload files"**, arrastra todo y confirma con **"Commit changes"**).
4. Espera 1-2 minutos. Tu sitio estará en vivo en:
   **https://TUUSUARIO.github.io**

No hay que pagar nada, nunca. Si algún día quieres un dominio propio
(ej. `stochast.com`), se compra (~US$10/año) y se conecta desde
Settings → Pages → Custom domain, sin tocar el código.

---

## 3. Cómo publicar una nueva nota de análisis (rutina semanal)

Publicar toma ~3 minutos y son solo **2 pasos**:

### Paso A — Crear el archivo de la nota

En la carpeta `posts/`, crea un archivo nuevo con este formato de nombre:

```
AAAA-MM-DD-titulo-corto.md
```

Ejemplo: `2026-07-20-sp500-earnings.md`

El contenido del archivo tiene DOS secciones (inglés y español),
separadas por marcadores. Copia esta plantilla:

```markdown
<!-- EN -->

## Section title

Your analysis in English. **Bold** for emphasis. Lists work:

- Point one
- Point two

## Bottom line

Your conclusion.

<!-- ES -->

## Título de sección

Tu análisis en español.

## Conclusión

Tu conclusión.
```

### Paso B — Registrar la nota en el índice

Abre `posts/posts.json` y agrega un bloque **al inicio de la lista**
(después del `[`):

```json
  {
    "slug": "sp500-earnings",
    "file": "2026-07-20-sp500-earnings.md",
    "date": "2026-07-20",
    "tags": ["SPX", "EQUITIES"],
    "title_en": "S&P 500: what earnings season is telling us",
    "title_es": "S&P 500: qué nos dice la temporada de resultados",
    "summary_en": "One-line summary in English.",
    "summary_es": "Resumen de una línea en español."
  },
```

⚠️ Ojo con la coma: cada bloque `{ ... }` va separado por coma,
y el último de la lista NO lleva coma final.

### Subir los cambios

En GitHub: entra a la carpeta `posts/` del repositorio →
**Add file → Upload files** (para el .md) y edita `posts.json` con el
lápiz ✏️ directamente en el navegador. Commit, y en ~1 minuto la nota
está en vivo.

---

## 4. Cómo continuar el trabajo con Claude (Opus 4.8 u otro modelo)

Para cualquier cambio futuro, abre una conversación nueva y sube (o pega)
los archivos relevantes junto con este mensaje de contexto:

> "Este es mi sitio web STOCHAST, un sitio estático bilingüe (EN/ES) de
> análisis de mercados hosteado en GitHub Pages. Los posts son archivos
> Markdown en /posts con secciones <!-- EN --> y <!-- ES -->, indexados
> en posts.json. Los textos de interfaz están en el diccionario I18N de
> assets/js/main.js y assets/js/post.js. El diseño está en
> assets/css/style.css (paleta: mármol #f5f5f1, tinta #15181d, azul Egeo
> #233e8b, bronce #9c7a3c). Necesito: [describe tu cambio]."

Tareas típicas que puedes pedirle:
- "Redacta esta nota en formato bilingüe y dame el bloque JSON para el índice"
- "Cambia el texto de la bio"
- "Agrega una sección de newsletter"

Consejo para ahorrar tokens: para publicar notas de rutina NO necesitas
subir todo el sitio — basta con pegar la plantilla de la sección 3 y tu
borrador, y pedir que lo formatee.

---

## 5. Detalles editables rápidos

| Qué                      | Dónde                                              |
| ------------------------ | -------------------------------------------------- |
| Bio (EN y ES)            | `assets/js/main.js` → clave `bio` en `I18N`        |
| Email de contacto        | `index.html` → busca `mailto:`                     |
| Disclaimer legal         | `index.html`, `post.html` y diccionarios de JS     |
| Foto                     | Reemplaza `assets/img/portrait_bw.jpg`             |
| Colores                  | `assets/css/style.css` → variables en `:root`      |
| Textos del sitio (EN/ES) | Diccionario `I18N` en `assets/js/main.js`          |

Los dos posts incluidos son **ejemplos** — bórralos (archivo .md + su
bloque en posts.json) cuando publiques tu primer análisis real.
