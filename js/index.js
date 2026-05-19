/**
 * Video Game Universe - Main JavaScript
 * Dark Gaming Mode Theme - Professional Edition
 */

(function() {
    'use strict';

    // ==========================================
    // CONFIGURACIÓN GLOBAL
    // ==========================================
    const CONFIG = {
        cartStorageKey: 'vgu_cart',
        favoritesStorageKey: 'vgu_favorites',
        apiEndpoints: {
            products: './assets/data/productos.json',
            news: './assets/data/noticias.json',
            upcoming: './assets/data/upcoming-games.json'
        }
    };

    // ==========================================
    // VARIABLES GLOBALES
    // ==========================================
    let cartCount = 0;

    // ==========================================
    // HEADER SCROLL BEHAVIOR
    // ==========================================
    const initHeaderScroll = () => {
        const header = document.querySelector('.main-header');
        if (!header) return;

        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll <= 0) {
                header.classList.remove('scroll-up');
                return;
            }

            if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
                // Scroll hacia abajo
                header.classList.remove('scroll-up');
                header.classList.add('scroll-down');
            } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
                // Scroll hacia arriba
                header.classList.remove('scroll-down');
                header.classList.add('scroll-up');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    };

    // ==========================================
    // SCROLL TO TOP BUTTON
    // ==========================================
    const initScrollToTop = () => {
        const scrollBtn = document.querySelector('.scroll-to-top');
        if (!scrollBtn) return;

        // Mostrar/ocultar botón
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        }, { passive: true });

        // Funcionalidad del botón
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    // ==========================================
    // NAVEGACIÓN ACTIVA (GLOBAL)
    // ==========================================
    const initNavigation = () => {
        const navLinks = document.querySelectorAll('.nav-link, nav ul li a');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            
            let isActive = false;
            const linkPage = href.split('/').pop().replace('.html', '');
            const currentPageName = currentPage.replace('.html', '');
            
            if (linkPage === currentPageName && linkPage !== '') {
                isActive = true;
            } else if (currentPageName === '' && linkPage === 'index') {
                isActive = true;
            }

            if (isActive) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    };

    // ==========================================
    // GESTIÓN GLOBAL DEL CARRITO
    // ==========================================
    const CartManager = {
        getCart() {
            try {
                return JSON.parse(localStorage.getItem(CONFIG.cartStorageKey)) || [];
            } catch {
                return [];
            }
        },

        saveCart(items) {
            try {
                localStorage.setItem(CONFIG.cartStorageKey, JSON.stringify(items));
                this.updateCounter();
            } catch (e) {
                console.error('Error guardando carrito:', e);
            }
        },

        addItem(product) {
            const cart = this.getCart();
            const existingItem = cart.find(item => item.id === product.id);

            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1;
            } else {
                cart.push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    platform: product.platform ? product.platform[0] : 'PC',
                    quantity: 1
                });
            }

            this.saveCart(cart);
            this.showNotification(`"${product.title}" añadido al carrito`, 'success');
            return cart;
        },

        getCount() {
            const cart = this.getCart();
            return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        },

        updateCounter() {
            const counter = document.querySelector('.cart-counter');
            if (!counter) return;

            const count = this.getCount();
            cartCount = count;

            if (count > 0) {
                counter.textContent = count;
                counter.style.display = 'flex';
                counter.classList.add('pulse');
                setTimeout(() => counter.classList.remove('pulse'), 300);
            } else {
                counter.style.display = 'none';
            }
        },

        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `cart-notification ${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <svg class="notification-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    <span>${message}</span>
                </div>
            `;

            document.body.appendChild(notification);

            setTimeout(() => notification.classList.add('show'), 10);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    };

    // ==========================================
    // CART COUNTER (DEPRECATED - Usar CartManager)
    // ==========================================
    const updateCartCounter = () => {
        CartManager.updateCounter();
    };

    // ==========================================
    // PRODUCT CARDS HOVER EFFECTS
    // ==========================================
    const initProductCards = () => {
        const cards = document.querySelectorAll('.product-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });

            // Simular agregar al carrito (click en la card)
            card.addEventListener('click', function(e) {
                if (!e.target.closest('.product-overlay')) return;
                
                cartCount++;
                updateCartCounter();

                // Animación de feedback
                const overlay = this.querySelector('.product-overlay');
                if (overlay) {
                    overlay.style.background = 'linear-gradient(to top, rgba(0, 240, 255, 0.9), transparent)';
                    setTimeout(() => {
                        overlay.style.background = 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)';
                    }, 300);
                }
            });
        });
    };

    // ==========================================
    // FADE IN ANIMATIONS
    // ==========================================
    const initScrollAnimations = () => {
        // Verificar preferencias de movimiento reducido
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll('.feature-card, .game-card, .upcoming-card').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }

        const observerOptions = {
            threshold: CONFIG.animationThreshold,
            rootMargin: CONFIG.animationRootMargin
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observar todas las cards
        const cards = document.querySelectorAll('.feature-card, .game-card, .upcoming-card');
        cards.forEach(card => observer.observe(card));
    };

    // ====================================
    // NAVEGACIÓN SUAVE
    // ====================================
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    };

    // ====================================
    // MEJORA DE IMÁGENES
    // ====================================
    const initLazyLoading = () => {
        if ('loading' in HTMLImageElement.prototype) {
            // El navegador soporta lazy loading nativo
            return;
        }

        // Fallback para navegadores antiguos
        const images = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    };

    // ====================================
    // MENÚ HAMBURGUESA PREMIUM
    // ====================================
    const initMobileMenu = () => {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!menuToggle || !navMenu) return;

        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            
            // Toggle estado
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // Prevenir scroll del body cuando el menú está abierto
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });

        // Cerrar menú al hacer click en un enlace
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Cerrar menú al hacer click fuera (en el overlay)
        navMenu.addEventListener('click', (e) => {
            if (e.target === navMenu) {
                menuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Cerrar menú con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    };

    // ====================================
    // INDICADOR ACTIVO DESLIZANTE
    // ====================================
    const initActiveIndicator = () => {
        const indicator = document.querySelector('.active-indicator');
        const navLinks = document.querySelectorAll('.nav-link');
        const activeLink = document.querySelector('.nav-link.active');

        if (!indicator || !activeLink || window.innerWidth <= 768) return;

        // Función para actualizar posición del indicador
        const updateIndicator = (link) => {
            const linkRect = link.getBoundingClientRect();
            const navRect = link.closest('.nav-container').getBoundingClientRect();
            
            indicator.style.display = 'block';
            indicator.style.width = `${linkRect.width}px`;
            indicator.style.left = `${linkRect.left - navRect.left}px`;
        };

        // Posicionar indicador en el enlace activo al cargar
        updateIndicator(activeLink);

        // Mover indicador al hacer hover
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                updateIndicator(link);
            });
        });

        // Volver al enlace activo al salir del nav
        const nav = document.querySelector('.main-nav');
        nav.addEventListener('mouseleave', () => {
            updateIndicator(activeLink);
        });

        // Actualizar en resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768) {
                    updateIndicator(activeLink);
                    indicator.style.display = 'block';
                } else {
                    indicator.style.display = 'none';
                }
            }, 250);
        });
    };

    // ====================================
    // CONTADOR ANIMADO DE ESTADÍSTICAS
    // ====================================
    const initStatsCounter = () => {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        if (statNumbers.length === 0) return;

        const animateCounter = (element) => {
            const target = parseInt(element.getAttribute('data-target'));
            const duration = 2000; // 2 segundos
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    element.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target;
                }
            };

            updateCounter();
        };

        // Observar cuando las stats entran en el viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target;
                    
                    // Solo animar una vez
                    if (statNumber.textContent === '0') {
                        animateCounter(statNumber);
                    }
                    
                    observer.unobserve(statNumber);
                }
            });
        }, {
            threshold: 0.5
        });

        statNumbers.forEach(stat => observer.observe(stat));
    };

    // ====================================
    // COUNTDOWN PARA PRÓXIMOS LANZAMIENTOS
    // ====================================
    const initCountdowns = () => {
        const countdowns = document.querySelectorAll('.countdown[data-date]');
        
        if (countdowns.length === 0) return;

        countdowns.forEach(countdown => {
            const targetDate = new Date(countdown.getAttribute('data-date')).getTime();
            
            // Elementos del countdown
            const daysEl = countdown.querySelector('.days');
            const hoursEl = countdown.querySelector('.hours');
            const minutesEl = countdown.querySelector('.minutes');
            
            if (!daysEl || !hoursEl || !minutesEl) return;

            const updateCountdown = () => {
                const now = new Date().getTime();
                const distance = targetDate - now;

                if (distance < 0) {
                    daysEl.textContent = '0';
                    hoursEl.textContent = '0';
                    minutesEl.textContent = '0';
                    return;
                }

                // Cálculos
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

                // Actualizar DOM
                daysEl.textContent = days;
                hoursEl.textContent = hours;
                minutesEl.textContent = minutes;
            };

            // Actualizar inmediatamente
            updateCountdown();
            
            // Actualizar cada minuto
            setInterval(updateCountdown, 60000);
        });
    };

    // ====================================
    // BOTONES DE FAVORITOS RÁPIDOS
    // ====================================
    const initQuickFavorites = () => {
        const favoriteButtons = document.querySelectorAll('.quick-favorite, .btn-wishlist');
        
        favoriteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const icon = btn.querySelector('i');
                if (icon) {
                    if (icon.classList.contains('far')) {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                        btn.style.background = 'rgba(255, 71, 87, 0.9)';
                    } else {
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                        btn.style.background = '';
                    }
                }
            });
        });
    };

    // ====================================
    // TRAILER BUTTONS (Preparado para modal futuro)
    // ====================================
    const initTrailerButtons = () => {
        const trailerButtons = document.querySelectorAll('.trailer-btn');
        
        trailerButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Por ahora solo un alert, se puede añadir modal más adelante
                console.log('🎬 Trailer button clicked - Modal implementation pending');
                alert('Función de trailer próximamente disponible');
            });
        });
    };

    // ====================================
    // FEATURE CARDS - MICROINTERACCIONES
    // Opción A+E Híbrido: 3D Tilt + Mouse Tracking
    // ====================================
    const initFeatureCardsMicrointeractions = () => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const cards = document.querySelectorAll('.feature-card');
        
        cards.forEach(card => {
            // Mouse Tracking Light (::after pseudo-element)
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Actualizar posición del gradiente radial
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
                
                // 3D Tilt Effect (máximo 8 grados)
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5; // -5° a 5°
                const rotateY = ((x - centerX) / centerX) * 5;  // -5° a 5°
                
                card.style.transform = `
                    translateY(-12px) 
                    scale(1.03)
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                // Reset transform
                card.style.transform = '';
            });
            
            // Magnetic Hover en CTA Button
            const cta = card.querySelector('.feature-cta');
            if (cta) {
                cta.addEventListener('mousemove', (e) => {
                    const rect = cta.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    
                    // Efecto magnético (máximo 8px de movimiento)
                    const moveX = (x / rect.width) * 8;
                    const moveY = (y / rect.height) * 8;
                    
                    cta.style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`;
                });
                
                cta.addEventListener('mouseleave', () => {
                    cta.style.transform = '';
                });
            }
        });
    };

    // ==========================================
    // NEWSLETTER FORM
    // ==========================================
    const initNewsletterForm = () => {
        const form = document.querySelector('.newsletter-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const input = form.querySelector('.newsletter-input');
            const email = input.value.trim();

            if (!email || !email.includes('@')) {
                alert('Por favor, introduce un email válido');
                return;
            }

            // Simulación de envío exitoso
            alert(`✅ ¡Gracias por suscribirte! Te mantendremos informado en: ${email}`);
            input.value = '';
            
            // Animación del botón
            const btn = form.querySelector('.newsletter-btn');
            btn.style.transform = 'scale(1.1)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 200);
        });
    };

    // ==========================================
    // UPCOMING CARDS ANIMATIONS
    // ==========================================
    const initUpcomingCards = () => {
        const cards = document.querySelectorAll('.upcoming-card');
        
        cards.forEach((card, index) => {
            // Animación de entrada escalonada
            card.style.opacity = '0';
            card.style.transform = 'translateX(-30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, index * 150);

            // Hover effect mejorado
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(10px)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0)';
            });
        });
    };

    // ==========================================
    // SMOOTH REVEAL ANIMATIONS
    // ==========================================
    const initRevealAnimations = () => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Elementos a animar
        const elements = document.querySelectorAll(
            '.feature-card, .product-card, .section-header'
        );

        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    };

    // ==========================================
    // INIT ALL
    // ==========================================
    const init = () => {
        console.log('%c🎮 Video Game Universe', 'color: #00f0ff; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);');
        console.log('%c⚡ Dark Gaming Mode Activated', 'color: #ff00ff; font-size: 14px;');
        
        // Inicializar funciones
        initHeaderScroll();
        initScrollToTop();
        initProductCards();
        initNavigation();
        initScrollAnimations();
        initNewsletterForm();
        initUpcomingCards();
        initRevealAnimations();
        
        // Inicializar contador del carrito
        updateCartCounter();
    };

    // ==========================================
    // LOAD EVENT
    // ==========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ==========================================
    // EXPORTS GLOBALES (para uso en otras páginas)
    // ==========================================
    window.VGU = {
        // Navegación compartida
        initNavigation: initNavigation,
        
        // Gestión del carrito
        Cart: CartManager,
        
        // Actualizar contador (legacy)
        updateCartCount: (count) => {
            if (count !== undefined) {
                cartCount = count;
            }
            CartManager.updateCounter();
        },
        
        // Obtener contador (legacy)
        getCartCount: () => CartManager.getCount(),
        
        // Configuración
        config: CONFIG
    };

    // Legacy support
    window.VideoGameUniverse = window.VGU;

})();
