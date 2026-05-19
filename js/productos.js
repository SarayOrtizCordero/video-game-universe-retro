// ====================================
// VIDEO GAME UNIVERSE - PRODUCTOS
// Carga dinámica y funcionalidad completa
// ====================================

(function() {
    'use strict';

    // ====================================
    // CONFIGURACIÓN
    // ====================================
    const CONFIG = {
        productsEndpoint: '../assets/data/productos.json',
        favoritesStorageKey: 'vgu_favorites',
        placeholderImage: 'https://via.placeholder.com/300x400/1A1A1A/8B5CF6?text=VGU'
    };

    // ====================================
    // ESTADO GLOBAL
    // ====================================
    const State = {
        products: [],
        favorites: new Set(),
        currentFilter: 'all',
        currentSearch: '',
        showingFavoritesOnly: false,
        isLoading: false
    };

    // ====================================
    // CARGA DE PRODUCTOS
    // ====================================
    const ProductsAPI = {
        async loadProducts() {
            if (State.isLoading) return;
            
            State.isLoading = true;
            showLoadingState();
            
            try {
                const response = await fetch(CONFIG.productsEndpoint);
                if (!response.ok) throw new Error('Error al cargar productos');
                
                const data = await response.json();
                State.products = data.products || [];
                
                renderProducts(State.products);
                hideLoadingState();
                
                console.log(`✅ ${State.products.length} productos cargados`);
            } catch (error) {
                console.error('Error cargando productos:', error);
                showErrorState();
            } finally {
                State.isLoading = false;
            }
        }
    };

    const showLoadingState = () => {
        const grid = document.querySelector('.products-grid');
        if (!grid) return;
        
        grid.innerHTML = `
            <div class="loading-state" style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
                <div class="spinner" style="width: 50px; height: 50px; border: 3px solid var(--color-border); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                <p style="color: var(--color-text-secondary);">Cargando productos...</p>
            </div>
        `;
    };

    const hideLoadingState = () => {
        const loadingState = document.querySelector('.loading-state');
        if (loadingState) loadingState.remove();
    };

    const showErrorState = () => {
        const grid = document.querySelector('.products-grid');
        if (!grid) return;
        
        grid.innerHTML = `
            <div class="error-state" style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
                <svg style="width: 60px; height: 60px; margin: 0 auto 1rem; fill: var(--color-error);" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <h3 style="color: var(--color-text); margin-bottom: 0.5rem;">Error al cargar productos</h3>
                <p style="color: var(--color-text-secondary); margin-bottom: 1rem;">No se pudieron cargar los productos. Por favor, intenta de nuevo.</p>
                <button onclick="location.reload()" class="btn-primary">Reintentar</button>
            </div>
        `;
    };

    const renderProducts = (products) => {
        const grid = document.querySelector('.products-grid');
        if (!grid) return;
        
        if (products.length === 0) {
            grid.innerHTML = `
                <div class="no-products" style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
                    <p style="color: var(--color-text-secondary);">No hay productos disponibles</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = products.map(product => createProductCard(product)).join('');
        
        // Inicializar funcionalidad de los botones
        initProductButtons();
    };

    const createProductCard = (product) => {
        const isFavorite = State.favorites.has(product.title);
        const platforms = Array.isArray(product.platform) ? product.platform.join(' • ') : product.platform;
        const genres = Array.isArray(product.genre) ? product.genre.join(', ') : product.genre;
        
        return `
            <article class="product-card" data-id="${product.id}" data-name="${product.title.toLowerCase()}" data-genre="${genres}">
                <div class="product-image-wrapper">
                    <img src="${product.image}" 
                         alt="${product.title}" 
                         class="product-image" 
                         loading="lazy"
                         onerror="this.src='${CONFIG.placeholderImage}'">
                    <div class="product-overlay">
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                        <button class="btn-add-to-cart" data-product='${JSON.stringify(product)}' aria-label="Añadir ${product.title} al carrito">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                            </svg>
                            Añadir al carrito
                        </button>
                    </div>
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-name="${product.title}" aria-label="${isFavorite ? 'Quitar' : 'Añadir'} de favoritos">
                        <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-meta">
                        <span class="product-category">${genres}</span>
                        <span class="product-platforms">${platforms}</span>
                    </div>
                </div>
            </article>
        `;
    };

    const initProductButtons = () => {
        // Botones de añadir al carrito
        document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                try {
                    const productData = JSON.parse(btn.dataset.product);
                    
                    // Usar el CartManager global desde carrito.js
                    if (window.CartManager) {
                        window.CartManager.addItem(productData);
                        console.log('✅ Producto añadido:', productData.title);
                    } else {
                        console.error('❌ CartManager no disponible. Asegúrate de cargar carrito.js primero.');
                        alert('Error: No se pudo añadir el producto al carrito.');
                    }
                } catch (error) {
                    console.error('❌ Error al añadir producto:', error);
                    alert('Error al añadir el producto al carrito.');
                }
            });
        });
        
        // Botones de favoritos
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const productName = btn.dataset.name;
                Favorites.toggle(productName);
                SearchFilter.applyFilters();
            });
        });
    };

    // ====================================
    // SISTEMA DE FAVORITOS
    // ====================================
    const Favorites = {
        load() {
            try {
                const saved = localStorage.getItem(CONFIG.favoritesStorageKey);
                if (saved) {
                    State.favorites = new Set(JSON.parse(saved));
                }
            } catch (e) {
                console.warn('No se pudieron cargar los favoritos:', e);
            }
        },

        save() {
            try {
                localStorage.setItem(
                    CONFIG.favoritesStorageKey,
                    JSON.stringify([...State.favorites])
                );
            } catch (e) {
                console.warn('No se pudieron guardar los favoritos:', e);
            }
        },

        toggle(gameName) {
            if (State.favorites.has(gameName)) {
                State.favorites.delete(gameName);
            } else {
                State.favorites.add(gameName);
            }
            this.save();
            this.updateUI();
        },

        updateUI() {
            const count = State.favorites.size;
            const countElement = document.querySelector('.favorites-count');
            if (countElement) {
                countElement.textContent = count;
            }

            // Actualizar botones de favoritos
            document.querySelectorAll('.product-card').forEach(card => {
                const gameName = card.dataset.name;
                const btn = card.querySelector('.favorite-btn');
                if (!btn) return;
                
                const icon = btn.querySelector('i');
                
                if (State.favorites.has(gameName)) {
                    btn.classList.add('active');
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    btn.setAttribute('aria-label', 'Quitar de favoritos');
                } else {
                    btn.classList.remove('active');
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    btn.setAttribute('aria-label', 'Añadir a favoritos');
                }
            });
        }
    };

    // ====================================
    // SISTEMA DE BÚSQUEDA Y FILTROS
    // ====================================
    const SearchFilter = {
        init() {
            const searchInput = document.getElementById('searchInput');
            const clearBtn = document.getElementById('clearSearch');
            const genreFilter = document.getElementById('genreFilter');
            const favoritesBtn = document.getElementById('showFavorites');

            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    State.currentSearch = e.target.value.toLowerCase();
                    this.toggleClearButton(e.target.value);
                    this.applyFilters();
                });
            }

            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    searchInput.value = '';
                    State.currentSearch = '';
                    this.toggleClearButton('');
                    this.applyFilters();
                    searchInput.focus();
                });
            }

            if (genreFilter) {
                genreFilter.addEventListener('change', (e) => {
                    State.currentFilter = e.target.value;
                    this.applyFilters();
                });
            }

            if (favoritesBtn) {
                favoritesBtn.addEventListener('click', () => {
                    State.showingFavoritesOnly = !State.showingFavoritesOnly;
                    favoritesBtn.classList.toggle('active', State.showingFavoritesOnly);
                    this.applyFilters();
                });
            }
        },

        toggleClearButton(value) {
            const clearBtn = document.getElementById('clearSearch');
            if (clearBtn) {
                clearBtn.classList.toggle('visible', value.length > 0);
            }
        },

        applyFilters() {
            const cards = document.querySelectorAll('.product-card');
            let visibleCount = 0;

            cards.forEach(card => {
                const gameName = card.dataset.name;
                const genres = card.dataset.genre.split(',');
                
                // Filtro de búsqueda
                const matchesSearch = !State.currentSearch || 
                    gameName.includes(State.currentSearch);

                // Filtro de género
                const matchesGenre = State.currentFilter === 'all' || 
                    genres.includes(State.currentFilter);

                // Filtro de favoritos
                const matchesFavorites = !State.showingFavoritesOnly || 
                    State.favorites.has(gameName);

                // Mostrar/ocultar card
                const isVisible = matchesSearch && matchesGenre && matchesFavorites;
                card.classList.toggle('hidden', !isVisible);

                if (isVisible) visibleCount++;
            });

            this.updateResultsInfo(visibleCount, cards.length);
            this.handleNoResults(visibleCount);
        },

        updateResultsInfo(visible, total) {
            const infoElement = document.getElementById('searchInfo');
            if (!infoElement) return;

            if (State.currentSearch || State.currentFilter !== 'all' || State.showingFavoritesOnly) {
                let message = `Mostrando ${visible} de ${total} productos`;
                
                if (State.showingFavoritesOnly) {
                    message = `Mostrando ${visible} favoritos`;
                }
                
                infoElement.textContent = message;
                infoElement.style.display = 'block';
            } else {
                infoElement.style.display = 'none';
            }
        },

        handleNoResults(visibleCount) {
            const grid = document.querySelector('.products-grid');
            let noResults = grid.querySelector('.no-results');

            if (visibleCount === 0) {
                if (!noResults) {
                    noResults = document.createElement('div');
                    noResults.className = 'no-results';
                    noResults.innerHTML = `
                        <i class="fas fa-search"></i>
                        <h3>No se encontraron productos</h3>
                        <p>Intenta con otros términos de búsqueda o filtros</p>
                    `;
                    grid.appendChild(noResults);
                }
            } else if (noResults) {
                noResults.remove();
            }
        }
    };

    // ====================================
    // INICIALIZACIÓN
    // ====================================
    const init = async () => {
        console.log('🎮 Productos - Inicializado');
        
        // Actualizar contador del carrito usando CartManager
        if (window.CartManager) {
            window.CartManager.updateCounter();
        }
        
        // Cargar favoritos
        Favorites.load();
        
        // Cargar productos desde JSON
        await ProductsAPI.loadProducts();
        
        // Inicializar sistemas de filtrado
        SearchFilter.init();
        
        // Actualizar UI de favoritos
        Favorites.updateUI();
    };

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Añadir estilos dinámicos para spinner
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .btn-add-to-cart {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: var(--color-primary);
            color: var(--color-background);
            border: none;
            border-radius: var(--border-radius);
            font-family: var(--font-secondary);
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
        }
        
        .btn-add-to-cart:hover {
            background: var(--color-secondary);
            transform: translateY(-2px);
        }
        
        .btn-add-to-cart svg {
            width: 18px;
            height: 18px;
        }
        
        .product-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.95), transparent);
            padding: 2rem 1rem 1rem;
            transform: translateY(100%);
            transition: transform 0.3s ease;
        }
        
        .product-card:hover .product-overlay {
            transform: translateY(0);
        }
        
        .product-price {
            font-family: var(--font-primary);
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--color-primary);
            margin-bottom: 0.75rem;
        }
        
        .favorite-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
            width: 40px;
            height: 40px;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(10px);
            border: none;
            border-radius: 50%;
            color: var(--color-text);
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
        }
        
        .favorite-btn:hover {
            background: var(--color-primary);
            transform: scale(1.1);
        }
        
        .favorite-btn.active {
            background: var(--color-error);
            color: white;
        }
        
        .favorite-btn.active i {
            animation: heartBeat 0.3s ease;
        }
        
        @keyframes heartBeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.3); }
        }
        
        .no-results {
            grid-column: 1/-1;
            text-align: center;
            padding: 4rem 2rem;
        }
        
        .no-results i {
            font-size: 3rem;
            color: var(--color-text-secondary);
            margin-bottom: 1rem;
        }
        
        .no-results h3 {
            color: var(--color-text);
            margin-bottom: 0.5rem;
        }
        
        .no-results p {
            color: var(--color-text-secondary);
        }
    `;
    document.head.appendChild(style);

})();
