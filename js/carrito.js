/* ============================================
   CARRITO DE COMPRAS - FUNCIONALIDAD COMPLETA
   Video Game Universe - Cyber Premium Edition
   ============================================ */

// ==========================================
// CART MANAGER GLOBAL
// ==========================================
const CartManager = {
    storageKey: 'vgu_cart',

    getCart() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || [];
        } catch {
            return [];
        }
    },

    saveCart(items) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(items));
            this.updateCounter();
            this.notifyCartUpdate();
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
                platform: Array.isArray(product.platform) ? product.platform[0] : product.platform || 'PC',
                quantity: 1
            });
        }

        this.saveCart(cart);
        this.showNotification(`"${product.title}" añadido al carrito`, 'success');
        return cart;
    },

    removeItem(productId) {
        const cart = this.getCart();
        const filteredCart = cart.filter(item => item.id !== productId);
        this.saveCart(filteredCart);
    },

    updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, Math.min(99, quantity));
            this.saveCart(cart);
        }
    },

    getCount() {
        const cart = this.getCart();
        return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    },

    updateCounter() {
        const counters = document.querySelectorAll('.cart-counter');
        const count = this.getCount();

        counters.forEach(counter => {
            if (count > 0) {
                counter.textContent = count;
                counter.style.display = 'flex';
                counter.classList.add('pulse');
                setTimeout(() => counter.classList.remove('pulse'), 300);
            } else {
                counter.style.display = 'none';
            }
        });
    },

    showNotification(message, type = 'success') {
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
    },

    notifyCartUpdate() {
        // Disparar evento personalizado para que otras páginas escuchen
        window.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { count: this.getCount() } 
        }));
    }
};

// Exponer globalmente
window.CartManager = CartManager;
window.VGU = window.VGU || {};
window.VGU.Cart = CartManager;

// ============================================
// CÓDIGOS DE DESCUENTO VÁLIDOS
// ============================================
const PROMO_CODES = {
    'CYBER2025': { discount: 0.15, description: '15% de descuento' },
    'FIRSTBUY': { discount: 0.10, description: '10% de descuento' },
    'VGU50': { discount: 0.05, description: '5% de descuento' },
    'GAMING10': { discount: 0.10, description: '10% de descuento especial' }
};

// ============================================
// ESTADO DEL CARRITO
// ============================================
let cartItems = [];
let appliedPromo = null;

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Actualizar contador al cargar
    CartManager.updateCounter();
    
    initCart();
    initPromoCode();
    initCheckout();
});

// ============================================
// GESTIÓN DEL CARRITO
// ============================================
function initCart() {
    // Cargar datos del localStorage usando CartManager
    cartItems = CartManager.getCart();
    
    // Si el carrito está vacío, mostrar estado vacío
    if (cartItems.length === 0) {
        console.log('📦 Carrito vacío - Añade productos desde el catálogo');
    }
    
    renderCart();
    updateSummary();
    updateCartBadge();
}

function renderCart() {
    const cartList = document.getElementById('cart-list');
    const emptyCart = document.getElementById('empty-cart');
    const cartContainer = document.getElementById("cart-items");
    if (!cartContainer) return;
    
    if (cartItems.length === 0) {
        cartList.style.display = 'none';
        emptyCart.style.display = 'block';
        document.getElementById('cart-summary').style.display = 'none';
        return;
    }
    
    cartList.style.display = 'flex';
    emptyCart.style.display = 'none';
    document.getElementById('cart-summary').style.display = 'block';
    
    cartList.innerHTML = cartItems.map(item => `
        <article class="cart-item" data-id="${item.id}">
            <div class="item-image">
                <img src="${item.image}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/120x160/1A1A1A/8B5CF6?text=VGU'">
            </div>
            
            <div class="item-details">
                <h3 class="item-title">${item.title}</h3>
                <p class="item-platform"><i class="fas fa-gamepad"></i> ${item.platform}</p>
                <p class="item-price">${item.price.toFixed(2)}€</p>
            </div>
            
            <div class="item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="decreaseQuantity(${item.id})" aria-label="Disminuir cantidad">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" readonly>
                    <button class="quantity-btn" onclick="increaseQuantity(${item.id})" aria-label="Aumentar cantidad">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                
                <button class="remove-btn" onclick="removeItem(${item.id})" aria-label="Eliminar ${item.title}">
                    <i class="fas fa-trash-alt"></i> Eliminar
                </button>
            </div>
        </article>
    `).join('');
}

function updateSummary() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    let discount = 0;
    if (appliedPromo) {
        discount = subtotal * appliedPromo.discount;
    }
    
    const shipping = subtotal >= 50 ? 0 : 4.99;
    const total = subtotal - discount + shipping;
    
    document.getElementById('items-count').textContent = itemsCount;
    document.getElementById('subtotal').textContent = `${subtotal.toFixed(2)}€`;
    document.getElementById('discount').textContent = discount > 0 ? `-${discount.toFixed(2)}€` : '0.00€';
    document.getElementById('shipping').textContent = shipping === 0 ? 'GRATIS' : `${shipping.toFixed(2)}€`;
    document.getElementById('total').textContent = `${total.toFixed(2)}€`;
}

