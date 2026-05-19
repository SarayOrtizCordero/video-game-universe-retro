/**
 * VIDEO GAME UNIVERSE - NOTICIAS MODULE
 * Gestiona la carga y filtrado dinámico de artículos de noticias
 */

(function() {
    'use strict';

    const CONFIG = {
        jsonPath: '../assets/data/noticias.json'
    };

    let allArticles = [];
    let currentFilter = 'all';

    /**
     * Inicializa el módulo de noticias
     * Carga los artículos desde JSON y configura los event listeners
     */
    const init = () => {
        // Actualizar contador del carrito
        if (window.CartManager) {
            window.CartManager.updateCounter();
        }
        
        loadArticles();
        setupFilters();
        setupNavigation();
    };

    /**
     * Carga los artículos desde el archivo JSON
     * @returns {Promise<void>}
     */
    const loadArticles = async () => {
        try {
            const response = await fetch(CONFIG.jsonPath);
            if (!response.ok) throw new Error('Error al cargar noticias');
            
            const data = await response.json();
            allArticles = data.articles;
            
            renderArticles(allArticles);
        } catch (error) {
            console.error('Error cargando artículos:', error);
            showError();
        }
    };

    /**
     * Renderiza los artículos en el grid
     * @param {Array} articles - Array de artículos a renderizar
     */
    const renderArticles = (articles) => {
        const grid = document.getElementById('newsGrid');
        if (!grid) return;

        if (articles.length === 0) {
            showNoResults(grid);
            return;
        }

        grid.innerHTML = articles.map((article, index) => createArticleCard(article, index)).join('');
    };

    /**
     * Crea el HTML de una tarjeta de artículo
     * @param {Object} article - Objeto de artículo
     * @param {number} index - Índice del artículo
     * @returns {string} HTML de la tarjeta
     */
    const createArticleCard = (article, index) => {
        const formattedDate = formatDate(article.date);
        const featuredClass = article.featured ? 'featured' : '';
        
        return `
            <article class="article-card ${featuredClass}" data-category="${article.category}">
                <div class="article-image">
                    <img src="${article.image}" 
                         alt="${article.title}" 
                         loading="lazy"
                         onerror="this.src='../assets/images/placeholder.jpg'">
                    <span class="article-category">${article.category}</span>
                </div>
                <div class="article-content">
                    <div class="article-meta">
                        <i class="far fa-calendar-alt"></i>
                        <span>${formattedDate}</span>
                        <span class="separator">•</span>
                        <i class="far fa-user"></i>
                        <span class="author">${article.author}</span>
                    </div>
                    <h3>${article.title}</h3>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <div class="article-tags">
                        ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="article-footer">
                        <a href="#" class="read-more" data-article-id="${article.id}">
                            <span>Leer más</span>
                            <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </article>
        `;
    };

    /**
     * Formatea la fecha en formato legible en español
     * @param {string} dateString - Fecha en formato ISO
     * @returns {string} Fecha formateada
     */
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    };

    /**
     * Configura los filtros de categorías
     */
    const setupFilters = () => {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                currentFilter = category;
                filterArticles(category);
            });
        });
    };

    /**
     * Filtra artículos por categoría
     * @param {string} category - Categoría a filtrar
     */
    const filterArticles = (category) => {
        const cards = document.querySelectorAll('.article-card');
        
        cards.forEach(card => {
            const cardCategory = card.dataset.category;
            
            if (category === 'all' || cardCategory === category) {
                card.classList.remove('hidden');
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = 'fadeInUp 0.6s ease forwards';
                }, 10);
            } else {
                card.classList.add('hidden');
            }
        });

        const visibleCards = document.querySelectorAll('.article-card:not(.hidden)');
        if (visibleCards.length === 0) {
            showNoResults(document.getElementById('newsGrid'));
        } else {
            removeNoResults();
        }
    };

    /**
     * Muestra mensaje cuando no hay resultados
     * @param {HTMLElement} container - Contenedor donde mostrar el mensaje
     */
    const showNoResults = (container) => {
        removeNoResults();
        
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <i class="fas fa-search"></i>
            <h3>No se encontraron artículos</h3>
            <p>Intenta con otra categoría</p>
        `;
        container.appendChild(noResults);
    };

    /**
     * Elimina el mensaje de no resultados
     */
    const removeNoResults = () => {
        const existing = document.querySelector('.no-results');
        if (existing) existing.remove();
    };

    /**
     * Muestra mensaje de error al cargar datos
     */
    const showError = () => {
        const grid = document.getElementById('newsGrid');
        if (!grid) return;

        grid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error al cargar las noticias</h3>
                <p>Por favor, intenta recargar la página</p>
            </div>
        `;
    };

    /**
     * Configura la navegación (menú móvil, scroll progress)
     */
    const setupNavigation = () => {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                menuToggle.setAttribute('aria-expanded', !isExpanded);
                navMenu.classList.toggle('active');
                document.body.style.overflow = isExpanded ? '' : 'hidden';
            });

            navMenu.addEventListener('click', (e) => {
                if (e.target === navMenu) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        const progressBar = document.querySelector('.scroll-progress-bar');
        if (progressBar) {
            const updateProgress = () => {
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;
                const scrollTop = window.scrollY;
                const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
                progressBar.style.width = `${Math.min(scrollPercentage, 100)}%`;
            };

            window.addEventListener('scroll', updateProgress, { passive: true });
            window.addEventListener('resize', updateProgress, { passive: true });
            updateProgress();
        }

        const nav = document.getElementById('main-nav');
        if (nav) {
            const handleScroll = () => {
                if (window.scrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            };

            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
