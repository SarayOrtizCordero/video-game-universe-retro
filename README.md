# Video Game Universe

Plataforma web estática para visualización de videojuegos con diseño responsivo, accesible y moderno.

## Descripción

Sitio web estático desarrollado con HTML5, CSS3 y Font Awesome, enfocado en proporcionar una experiencia de visualización de videojuegos con diseño responsivo y cumplimiento de estándares WCAG 2.1.

**Características principales:**
- Diseño responsivo con breakpoints adaptativos (360px, 768px, 1200px, 1400px)
- Arquitectura CSS modular con variables personalizadas
- Sistema de grid avanzado con CSS Grid y Flexbox
- Tema oscuro premium con paleta de colores consistente
- Animaciones y transiciones CSS optimizadas
- Navegación accesible con ARIA labels

**Paleta de colores:**
- Azul Primario (`#003087`)
- Cyan Acento (`#00d9ff`)
- Dorado (`#ffd900ab`)
- Fondo oscuro (`#0a0e27`)

**Tipografía:**
- Fuentes del sistema con fallbacks optimizados

## Tecnologías

- **HTML5** - Estructura semántica (`<article>`, `<section>`, `<nav>`, `<aside>`)
- **CSS3** - Grid, Flexbox, Custom Properties, Gradients, Transforms
- **Font Awesome 6.6.0** - Iconografía vectorial (CDN)

**Características CSS avanzadas:**
- CSS Grid Layout y Flexbox
- CSS Custom Properties (variables)
- Media Queries responsivas
- Pseudo-elementos (::before, ::after)
- Animaciones y transiciones
- Gradientes lineales y radiales
- Box-shadow y text-shadow
- Filter y backdrop-filter

## Funcionalidades

**Páginas principales:**
1. **Inicio** (`index.html`) - Presentación y juegos destacados
2. **Productos** (`views/productos.html`) - Catálogo completo con galerías
3. **Boletín** (`views/boletin.html`) - Formulario de suscripción
4. **Contacto** (`views/contacto.html`) - Información y redes sociales

**Características de diseño:**
- Navegación fija responsive
- Galería de productos con múltiples imágenes
- Formulario con validación HTML5 nativa
- Enlaces a redes sociales
- Lazy loading de imágenes
- Footer con información institucional

## Arquitectura

```
video-game-universe/
├── index.html              # Página principal
├── views/
│   ├── productos.html     # Catálogo de videojuegos
│   ├── boletin.html       # Formulario de suscripción
│   └── contacto.html      # Información de contacto
├── css/
│   ├── styles.css         # Estilos globales y base
│   ├── productos.css      # Estilos de catálogo
│   ├── boletin.css        # Estilos de formulario
│   └── contacto.css       # Estilos de contacto
└── assets/
    └── images/            # Recursos gráficos
```

**Sistema de variables CSS:**
```css
:root {
    --color-primary: #003087;
    --color-accent: #00d9ff;
    --spacing-xs: 0.5rem;
    --spacing-sm: 1rem;
    --glow-cyan: 0 0 20px rgba(0, 217, 255, 0.5);
}
```

**Breakpoints responsivos:**
- Móvil pequeño: ≤ 360px
- Móvil: ≤ 480px
- Tablet: ≤ 768px
- Desktop: ≤ 1200px
- Desktop grande: ≥ 1400px

## Instalación

**Requisitos:** Navegador web moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

**Servidor local (Python):**
`ash
cd video-game-universe
python -m http.server 8000
`

**Servidor local (Node.js):**
`ash
npx http-server -p 8000
`

**VS Code Live Server:**
- Click derecho en `index.html` → "Open with Live Server"

## Personalización

**Modificar colores** (`css/styles.css`):
`css
:root {
    --color-primary: #003087;
    --color-accent: #00d9ff;
    --color-gold: #ffd900ab;
    --color-bg-main: #0a0e27;
}
`

**Añadir productos** (`views/productos.html`):
`html
<article class="product-card">
    <h2>Nombre del Juego <span class="price">XX,XX€</span></h2>
    <div class="product-gallery">
        <img src="../assets/images/imagen.jpg" alt="Descripción" loading="lazy">
    </div>
</article>
`

**Actualizar redes sociales** (footer):
`html
<div class="social-links">
    <a href="https://www.instagram.com/tu_usuario" aria-label="Instagram">
        <i class="fa-brands fa-instagram"></i>
    </a>
</div>
`

## Accesibilidad

**Cumplimiento WCAG 2.1 Nivel AA:**
- Navegación completa por teclado
- ARIA labels en elementos interactivos
- Contraste de color mínimo 4.5:1
- Estructura semántica HTML5
- Atributos alt en imágenes
- Jerarquía lógica de encabezados

## Compatibilidad

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Opera 76+

**Nota:** No compatible con Internet Explorer (requiere CSS Grid y Custom Properties)

## Rendimiento

- Lazy loading de imágenes
- Font Awesome vía CDN
- Selectores CSS optimizados
- Métricas objetivo: FCP < 1.8s, TTI < 3.8s, CLS < 0.1

## Licencia

© 2025 Saray Ortiz Cordero. Todos los derechos reservados.

Este proyecto es de código abierto y está disponible bajo la Licencia MIT para fines educativos y de portfolio personal.

**Nota:** Los nombres, logotipos e imágenes de videojuegos son propiedad de sus respectivos titulares y se utilizan únicamente con fines educativos y de demostración.

## Autor

**Saray Ortiz Cordero**  
Programadora Full-Stack Junior

---

**Última actualización:** Octubre 2025
