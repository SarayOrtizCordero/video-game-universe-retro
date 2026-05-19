/**
 * Video Game Universe - Contacto Page
 * JavaScript functionality for contact form and navigation
 */

(function() {
    'use strict';

    // ============================================
    // NAVIGATION - Usa función global
    // ============================================
    function initNavigation() {
        // Actualizar contador del carrito
        if (window.CartManager) {
            window.CartManager.updateCounter();
        }
    }

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    function initHeaderScroll() {
        const header = document.querySelector('.main-header');
        if (!header) return;

        let lastScrollTop = 0;
        const scrollThreshold = 100;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScrollTop = scrollTop;
        });
    }

    // ============================================
    // CONTACT FORM VALIDATION & SUBMISSION
    // ============================================
    function initContactForm() {
        const form = document.getElementById('contactForm');
        const messageDiv = document.getElementById('formMessage');

        if (!form) return;

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim()
            };

            // Validate form
            if (!validateForm(formData)) {
                showMessage('Por favor, completa todos los campos correctamente.', 'error');
                return;
            }

            // Disable submit button
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Enviando...</span>';

            // Simulate form submission (replace with actual API call)
            try {
                await simulateFormSubmission(formData);
                showMessage('¡Mensaje enviado con éxito! Te responderemos pronto.', 'success');
                form.reset();
            } catch (error) {
                showMessage('Error al enviar el mensaje. Por favor, intenta de nuevo.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('invalid')) {
                    validateField(this);
                }
            });
        });
    }

    function validateForm(data) {
        let isValid = true;

        // Name validation
        if (data.name.length < 2) {
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            isValid = false;
        }

        // Subject validation
        if (data.subject.length < 3) {
            isValid = false;
        }

        // Message validation
        if (data.message.length < 10) {
            isValid = false;
        }

        return isValid;
    }

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                break;
            case 'text':
                isValid = value.length >= 2;
                break;
            case 'textarea':
                isValid = value.length >= 10;
                break;
        }

        if (isValid) {
            field.classList.remove('invalid');
            field.classList.add('valid');
        } else {
            field.classList.remove('valid');
            field.classList.add('invalid');
        }

        return isValid;
    }

    function showMessage(message, type) {
        const messageDiv = document.getElementById('formMessage');
        if (!messageDiv) return;

        messageDiv.textContent = message;
        messageDiv.className = 'form-message ' + type;
        messageDiv.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }

    function simulateFormSubmission(data) {
        return new Promise((resolve, reject) => {
            // Simulate API call delay
            setTimeout(() => {
                // Simulate success (90% success rate)
                if (Math.random() > 0.1) {
                    console.log('Form submitted:', data);
                    resolve();
                } else {
                    reject(new Error('Submission failed'));
                }
            }, 1500);
        });
    }

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe contact cards
        const cards = document.querySelectorAll('.contact-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });

        // Observe form section
        const formSection = document.querySelector('.contact-form-section');
        if (formSection) {
            formSection.style.opacity = '0';
            formSection.style.transform = 'translateY(30px)';
            formSection.style.transition = 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s';
            observer.observe(formSection);
        }

        // Observe map section
        const mapSection = document.querySelector('.map-section');
        if (mapSection) {
            mapSection.style.opacity = '0';
            mapSection.style.transform = 'translateY(30px)';
            mapSection.style.transition = 'opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s';
            observer.observe(mapSection);
        }
    }

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        .form-group input.valid,
        .form-group textarea.valid {
            border-color: #00ff00;
        }

        .form-group input.invalid,
        .form-group textarea.invalid {
            border-color: #ff6b6b;
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // INITIALIZE ALL FUNCTIONS
    // ============================================
    function init() {
        initNavigation();
        initHeaderScroll();
        initContactForm();
        initScrollAnimations();

        console.log('Contacto page initialized successfully');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
