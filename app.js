// ============================================
// ENHANCED PORTFOLIO - UNIFIED JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // CONFIGURATION
    // ============================================
    
    const config = {
        typingSpeed: 100,
        typingDelay: 2000,
        scrollOffset: 100,
        animationDelay: 200,
        cvDownloadUrl: './Ahmed-Hany-Boshra_CV.pdf',
        cvWordUrl: './Ahmed-Hany-Boshra_CV.docx',
        portfolioUrl: 'https://Ahmed-Hany-Aou.github.io'
    };

    // ============================================
    // LOADING SCREEN
    // ============================================
    
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 100);
    }

    // ============================================
    // THEME MANAGER
    // ============================================
    
    class ThemeManager {
        constructor() {
            this.themeToggle = document.getElementById('theme-toggle');
            this.themeIcon = document.getElementById('theme-icon');
            this.currentTheme = localStorage.getItem('theme') || 'dark';
            this.init();
        }

        init() {
            this.applyTheme(false);
            this.bindEvents();
        }

        bindEvents() {
            this.themeToggle?.addEventListener('click', () => this.toggleTheme());
            
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (this.currentTheme === 'auto') {
                    this.applyTheme();
                }
            });
        }

        toggleTheme() {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', this.currentTheme);
            this.applyTheme(true);
        }

        applyTheme(animate = true) {
            const isDark = this.currentTheme === 'dark';
            
            if (!animate) {
                document.documentElement.style.setProperty('--transition-base', '0ms');
            }
            
            document.body.setAttribute('data-color-scheme', isDark ? 'dark' : 'light');
            
            if (this.themeIcon) {
                this.themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            }
            
            if (!animate) {
                setTimeout(() => {
                    document.documentElement.style.removeProperty('--transition-base');
                }, 50);
            }
        }
    }

    // ============================================
    // NAVIGATION SYSTEM
    // ============================================
    
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
            this.navToggle?.addEventListener('click', () => this.toggleMobileMenu());

            this.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    this.handleNavClick(e);
                    this.closeMobileMenu();
                });
            });

            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        this.updateActiveLink();
                        this.updateScrollProgress();
                        this.handleNavbarAppearance();
                        this.handleBackToTop();
                        this.handleScrollAnimations();
                        ticking = false;
                    });
                    ticking = true;
                }
            });

            this.backToTop?.addEventListener('click', () => this.scrollToTop());

            document.addEventListener('click', (e) => {
                if (!this.navbar?.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMobileMenu();
                    this.closeAllModals();
                }
            });
        }

        toggleMobileMenu() {
            const isActive = this.navMenu?.classList.contains('active');
            this.navMenu?.classList.toggle('active');
            this.navToggle?.classList.toggle('active');
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
                history.pushState(null, null, targetId);
            }
        }

        updateActiveLink() {
            const scrollPos = window.scrollY + config.scrollOffset + 50;
            
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

        handleScrollAnimations() {
            const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
            
            elements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight * 0.8;
                
                if (isVisible) {
                    element.classList.add('visible');
                }
            });
            
            // Animate skill bars
            const skillItems = document.querySelectorAll('.skill-item');
            skillItems.forEach(item => {
                const rect = item.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight * 0.8;
                
                if (isVisible && !item.classList.contains('animated')) {
                    const progress = item.querySelector('.skill-progress');
                    const level = item.dataset.level;
                    if (progress && level) {
                        progress.style.width = `${level}%`;
                        item.classList.add('animated');
                    }
                }
            });
        }

        closeAllModals() {
            const modals = document.querySelectorAll('.modal.show');
            modals.forEach(modal => {
                modal.classList.remove('show');
                modal.setAttribute('aria-hidden', 'true');
            });
        }
    }

    // ============================================
    // TYPING ANIMATION
    // ============================================
    
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

    // ============================================
    // CV DOWNLOAD ANALYTICS
    // ============================================
    
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
                userAgent: navigator.userAgent
            };
            
            this.downloadHistory.push(downloadEvent);
            
            if (this.downloadHistory.length > 100) {
                this.downloadHistory = this.downloadHistory.slice(-100);
            }
            
            localStorage.setItem('cv_download_count', this.downloadCount.toString());
            localStorage.setItem('cv_download_history', JSON.stringify(this.downloadHistory));
            
            this.updateDisplays();
        }

        updateDisplays() {
            const downloadCountElements = document.querySelectorAll('#download-count');
            downloadCountElements.forEach(el => {
                el.textContent = this.downloadCount;
            });
        }
    }

    // ============================================
    // CV DOWNLOAD MANAGER
    // ============================================
    
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
        }

        bindEvents() {
            this.downloadButtons.forEach(btn => {
                btn.addEventListener('click', (e) => this.handleDownload(e));
            });

            this.previewButtons.forEach(btn => {
                btn.addEventListener('click', () => this.showPreview());
            });

            if (this.formatSelect) {
                this.formatSelect.addEventListener('change', () => {
                    this.updateDownloadUrls();
                });
            }

            const modalDownloadBtn = document.querySelector('.modal-download-btn');
            if (modalDownloadBtn) {
                modalDownloadBtn.addEventListener('click', () => {
                    this.downloadCV(this.getSelectedFormat());
                });
            }
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

                await new Promise(resolve => setTimeout(resolve, 800));

                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = filename;
                link.style.display = 'none';
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                this.analytics.trackDownload(format);

                if (button) {
                    this.setDownloadState(button, 'success');
                    setTimeout(() => {
                        this.setDownloadState(button, 'default');
                    }, 2000);
                }

                this.showNotification(
                    'CV downloaded successfully! Thank you for your interest.',
                    'success'
                );

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
            const textNode = Array.from(button.childNodes).find(node => node.nodeType === 3);
            
            button.classList.remove('loading', 'success', 'error');
            
            switch (state) {
                case 'loading':
                    button.classList.add('loading');
                    button.disabled = true;
                    if (icon) icon.className = 'fas fa-spinner fa-spin';
                    break;

                case 'success':
                    button.classList.add('success');
                    button.disabled = false;
                    if (icon) icon.className = 'fas fa-check';
                    break;

                case 'error':
                    button.classList.add('error');
                    button.disabled = false;
                    if (icon) icon.className = 'fas fa-exclamation-triangle';
                    break;

                default:
                    button.disabled = false;
                    if (icon) icon.className = 'fas fa-download';
                    break;
            }
        }

        showPreview() {
            if (this.cvModal) {
                this.cvModal.classList.add('show');
                this.cvModal.setAttribute('aria-hidden', 'false');
                
                const firstFocusable = this.cvModal.querySelector('select, button');
                if (firstFocusable) {
                    firstFocusable.focus();
                }

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
                
                const icon = modalDownloadBtn.querySelector('i');
                if (format === 'docx') {
                    if (icon) icon.className = 'fas fa-file-word';
                    modalDownloadBtn.innerHTML = '<i class="fas fa-file-word"></i> Download Word';
                } else {
                    if (icon) icon.className = 'fas fa-download';
                    modalDownloadBtn.innerHTML = '<i class="fas fa-download"></i> Download PDF';
                }
            }

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

            setTimeout(() => {
                notification.classList.add('show');
            }, 10);

            notification.querySelector('.notification-close').addEventListener('click', () => {
                this.hideNotification(notification);
            });

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

    // ============================================
    // SHARE MANAGER
    // ============================================
    
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
            this.shareButtons.forEach(btn => {
                btn.addEventListener('click', () => this.showShareModal());
            });

            document.addEventListener('click', (e) => {
                if (e.target.closest('.share-option')) {
                    const platform = e.target.closest('.share-option').dataset.platform;
                    this.shareToPlatform(platform);
                }
            });

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
            const description = 'Senior Laravel Backend Engineer specializing in scalable SaaS solutions and modern admin interfaces.';

            let shareUrl = '';

            switch (platform) {
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}`;
                    break;

                case 'twitter':
                    const twitterText = `Check out ${title}`;
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
                </div>
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('show');
            }, 10);

            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }, 3000);
        }
    }

    // ============================================
    // MODAL MANAGER
    // ============================================
    
    class ModalManager {
        constructor() {
            this.modals = document.querySelectorAll('.modal');
            this.init();
        }

        init() {
            this.bindEvents();
        }

        bindEvents() {
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

    // ============================================
    // PROJECT FILTER & SEARCH
    // ============================================
    
    class ProjectManager {
        constructor() {
            this.projectsGrid = document.getElementById('projects-grid');
            this.projectCards = document.querySelectorAll('.project-card');
            this.searchInput = document.getElementById('project-search');
            this.filterButtons = document.querySelectorAll('.filter-btn');
            this.sortSelect = document.getElementById('project-sort');
            this.currentFilter = 'all';
            
            this.init();
        }

        init() {
            this.bindEvents();
        }

        bindEvents() {
            if (this.searchInput) {
                this.searchInput.addEventListener('input', (e) => {
                    this.filterProjects(e.target.value);
                });
            }

            this.filterButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.filterButtons.forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    this.currentFilter = e.target.dataset.filter;
                    this.applyFilters();
                });
            });

            if (this.sortSelect) {
                this.sortSelect.addEventListener('change', (e) => {
                    this.sortProjects(e.target.value);
                });
            }
        }

        filterProjects(searchTerm) {
            const term = searchTerm.toLowerCase();
            
            this.projectCards.forEach(card => {
                const title = card.dataset.name?.toLowerCase() || '';
                const category = card.dataset.category?.toLowerCase() || '';
                const description = card.querySelector('.project-description')?.textContent.toLowerCase() || '';
                
                const matches = title.includes(term) || category.includes(term) || description.includes(term);
                
                if (matches && (this.currentFilter === 'all' || card.dataset.category === this.currentFilter)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        }

        applyFilters() {
            const searchTerm = this.searchInput?.value || '';
            this.filterProjects(searchTerm);
        }

        sortProjects(sortBy) {
            const projectsArray = Array.from(this.projectCards);
            
            projectsArray.sort((a, b) => {
                switch (sortBy) {
                    case 'name':
                        return (a.dataset.name || '').localeCompare(b.dataset.name || '');
                    case 'category':
                        return (a.dataset.category || '').localeCompare(b.dataset.category || '');
                    case 'type':
                        return (a.dataset.type || '').localeCompare(b.dataset.type || '');
                    default:
                        return 0;
                }
            });

            projectsArray.forEach(card => {
                this.projectsGrid?.appendChild(card);
            });
        }
    }

    // ============================================
    // SKILLS TAB MANAGER
    // ============================================
    
    class SkillsManager {
        constructor() {
            this.skillsTabs = document.querySelectorAll('.skills-tab');
            this.skillsPanes = document.querySelectorAll('.skills-pane');
            
            this.init();
        }

        init() {
            this.bindEvents();
        }

        bindEvents() {
            this.skillsTabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    const targetTab = e.currentTarget.dataset.tab;
                    this.switchTab(targetTab);
                });
            });
        }

        switchTab(tabName) {
            this.skillsTabs.forEach(tab => {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
                if (tab.dataset.tab === tabName) {
                    tab.classList.add('active');
                    tab.setAttribute('aria-selected', 'true');
                }
            });

            this.skillsPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === tabName) {
                    pane.classList.add('active');
                }
            });
        }
    }

    // ============================================
    // CODE TABS MANAGER
    // ============================================
    
    class CodeTabsManager {
        constructor() {
            this.tabButtons = document.querySelectorAll('.tab-button');
            this.tabPanes = document.querySelectorAll('.tab-pane');
            
            this.init();
        }

        init() {
            this.bindEvents();
        }

        bindEvents() {
            this.tabButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const targetTab = e.currentTarget.dataset.tab;
                    this.switchTab(targetTab);
                });
            });
        }

        switchTab(tabName) {
            this.tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
                if (btn.dataset.tab === tabName) {
                    btn.classList.add('active');
                    btn.setAttribute('aria-selected', 'true');
                }
            });

            this.tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === tabName) {
                    pane.classList.add('active');
                }
            });
        }
    }

    // ============================================
    // CONTACT FORM MANAGER
    // ============================================
    
    /* class ContactFormManager {
        constructor() {
            this.contactForm = document.getElementById('contact-form');
            this.copyButtons = document.querySelectorAll('.copy-btn');
            
            this.init();
        }

        init() {
            this.bindEvents();
        }

        bindEvents() {
            if (this.contactForm) {
                this.contactForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleSubmit(e);
                });
            }

            this.copyButtons.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    await this.copyToClipboard(btn);
                });
            });
        }

        async handleSubmit(e) {
            const formData = new FormData(this.contactForm);
            const data = Object.fromEntries(formData);
            
            console.log('Form submitted:', data);
            
            // Show success notification
            const notification = document.createElement('div');
            notification.className = 'notification notification--success';
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-check-circle"></i>
                    <span>Message sent successfully! I'll get back to you soon.</span>
                </div>
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('show');
            }, 10);

            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }, 5000);

            this.contactForm.reset();
        }

        async copyToClipboard(button) {
            const textToCopy = button.dataset.copy;
            const copyText = button.querySelector('.copy-text');
            const icon = button.querySelector('i');
            
            try {
                await navigator.clipboard.writeText(textToCopy);
                button.classList.add('copied');
                if (copyText) copyText.textContent = 'Copied!';
                if (icon) icon.className = 'fas fa-check';
                
                setTimeout(() => {
                    button.classList.remove('copied');
                    if (copyText) copyText.textContent = 'Copy';
                    if (icon) icon.className = 'fas fa-copy';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    }
        */

     // Theme Toggle
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');
        let currentTheme = localStorage.getItem('theme') || 'dark';

        function applyTheme() {
            document.body.setAttribute('data-color-scheme', currentTheme);
            themeIcon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }

        themeToggle.addEventListener('click', () => {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
            applyTheme();
        });

        applyTheme();

        // Form Validation and Handling
        const form = document.getElementById('contact-form');
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        const charCount = document.getElementById('char-count');
        const submitBtn = document.getElementById('submit-btn');

        // Real-time validation
        function validateField(input, errorId, successId, validationFn) {
            const errorMsg = document.getElementById(errorId);
            const successMsg = document.getElementById(successId);
            
            input.addEventListener('blur', () => {
                if (input.value.trim() === '') return;
                
                if (validationFn(input.value)) {
                    input.classList.remove('error');
                    errorMsg.classList.remove('show');
                    successMsg.classList.add('show');
                } else {
                    input.classList.add('error');
                    errorMsg.classList.add('show');
                    successMsg.classList.remove('show');
                }
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('error') && validationFn(input.value)) {
                    input.classList.remove('error');
                    errorMsg.classList.remove('show');
                    successMsg.classList.add('show');
                }
            });
        }

        // Validation functions
        const validateName = (value) => value.trim().length >= 2 && value.trim().length <= 50;
        const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        const validateSubject = (value) => value.trim().length >= 5 && value.trim().length <= 100;
        const validateMessage = (value) => value.trim().length >= 10 && value.trim().length <= 500;

        // Apply validation
        validateField(nameInput, 'name-error', 'name-success', validateName);
        validateField(emailInput, 'email-error', 'email-success', validateEmail);
        validateField(subjectInput, 'subject-error', 'subject-success', validateSubject);
        validateField(messageInput, 'message-error', 'message-success', validateMessage);

        // Character counter
        messageInput.addEventListener('input', () => {
            const length = messageInput.value.length;
            charCount.textContent = `${length} / 500`;
            
            if (length > 450) {
                charCount.classList.add('warning');
            } else {
                charCount.classList.remove('warning');
            }
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate all fields
            const isValid = 
                validateName(nameInput.value) &&
                validateEmail(emailInput.value) &&
                validateSubject(subjectInput.value) &&
                validateMessage(messageInput.value);

            if (!isValid) {
                showNotification('Please fix the errors before submitting', 'error');
                return;
            }

            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Success state
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');
            submitBtn.querySelector('.btn-text').innerHTML = '<i class="fas fa-check"></i> Message Sent!';

            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');

            // Reset form after 3 seconds
            setTimeout(() => {
                form.reset();
                charCount.textContent = '0 / 500';
                submitBtn.classList.remove('success');
                submitBtn.disabled = false;
                submitBtn.querySelector('.btn-text').innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                
                // Clear validation states
                document.querySelectorAll('.success-message').forEach(el => el.classList.remove('show'));
                document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
            }, 3000);
        });

        // Notification system
        function showNotification(message, type) {
            const notification = document.createElement('div');
            notification.className = `notification notification--${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                    <span>${message}</span>
                    <button class="notification-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

            document.body.appendChild(notification);

            setTimeout(() => notification.classList.add('show'), 10);

            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            });

            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 5000);
        }

    // ============================================
    // PARTICLE ANIMATION (OPTIONAL)
    // ============================================
    
    class ParticleAnimation {
        constructor() {
            this.canvas = document.getElementById('particle-canvas');
            if (!this.canvas) return;
            
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.particleCount = 50;
            this.mouse = { x: null, y: null };
            
            this.init();
        }

        init() {
            this.resize();
            this.createParticles();
            this.animate();
            this.bindEvents();
        }

        bindEvents() {
            window.addEventListener('resize', () => this.resize());
            
            this.canvas.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });
        }

        resize() {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
        }

        createParticles() {
            for (let i = 0; i < this.particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2 + 1
                });
            }
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
                
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
                this.ctx.fill();
            });
            
            requestAnimationFrame(() => this.animate());
        }
    }

    // ============================================
    // INITIALIZE ALL COMPONENTS
    // ============================================
    
    try {
        // Core Systems
        const themeManager = new ThemeManager();
        const navigation = new Navigation();
        const modalManager = new ModalManager();
        
        // Feature Managers
        const cvDownloadManager = new CVDownloadManager();
        const shareManager = new ShareManager();
        const projectManager = new ProjectManager();
        const skillsManager = new SkillsManager();
        const codeTabsManager = new CodeTabsManager();
        const contactFormManager = new ContactFormManager();
        
        // Optional: Particle Animation
        if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
            const particleAnimation = new ParticleAnimation();
        }
        
        // Typing Animation
        const typingElement = document.getElementById('typing-text');
        const typingPhrases = [
            'a Software Engineer.',
            'an architect of backend systems.',
            'building scalable applications.',
            'passionate about code quality.',
            'delivering reliable technical solutions.',
            'ready to tackle new challenges.'
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
            }
        };

        console.log('✅ Ahmed Hany Boshra Portfolio - Enhanced version loaded successfully!');
        console.log('📄 CV Download and sharing features are ready');
        console.log('🎯 Filament Forever - Building the future, one line at a time.');
        
    } catch (error) {
        console.error('Portfolio initialization error:', error);
    }
});

// ============================================
// REDUCED MOTION SUPPORT
// ============================================

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0.01ms');
    document.documentElement.style.setProperty('--transition-base', '0.01ms');
    document.documentElement.style.setProperty('--transition-slow', '0.01ms');
}

// ============================================
// END OF SCRIPT
// ============================================