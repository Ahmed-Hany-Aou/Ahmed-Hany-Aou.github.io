// Portfolio Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    
    // Configuration
    const config = {
        typingSpeed: 100,
        typingDelay: 2000,
        scrollOffset: 100,
        animationDelay: 200
    };

    // Typing Animation
    class TypingAnimation {
        constructor(element, phrases) {
            this.element = element;
            this.phrases = phrases;
            this.currentPhraseIndex = 0;
            this.currentCharIndex = 0;
            this.isDeleting = false;
            this.init();
        }

        init() {
            this.type();
        }

        type() {
            const currentPhrase = this.phrases[this.currentPhraseIndex];
            
            if (this.isDeleting) {
                this.element.textContent = currentPhrase.substring(0, this.currentCharIndex - 1);
                this.currentCharIndex--;
            } else {
                this.element.textContent = currentPhrase.substring(0, this.currentCharIndex + 1);
                this.currentCharIndex++;
            }

            let typeSpeed = this.isDeleting ? config.typingSpeed / 2 : config.typingSpeed;

            if (!this.isDeleting && this.currentCharIndex === currentPhrase.length) {
                typeSpeed = config.typingDelay;
                this.isDeleting = true;
            } else if (this.isDeleting && this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.phrases.length;
            }

            setTimeout(() => this.type(), typeSpeed);
        }
    }

    // Initialize typing animation
    const typingElement = document.getElementById('typing-text');
    const typingPhrases = [
        'a Laravel Backend Engineer.',
        'a Filament Enthusiast.',
        'an API Integration Specialist.',
        'a Problem Solver.',
        'passionate about clean code.'
    ];

    if (typingElement) {
        new TypingAnimation(typingElement, typingPhrases);
    }

    // Navigation Functionality
    class Navigation {
        constructor() {
            this.navbar = document.getElementById('navbar');
            this.navToggle = document.getElementById('nav-toggle');
            this.navMenu = document.getElementById('nav-menu');
            this.navLinks = document.querySelectorAll('.nav-link');
            this.sections = document.querySelectorAll('section[id]');
            
            this.init();
        }

        init() {
            this.bindEvents();
            this.createScrollIndicator();
            this.updateActiveLink();
        }

        bindEvents() {
            // Mobile menu toggle
            this.navToggle?.addEventListener('click', () => this.toggleMobileMenu());

            // Smooth scroll for navigation links
            this.navLinks.forEach(link => {
                link.addEventListener('click', (e) => this.handleNavClick(e));
            });

            // Close mobile menu when clicking on links
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMobileMenu());
            });

            // Update active link on scroll
            window.addEventListener('scroll', () => {
                this.updateActiveLink();
                this.updateScrollIndicator();
                this.handleNavbarTransparency();
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.navbar?.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }

        toggleMobileMenu() {
            this.navMenu?.classList.toggle('active');
            this.navToggle?.classList.toggle('active');
        }

        closeMobileMenu() {
            this.navMenu?.classList.remove('active');
            this.navToggle?.classList.remove('active');
        }

        handleNavClick(e) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - config.scrollOffset;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }

        updateActiveLink() {
            const scrollPos = window.scrollY + config.scrollOffset;
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        createScrollIndicator() {
            const indicator = document.createElement('div');
            indicator.className = 'scroll-indicator';
            document.body.appendChild(indicator);
            this.scrollIndicator = indicator;
        }

        updateScrollIndicator() {
            if (!this.scrollIndicator) return;
            
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            this.scrollIndicator.style.width = `${scrollPercent}%`;
        }

        handleNavbarTransparency() {
            if (window.scrollY > 50) {
                this.navbar?.classList.add('scrolled');
            } else {
                this.navbar?.classList.remove('scrolled');
            }
        }
    }

    // Tab Functionality for Featured Project
    class TabManager {
        constructor() {
            this.tabButtons = document.querySelectorAll('.tab-button');
            this.tabPanes = document.querySelectorAll('.tab-pane');
            this.init();
        }

        init() {
            this.tabButtons.forEach(button => {
                button.addEventListener('click', (e) => this.switchTab(e));
            });
        }

        switchTab(e) {
            const targetTab = e.target.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            this.tabButtons.forEach(btn => btn.classList.remove('active'));
            this.tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button
            e.target.classList.add('active');
            
            // Show corresponding tab pane
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        }
    }

    // Scroll Animations
    class ScrollAnimations {
        constructor() {
            this.animatedElements = [];
            this.init();
        }

        init() {
            this.setupIntersectionObserver();
            this.addFadeInElements();
        }

        setupIntersectionObserver() {
            const options = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, config.animationDelay);
                    }
                });
            }, options);
        }

        addFadeInElements() {
            const elementsToAnimate = [
                '.section-header',
                '.about-content',
                '.featured-content',
                '.project-card',
                '.skill-category',
                '.contact-content',
                '.achievement-card'
            ];

            elementsToAnimate.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach((element, index) => {
                    element.classList.add('fade-in');
                    element.style.transitionDelay = `${index * 0.1}s`;
                    this.observer.observe(element);
                });
            });
        }
    }

    // Contact Form Handler
    class ContactForm {
        constructor() {
            this.form = document.getElementById('contact-form');
            this.init();
        }

        init() {
            if (this.form) {
                this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            }
        }

        handleSubmit(e) {
            e.preventDefault();
            
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (!this.validateForm(data)) {
                return;
            }

            // Show loading state
            const submitBtn = this.form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual implementation)
            setTimeout(() => {
                this.showSuccessMessage();
                this.form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }

        validateForm(data) {
            const { name, email, message } = data;
            
            if (!name || name.trim().length < 2) {
                this.showError('Please enter a valid name (at least 2 characters)');
                return false;
            }
            
            if (!email || !this.isValidEmail(email)) {
                this.showError('Please enter a valid email address');
                return false;
            }
            
            if (!message || message.trim().length < 10) {
                this.showError('Please enter a message (at least 10 characters)');
                return false;
            }
            
            return true;
        }

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        showError(message) {
            this.showNotification(message, 'error');
        }

        showSuccessMessage() {
            this.showNotification('Thank you! Your message has been sent successfully. I\'ll get back to you soon!', 'success');
        }

        showNotification(message, type) {
            // Remove existing notifications
            const existingNotification = document.querySelector('.notification');
            if (existingNotification) {
                existingNotification.remove();
            }

            const notification = document.createElement('div');
            notification.className = `notification notification--${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                    <span>${message}</span>
                    <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

            // Add notification styles
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                padding: 16px;
                background: ${type === 'success' ? 'var(--color-success)' : 'var(--color-error)'};
                color: white;
                border-radius: var(--radius-base);
                box-shadow: var(--shadow-lg);
                transform: translateX(100%);
                transition: transform var(--duration-normal) var(--ease-standard);
            `;

            notification.querySelector('.notification-content').style.cssText = `
                display: flex;
                align-items: center;
                gap: 12px;
            `;

            notification.querySelector('.notification-close').style.cssText = `
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 4px;
                margin-left: auto;
            `;

            document.body.appendChild(notification);

            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 10);

            // Auto remove after 5 seconds
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }, 5000);
        }
    }

    // Enhanced Interactions
    class EnhancedInteractions {
        constructor() {
            this.init();
        }

        init() {
            this.addHoverEffects();
            this.addKeyboardNavigation();
            this.addParallaxEffect();
            this.addSmoothScrollToTop();
        }

        addHoverEffects() {
            // Add subtle hover effects to cards
            const cards = document.querySelectorAll('.project-card, .skill-category, .achievement-card, .contact-card');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-8px)';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = '';
                });
            });

            // Add ripple effect to buttons
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(button => {
                button.addEventListener('click', (e) => this.createRippleEffect(e));
            });
        }

        createRippleEffect(e) {
            const button = e.currentTarget;
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

            // Add ripple animation
            if (!document.querySelector('#ripple-styles')) {
                const style = document.createElement('style');
                style.id = 'ripple-styles';
                style.textContent = `
                    @keyframes ripple {
                        to {
                            transform: scale(4);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        }

        addKeyboardNavigation() {
            // Enhanced keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    // Close mobile menu on escape
                    const navMenu = document.getElementById('nav-menu');
                    const navToggle = document.getElementById('nav-toggle');
                    navMenu?.classList.remove('active');
                    navToggle?.classList.remove('active');
                }
            });

            // Add focus management for better accessibility
            const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
            focusableElements.forEach(element => {
                element.addEventListener('focus', () => {
                    element.style.outline = 'var(--focus-outline)';
                    element.style.outlineOffset = '2px';
                });
                
                element.addEventListener('blur', () => {
                    element.style.outline = '';
                    element.style.outlineOffset = '';
                });
            });
        }

        addParallaxEffect() {
            // Subtle parallax effect for hero section
            const hero = document.querySelector('.hero');
            if (hero) {
                window.addEventListener('scroll', () => {
                    const scrolled = window.pageYOffset;
                    const rate = scrolled * -0.5;
                    hero.style.transform = `translateY(${rate}px)`;
                });
            }
        }

        addSmoothScrollToTop() {
            // Add scroll to top functionality
            const scrollToTopBtn = document.createElement('button');
            scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            scrollToTopBtn.className = 'scroll-to-top';
            scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
            
            scrollToTopBtn.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                background: var(--color-primary);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                font-size: 18px;
                z-index: 1000;
                transform: scale(0);
                transition: all var(--duration-normal) var(--ease-standard);
                box-shadow: var(--shadow-lg);
            `;

            document.body.appendChild(scrollToTopBtn);

            // Show/hide scroll to top button
            window.addEventListener('scroll', () => {
                if (window.scrollY > 500) {
                    scrollToTopBtn.style.transform = 'scale(1)';
                } else {
                    scrollToTopBtn.style.transform = 'scale(0)';
                }
            });

            // Scroll to top on click
            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // Performance Optimization
    class PerformanceOptimizer {
        constructor() {
            this.init();
        }

        init() {
            this.debounceScrollEvents();
            this.lazyLoadImages();
            this.preloadCriticalResources();
        }

        debounceScrollEvents() {
            let ticking = false;
            
            const optimizedScroll = () => {
                // All scroll-based functions are already handled efficiently
                ticking = false;
            };

            document.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(optimizedScroll);
                    ticking = true;
                }
            });
        }

        lazyLoadImages() {
            const images = document.querySelectorAll('img[data-src]');
            
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    });
                });

                images.forEach(img => imageObserver.observe(img));
            }
        }

        preloadCriticalResources() {
            // Preload important fonts and resources
            const criticalResources = [
                'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
            ];

            criticalResources.forEach(resource => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = resource;
                link.as = 'style';
                document.head.appendChild(link);
            });
        }
    }

    // Initialize all components
    const navigation = new Navigation();
    const tabManager = new TabManager();
    const scrollAnimations = new ScrollAnimations();
    const contactForm = new ContactForm();
    const enhancedInteractions = new EnhancedInteractions();
    const performanceOptimizer = new PerformanceOptimizer();

    // Additional utility functions
    window.portfolioUtils = {
        // Smooth scroll to section
        scrollToSection: (sectionId) => {
            const section = document.getElementById(sectionId);
            if (section) {
                const offsetTop = section.offsetTop - config.scrollOffset;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        },

        // Get current section
        getCurrentSection: () => {
            const scrollPos = window.scrollY + config.scrollOffset;
            const sections = document.querySelectorAll('section[id]');
            
            for (let section of sections) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    return section.getAttribute('id');
                }
            }
            return null;
        },

        // Download CV (placeholder function)
        downloadCV: () => {
            // This would typically trigger a download of the CV file
            console.log('CV download triggered');
            // For demo purposes, just scroll to contact
            window.portfolioUtils.scrollToSection('contact');
        }
    };

    // Log successful initialization
    console.log('✨ Ahmed Hany Boshra Portfolio - All systems loaded successfully!');
    console.log('🚀 Interactive features ready');
    console.log('💼 Professional portfolio experience activated');
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Commented out for now - would register SW for production
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Export for potential external usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        config,
        TypingAnimation,
        Navigation,
        TabManager,
        ScrollAnimations,
        ContactForm,
        EnhancedInteractions,
        PerformanceOptimizer
    };
}