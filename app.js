// Enhanced Portfolio Interactive Features with CV Download System
document.addEventListener('DOMContentLoaded', function() {
    
    // Immediately hide loading screen to prevent blocking
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 100);
    }
    
    // Configuration
    const config = {
        typingSpeed: 100,
        typingDelay: 2000,
        scrollOffset: 100,
        animationDelay: 200,
        particleCount: 50,
        particleSpeed: 0.5,
        formSteps: 3,
        cvDownloadUrl: './Ahmed-Hany-Boshra_CV.pdf',
        cvWordUrl: './Ahmed-Hany-Boshra_CV.docx',
        portfolioUrl: 'https://Ahmed-Hany-Aou.github.io'
    };

    // CV Download Analytics
    class CVAnalytics {
        constructor() {
            this.downloadCount = parseInt(localStorage.getItem('cv_download_count') || '0');
            this.downloadHistory = JSON.parse(localStorage.getItem('cv_download_history') || '[]');
            this.updateDisplays();
        }

        trackDownload(format = 'pdf') {
            this.downloadCount++;
            const downloadEvent = {
                timestamp: new Date().toISOString(),
                format: format,
                userAgent: navigator.userAgent,
                referrer: document.referrer
            };
            
            this.downloadHistory.push(downloadEvent);
            
            // Keep only last 100 downloads in history
            if (this.downloadHistory.length > 100) {
                this.downloadHistory = this.downloadHistory.slice(-100);
            }
            
            localStorage.setItem('cv_download_count', this.downloadCount.toString());
            localStorage.setItem('cv_download_history', JSON.stringify(this.downloadHistory));
            
            this.updateDisplays();
            
            // Send analytics event
            this.sendAnalytics(downloadEvent);
        }

        updateDisplays() {
            const downloadCountElements = document.querySelectorAll('#download-count');
            downloadCountElements.forEach(el => {
                el.textContent = this.downloadCount;
            });
        }

        sendAnalytics(event) {
            console.log('CV Download Analytics:', event);
            
            // Example: Send to Google Analytics 4
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cv_download', {
                    'format': event.format,
                    'timestamp': event.timestamp
                });
            }
        }

        getStats() {
            return {
                totalDownloads: this.downloadCount,
                recentDownloads: this.downloadHistory.slice(-10),
                formatBreakdown: this.downloadHistory.reduce((acc, download) => {
                    acc[download.format] = (acc[download.format] || 0) + 1;
                    return acc;
                }, {})
            };
        }
    }

    // CV Download Manager
    class CVDownloadManager {
        constructor() {
            this.analytics = new CVAnalytics();
            this.downloadButtons = document.querySelectorAll('.cv-download-btn');
            this.previewButtons = document.querySelectorAll('.cv-preview-btn');
            this.cvModal = document.getElementById('cv-modal');
            this.formatSelect = document.getElementById('cv-format');
            
            this.init();
        }

        init() {
            this.bindEvents();
            this.setupDownloadButtons();
        }

        bindEvents() {
            // Download button events
            this.downloadButtons.forEach(btn => {
                btn.addEventListener('click', (e) => this.handleDownload(e));
            });

            // Preview button events
            this.previewButtons.forEach(btn => {
                btn.addEventListener('click', (e) => this.showPreview(e));
            });

            // Format change event
            if (this.formatSelect) {
                this.formatSelect.addEventListener('change', () => {
                    this.updateDownloadUrls();
                });
            }

            // Modal download button
            const modalDownloadBtn = document.querySelector('.modal-download-btn');
            if (modalDownloadBtn) {
                modalDownloadBtn.addEventListener('click', () => {
                    this.downloadCV(this.getSelectedFormat());
                });
            }
        }

        setupDownloadButtons() {
            // Add hover effects and animations
            this.downloadButtons.forEach(btn => {
                this.addRippleEffect(btn);
                
                // Add download icon animation on hover
                btn.addEventListener('mouseenter', () => {
                    const icon = btn.querySelector('i');
                    if (icon && icon.classList.contains('fa-download')) {
                        icon.style.animation = 'bounce 0.6s ease-in-out';
                    }
                });

                btn.addEventListener('mouseleave', () => {
                    const icon = btn.querySelector('i');
                    if (icon) {
                        icon.style.animation = '';
                    }
                });
            });
        }

        addRippleEffect(button) {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
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
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        }

        async handleDownload(e) {
            e.preventDefault();
            const button = e.currentTarget;
            const format = button.dataset.format || 'pdf';
            
            await this.downloadCV(format, button);
        }

        async downloadCV(format = 'pdf', button = null) {
            const downloadUrl = format === 'docx' ? config.cvWordUrl : config.cvDownloadUrl;
            const filename = `Ahmed-Hany-Boshra_CV.${format}`;

            try {
                if (button) {
                    this.setDownloadState(button, 'loading');
                }

                // Simulate download preparation
                await new Promise(resolve => setTimeout(resolve, 800));

                // Create download link
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = filename;
                link.style.display = 'none';
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Track analytics
                this.analytics.trackDownload(format);

                if (button) {
                    this.setDownloadState(button, 'success');
                    setTimeout(() => {
                        this.setDownloadState(button, 'default');
                    }, 2000);
                }

                // Show success notification
                this.showNotification(
                    `CV downloaded successfully! Thank you for your interest.`,
                    'success'
                );

                // Close modal if open
                this.hideModal();

            } catch (error) {
                console.error('Download failed:', error);
                
                if (button) {
                    this.setDownloadState(button, 'error');
                    setTimeout(() => {
                        this.setDownloadState(button, 'default');
                    }, 3000);
                }

                this.showNotification(
                    'Download failed. Please try again or contact me directly.',
                    'error'
                );
            }
        }

        setDownloadState(button, state) {
            const icon = button.querySelector('i');
            const text = button.querySelector('span:not(.btn-subtext)') || button;
            
            button.classList.remove('loading', 'success', 'error');
            
            switch (state) {
                case 'loading':
                    button.classList.add('loading');
                    button.disabled = true;
                    if (icon) {
                        icon.className = 'fas fa-spinner';
                    }
                    if (text.textContent) {
                        button.dataset.originalText = text.textContent;
                        text.textContent = 'Downloading...';
                    }
                    break;

                case 'success':
                    button.classList.add('success');
                    button.disabled = false;
                    if (icon) {
                        icon.className = 'fas fa-check';
                    }
                    if (text.textContent) {
                        text.textContent = 'Downloaded!';
                    }
                    break;

                case 'error':
                    button.classList.add('error');
                    button.disabled = false;
                    if (icon) {
                        icon.className = 'fas fa-exclamation-triangle';
                    }
                    if (text.textContent) {
                        text.textContent = 'Try Again';
                    }
                    break;

                default:
                    button.disabled = false;
                    if (icon) {
                        icon.className = 'fas fa-download';
                    }
                    if (button.dataset.originalText && text.textContent) {
                        text.textContent = button.dataset.originalText;
                        delete button.dataset.originalText;
                    }
                    break;
            }
        }

        showPreview() {
            if (this.cvModal) {
                this.cvModal.classList.add('show');
                this.cvModal.setAttribute('aria-hidden', 'false');
                
                // Focus management
                const firstFocusable = this.cvModal.querySelector('select, button');
                if (firstFocusable) {
                    firstFocusable.focus();
                }

                // Update download URLs
                this.updateDownloadUrls();
            }
        }

        hideModal() {
            if (this.cvModal) {
                this.cvModal.classList.remove('show');
                this.cvModal.setAttribute('aria-hidden', 'true');
            }
        }

        updateDownloadUrls() {
            const format = this.getSelectedFormat();
            const modalDownloadBtn = document.querySelector('.modal-download-btn');
            
            if (modalDownloadBtn) {
                modalDownloadBtn.dataset.format = format;
                
                // Update button text and icon based on format
                const icon = modalDownloadBtn.querySelector('i');
                if (format === 'docx') {
                    if (icon) icon.className = 'fas fa-file-word';
                    modalDownloadBtn.innerHTML = '<i class="fas fa-file-word"></i> Download Word';
                } else {
                    if (icon) icon.className = 'fas fa-download';
                    modalDownloadBtn.innerHTML = '<i class="fas fa-download"></i> Download PDF';
                }
            }

            // Update file info
            const fileInfo = document.querySelector('.cv-file-details strong');
            if (fileInfo) {
                const extension = format === 'docx' ? 'docx' : 'pdf';
                fileInfo.textContent = `Ahmed-Hany-Boshra_CV.${extension}`;
            }
        }

        getSelectedFormat() {
            return this.formatSelect ? this.formatSelect.value : 'pdf';
        }

        showNotification(message, type = 'info') {
            // Remove existing notifications
            const existingNotification = document.querySelector('.notification');
            if (existingNotification) {
                existingNotification.remove();
            }

            const notification = document.createElement('div');
            notification.className = `notification notification--${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas ${this.getNotificationIcon(type)}"></i>
                    <span>${message}</span>
                    <button class="notification-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

            document.body.appendChild(notification);

            // Show notification
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);

            // Handle close button
            notification.querySelector('.notification-close').addEventListener('click', () => {
                this.hideNotification(notification);
            });

            // Auto hide after 5 seconds
            setTimeout(() => {
                this.hideNotification(notification);
            }, 5000);
        }

        hideNotification(notification) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }

        getNotificationIcon(type) {
            const icons = {
                success: 'fa-check-circle',
                error: 'fa-exclamation-triangle',
                warning: 'fa-exclamation-circle',
                info: 'fa-info-circle'
            };
            return icons[type] || icons.info;
        }
    }

    // Share Portfolio Manager
    class ShareManager {
        constructor() {
            this.shareButtons = document.querySelectorAll('.share-portfolio-btn');
            this.shareModal = document.getElementById('share-modal');
            this.init();
        }

        init() {
            this.bindEvents();
        }

        bindEvents() {
            // Share button events
            this.shareButtons.forEach(btn => {
                btn.addEventListener('click', () => this.showShareModal());
            });

            // Share option events
            document.addEventListener('click', (e) => {
                if (e.target.closest('.share-option')) {
                    const platform = e.target.closest('.share-option').dataset.platform;
                    this.shareToPlatform(platform);
                }
            });

            // Copy URL button
            const copyUrlBtn = document.querySelector('.copy-url-btn');
            if (copyUrlBtn) {
                copyUrlBtn.addEventListener('click', () => this.copyPortfolioUrl());
            }
        }

        showShareModal() {
            if (this.shareModal) {
                this.shareModal.classList.add('show');
                this.shareModal.setAttribute('aria-hidden', 'false');
            }
        }

        hideShareModal() {
            if (this.shareModal) {
                this.shareModal.classList.remove('show');
                this.shareModal.setAttribute('aria-hidden', 'true');
            }
        }

        shareToPlatform(platform) {
            const portfolioUrl = config.portfolioUrl;
            const title = 'Ahmed Hany Boshra - Laravel Backend Engineer Portfolio';
            const description = 'Senior Laravel Backend Engineer specializing in scalable SaaS solutions and modern admin interfaces. View my projects and download my CV.';

            let shareUrl = '';

            switch (platform) {
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}`;
                    break;

                case 'twitter':
                    const twitterText = `Check out ${title} - ${description}`;
                    shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(portfolioUrl)}`;
                    break;

                case 'email':
                    const subject = encodeURIComponent(title);
                    const body = encodeURIComponent(`${description}\n\nVisit: ${portfolioUrl}`);
                    shareUrl = `mailto:?subject=${subject}&body=${body}`;
                    break;

                case 'copy':
                    this.copyPortfolioUrl();
                    return;

                default:
                    return;
            }

            if (shareUrl) {
                window.open(shareUrl, '_blank', 'noopener,noreferrer');
                this.hideShareModal();
                
                // Track share event
                this.trackShare(platform);
            }
        }

        copyPortfolioUrl() {
            const portfolioUrl = config.portfolioUrl;
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(portfolioUrl).then(() => {
                    this.showShareNotification('Portfolio URL copied to clipboard!');
                    this.hideShareModal();
                });
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = portfolioUrl;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                this.showShareNotification('Portfolio URL copied to clipboard!');
                this.hideShareModal();
            }
        }

        showShareNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'notification notification--success';
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-check-circle"></i>
                    <span>${message}</span>
                    <button class="notification-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('show');
            }, 10);

            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            });

            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }, 3000);
        }

        trackShare(platform) {
            console.log(`Portfolio shared via ${platform}`);
            
            // Send analytics event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'share', {
                    'method': platform,
                    'content_type': 'portfolio',
                    'item_id': 'ahmed_hany_portfolio'
                });
            }
        }
    }

    // Enhanced Typing Animation
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

    // Theme Toggle System
    class ThemeManager {
        constructor() {
            this.themeToggle = document.getElementById('theme-toggle');
            this.themeIcon = document.getElementById('theme-icon');
            this.currentTheme = localStorage.getItem('theme') || 'auto';
            this.init();
        }

        init() {
            this.applyTheme();
            this.bindEvents();
        }

        bindEvents() {
            this.themeToggle?.addEventListener('click', () => this.toggleTheme());
            
            // Listen for system theme changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                if (this.currentTheme === 'auto') {
                    this.applyTheme();
                }
            });
        }

        toggleTheme() {
            const themes = ['light', 'dark', 'auto'];
            const currentIndex = themes.indexOf(this.currentTheme);
            this.currentTheme = themes[(currentIndex + 1) % themes.length];
            
            localStorage.setItem('theme', this.currentTheme);
            this.applyTheme();
        }

        applyTheme() {
            const body = document.body;
            const isDarkMode = this.currentTheme === 'dark' || 
                (this.currentTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

            body.setAttribute('data-color-scheme', isDarkMode ? 'dark' : 'light');
            
            if (this.themeIcon) {
                this.themeIcon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }

    // Enhanced Navigation System
    class Navigation {
        constructor() {
            this.navbar = document.getElementById('navbar');
            this.navToggle = document.getElementById('nav-toggle');
            this.navMenu = document.getElementById('nav-menu');
            this.navLinks = document.querySelectorAll('.nav-link');
            this.sections = document.querySelectorAll('section[id]');
            this.scrollProgress = document.querySelector('.scroll-progress');
            this.backToTop = document.getElementById('back-to-top');
            
            this.init();
        }

        init() {
            this.bindEvents();
            this.updateActiveLink();
            this.updateScrollProgress();
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

            // Scroll events with throttling
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        this.updateActiveLink();
                        this.updateScrollProgress();
                        this.handleNavbarAppearance();
                        this.handleBackToTop();
                        ticking = false;
                    });
                    ticking = true;
                }
            });

            // Back to top functionality
            this.backToTop?.addEventListener('click', () => this.scrollToTop());

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.navbar?.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMobileMenu();
                    
                    // Also close modals
                    const modals = document.querySelectorAll('.modal.show');
                    modals.forEach(modal => {
                        modal.classList.remove('show');
                        modal.setAttribute('aria-hidden', 'true');
                    });
                }
            });
        }

        toggleMobileMenu() {
            const isActive = this.navMenu?.classList.contains('active');
            this.navMenu?.classList.toggle('active');
            this.navToggle?.classList.toggle('active');
            
            // Update ARIA attributes
            this.navToggle?.setAttribute('aria-expanded', !isActive);
        }

        closeMobileMenu() {
            this.navMenu?.classList.remove('active');
            this.navToggle?.classList.remove('active');
            this.navToggle?.setAttribute('aria-expanded', 'false');
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
                
                // Update URL without triggering page jump
                history.pushState(null, null, targetId);
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

        updateScrollProgress() {
            if (!this.scrollProgress) return;
            
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            this.scrollProgress.style.width = `${Math.min(scrollPercent, 100)}%`;
        }

        handleNavbarAppearance() {
            if (window.scrollY > 50) {
                this.navbar?.classList.add('scrolled');
            } else {
                this.navbar?.classList.remove('scrolled');
            }
        }

        handleBackToTop() {
            if (window.scrollY > 500) {
                this.backToTop?.classList.add('show');
            } else {
                this.backToTop?.classList.remove('show');
            }
        }

        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    // Modal Manager for all modals
    class ModalManager {
        constructor() {
            this.modals = document.querySelectorAll('.modal');
            this.init();
        }

        init() {
            this.bindEvents();
        }

        bindEvents() {
            // Close modals when clicking overlay or close button
            this.modals.forEach(modal => {
                const overlay = modal.querySelector('.modal-overlay');
                const closeBtn = modal.querySelector('.modal-close');
                
                if (overlay) {
                    overlay.addEventListener('click', () => {
                        this.hideModal(modal);
                    });
                }
                
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        this.hideModal(modal);
                    });
                }
            });
        }

        hideModal(modal) {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    // Add CSS keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize all components
    try {
        const themeManager = new ThemeManager();
        const navigation = new Navigation();
        const modalManager = new ModalManager();
        
        // Initialize CV Download System
        const cvDownloadManager = new CVDownloadManager();
        const shareManager = new ShareManager();
        
        // Initialize typing animation
        const typingElement = document.getElementById('typing-text');
        const typingPhrases = [
            'a Senior Laravel Backend Engineer.',
            'a Filament Enthusiast.',
            'an API Integration Specialist.',
            'building scalable SaaS solutions.',
            'passionate about clean code.',
            'ready for your next project.'
        ];

        if (typingElement) {
            new TypingAnimation(typingElement, typingPhrases);
        }

        // Global utility functions
        window.portfolioUtils = {
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

            downloadCV: (format = 'pdf') => {
                cvDownloadManager.downloadCV(format);
            },

            sharePortfolio: (platform) => {
                shareManager.shareToPlatform(platform);
            },

            getCVStats: () => {
                return cvDownloadManager.analytics.getStats();
            }
        };

        console.log('✅ Ahmed Hany Boshra Portfolio - Enhanced version with CV Download System loaded successfully!');
        console.log('📄 CV Download and sharing features are ready');
        console.log('🎯 Filament Forever - Building the future, one line at a time.');
        
    } catch (error) {
        console.error('Portfolio initialization error:', error);
    }
});

// Handle reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--duration-fast', '0.01ms');
    document.documentElement.style.setProperty('--duration-normal', '0.01ms');
}