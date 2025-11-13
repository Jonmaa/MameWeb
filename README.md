# 🌐 MameWeb — Portfolio y Contacto Profesional

Este proyecto es un **sitio web personal y portfolio profesional** desarrollado para mostrar servicios, proyectos, precios y ofrecer un formulario de contacto dinámico con soporte multilenguaje (🇪🇸 Español / 🇬🇧 English).  
Está diseñado con un enfoque en **rendimiento, accesibilidad y experiencia de usuario** moderna.

---

## 🚀 Características principales

- 🎨 **Diseño responsive** y minimalista compatible con móviles, tablets y escritorio.
- 🌓 **Modo oscuro y claro** automático, con persistencia en `localStorage`.
- 🌍 **Internacionalización (i18n)**: todo el texto cambia dinámicamente según el idioma seleccionado.
- ✉️ **Formulario de contacto funcional** con validación y mensajes adaptados al idioma.
- 📧 Opción alternativa para **enviar por correo** usando `mailto`.
- 🔒 **Sin backend necesario** — almacenamiento temporal en `localStorage` y uso de servicios externos opcionales.
- ♿ **Accesible por teclado y lector de pantalla** (uso de `aria-label`, `aria-live`, `outline`, etc.).
- ⚡ **Carga ligera**: sin frameworks, todo con HTML, CSS y JavaScript puro.

---

## 🧠 Tecnologías utilizadas

| Categoría | Tecnología / API |
|------------|------------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Internacionalización (i18n)** | Archivos `lang/es.json` y `lang/en.json` |
| **Almacenamiento local** | `localStorage` (tema e idioma) |
| **Email dinámico** | `mailto:` y **Formspree** para enviar datos JSON |
| **Accesibilidad** | WAI-ARIA roles y `aria-live` para feedback |
| **Animaciones suaves** | Scroll y transiciones CSS |
| **Despliegue local** | Live Server / GitHub Pages |

---

## 🧩 Estructura del proyecto
```
public/
│
├── index.html # Página principal
│
├── /css/
│ └── stylesheet.css # Estilos globales y definición de temas (dark/light)
│
├── /js/
│ └── javascript.js # Lógica principal: temas, traducciones (i18n), formulario y eventos
│
├── /lang/
│ ├── es.json # Traducciones al español
│ └── en.json # Traducciones al inglés
│
└──/img/ # Imágenes y recursos gráficos (logos, portfolio, hero, etc.)
README.md # Documentación del proyecto
```   

### 📁 Descripción breve de los archivos clave

| Archivo / Carpeta | Función principal |
|--------------------|------------------|
| **index.html** | Contiene toda la estructura HTML, con atributos `data-i18n` para la traducción dinámica. |
| **styles.css** | Define la apariencia visual, colores de los temas, diseño adaptable y transiciones suaves. |
| **main.js** | Controla la lógica de interacción: cambio de idioma, validación del formulario, y modo oscuro/claro. |
| **lang/** | Carpeta que agrupa las traducciones en formato JSON. |
| **img/** | Contiene las imágenes del sitio, organizadas por propósito o sección. |
| **README.md** | Documentación del proyecto (este archivo). |