function updateCartBadge() {
    CartManager.updateCounter();
}

function saveCart() {
    CartManager.saveCart(cartItems);
}

// ============================================
// ACCIONES DEL CARRITO
// ============================================
function increaseQuantity(itemId) {
    const item = cartItems.find(i => i.id === itemId);
    if (item && item.quantity < 99) {
        item.quantity++;
        saveCart();
        renderCart();
        updateSummary();
        updateCartBadge();
    }
}

function decreaseQuantity(itemId) {
    const item = cartItems.find(i => i.id === itemId);
    if (item && item.quantity > 1) {
        item.quantity--;
        saveCart();
        renderCart();
        updateSummary();
        updateCartBadge();
    }
}

function removeItem(itemId) {
    if (confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
        cartItems = cartItems.filter(item => item.id !== itemId);
        saveCart();
        renderCart();
        updateSummary();
        updateCartBadge();
        
        // Animación de feedback
        showNotification('Artículo eliminado del carrito', 'success');
    }
}

// ============================================
// CÓDIGO PROMOCIONAL
// ============================================
function initPromoCode() {
    const promoInput = document.getElementById('promo-input');
    const applyBtn = document.getElementById('apply-promo');
    const promoMessage = document.getElementById('promo-message');
    
    applyBtn.addEventListener('click', () => {
        const code = promoInput.value.trim().toUpperCase();
        
        if (!code) {
            showPromoMessage('Por favor, introduce un código', 'error');
            return;
        }
        
        if (PROMO_CODES[code]) {
            appliedPromo = PROMO_CODES[code];
            showPromoMessage(`✓ Código aplicado: ${appliedPromo.description}`, 'success');
            promoInput.value = '';
            promoInput.disabled = true;
            applyBtn.textContent = 'Aplicado';
            applyBtn.disabled = true;
            updateSummary();
        } else {
            showPromoMessage('✗ Código no válido', 'error');
        }
    });
    
    // Aplicar con Enter
    promoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            applyBtn.click();
        }
    });
}

function showPromoMessage(message, type) {
    const promoMessage = document.getElementById('promo-message');
    promoMessage.textContent = message;
    promoMessage.className = `promo-message ${type}`;
    
    if (type === 'error') {
        setTimeout(() => {
            promoMessage.textContent = '';
            promoMessage.className = 'promo-message';
        }, 3000);
    }
}

// ============================================
// PROCESO DE CHECKOUT
// ============================================
function initCheckout() {
    const checkoutBtn = document.getElementById('btn-checkout');
    const checkoutModal = document.getElementById('checkout-modal');
    const successModal = document.getElementById('success-modal');
    const checkoutForm = document.getElementById('checkout-form');
    const modalClose = document.getElementById('modal-close');
    const btnCancel = document.getElementById('btn-cancel');
    
    // Abrir modal de checkout
    checkoutBtn.addEventListener('click', () => {
        if (cartItems.length === 0) {
            showNotification('Tu carrito está vacío', 'error');
            return;
        }
        openModal(checkoutModal);
    });
    
    // Cerrar modal
    modalClose.addEventListener('click', () => closeModal(checkoutModal));
    btnCancel.addEventListener('click', () => closeModal(checkoutModal));
    
    // Cerrar al hacer clic en el overlay
    checkoutModal.querySelector('.modal-overlay').addEventListener('click', () => {
        closeModal(checkoutModal);
    });
    
    // Enviar formulario
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateCheckoutForm()) {
            processOrder();
            closeModal(checkoutModal);
            setTimeout(() => {
                showSuccessModal();
            }, 300);
        }
    });
}

function validateCheckoutForm() {
    const form = document.getElementById('checkout-form');
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#EF4444';
            isValid = false;
        } else {
            input.style.borderColor = '';
        }
    });
    
    if (!isValid) {
        showNotification('Por favor, completa todos los campos obligatorios', 'error');
    }
    
    return isValid;
}

function processOrder() {
    // Generar número de pedido
    const orderNumber = `VGU-${Date.now().toString().slice(-8)}`;
    document.getElementById('order-number').textContent = `#${orderNumber}`;
    
    // Guardar pedido en localStorage (simulación)
    const order = {
        orderNumber,
        date: new Date().toISOString(),
        items: [...cartItems],
        promo: appliedPromo,
        total: document.getElementById('total').textContent
    };
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Limpiar carrito
    cartItems = [];
    appliedPromo = null;
    saveCart();
}

function showSuccessModal() {
    const successModal = document.getElementById('success-modal');
    openModal(successModal);
    
    // Cerrar modal al hacer clic en el overlay
    successModal.querySelector('.modal-overlay').addEventListener('click', () => {
        closeModal(successModal);
        window.location.href = '../index.html';
    });
}

// ============================================
// UTILIDADES DE MODAL
// ============================================
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus trap
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    firstElement?.focus();
    
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(modal);
        }
        
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// NOTIFICACIONES
// ============================================
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Animaciones para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// FUNCIONES GLOBALES (expuestas al HTML)
// ============================================
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.removeItem = removeItem;
