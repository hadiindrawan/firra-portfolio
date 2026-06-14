// Main Navigation and Utilities Module
class PortfolioCore {
    constructor() {
        this.init();
    }

    init() {
        this.initMobileMenu();
        this.initSmoothScrolling();
        this.initNavigationHighlighting();
        this.initScrollEffects();
        this.initAnimations();
        this.initAccessibility();
        this.initPerformanceOptimizations();
        this.addBackToTopButton();
        this.initNotificationSystem();
    }

    initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuIcon = mobileMenuBtn?.querySelector('i');

        if (!mobileMenuBtn || !mobileMenu || !mobileMenuIcon) return;

        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('active');
            
            if (isOpen) {
                this.closeMobileMenu(mobileMenu, mobileMenuIcon);
            } else {
                this.openMobileMenu(mobileMenu, mobileMenuIcon);
            }
        });

        // Close mobile menu when clicking on links
        const mobileLinks = document.querySelectorAll('.mobile-menu a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu(mobileMenu, mobileMenuIcon);
            });
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                this.closeMobileMenu(mobileMenu, mobileMenuIcon);
            }
        });
    }

    openMobileMenu(menu, icon) {
        menu.classList.remove('hidden');
        menu.classList.add('active');
        icon.className = 'fas fa-times text-xl';
    }

    closeMobileMenu(menu, icon) {
        menu.classList.remove('active');
        menu.classList.add('hidden');
        icon.className = 'fas fa-bars text-xl';
    }

    initSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    initNavigationHighlighting() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        const updateActiveNav = () => {
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('text-soft-blue-600', 'font-semibold');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('text-soft-blue-600', 'font-semibold');
                        }
                    });
                }
            });
        };

        window.addEventListener('scroll', this.throttle(updateActiveNav, 100));
    }

    initScrollEffects() {
        const navbar = document.querySelector('nav');
        
        const updateNavbar = () => {
            if (window.scrollY > 50) {
                navbar?.classList.add('shadow-lg', 'bg-white/95', 'backdrop-blur-sm');
            } else {
                navbar?.classList.remove('shadow-lg', 'bg-white/95', 'backdrop-blur-sm');
            }
        };

        window.addEventListener('scroll', this.throttle(updateNavbar, 50));
        
        // Enhanced parallax effect for hero section
        const heroSection = document.querySelector('#home');
        let heroParallaxElements = [];
        if (heroSection) {
            // Get decorative background circles
            heroParallaxElements = heroSection.querySelectorAll('.absolute.w-32, .absolute.w-24');
        }
        
        const parallaxEffect = () => {
            const scrolled = window.pageYOffset;
            
            // Parallax decorative elements
            heroParallaxElements.forEach((el, index) => {
                const speed = index === 0 ? 0.15 : 0.08;
                el.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
            });
            
            // Subtle parallax on hero content
            const heroContent = heroSection?.querySelector('.lg\\:col-span-7');
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translate3d(0, ${scrolled * 0.04}px, 0)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.3;
            }
        };

        window.addEventListener('scroll', this.throttle(parallaxEffect, 16)); // ~60fps
    }

    initAnimations() {
        // Section scroll reveal
        this.initScrollReveal();
        
        // Animated counters for "By the Numbers"
        this.initAnimatedCounters();

        // Card hover effects
        this.initCardHoverEffects();
        
        // Mouse-tracking tilt on cards
        this.initTiltEffect();
        
        // Mouse parallax in hero
        this.initHeroMouseParallax();
    }

    initScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add visible class with a small stagger if the element has a stagger class
                    const delay = entry.target.dataset.staggerDelay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('section-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe section wrappers for scroll reveal
        const revealElements = document.querySelectorAll('.reveal, .section-hidden');
        revealElements.forEach(el => {
            observer.observe(el);
        });
        
        // Also observe section tags themselves
        document.querySelectorAll('section').forEach(section => {
            // Mark first section as already visible
            if (section.id === 'home') return;
            
            const wrapper = section.querySelector('.max-w-7xl > .text-center, .max-w-7xl > div:not(.text-center)');
            if (wrapper && !wrapper.classList.contains('section-hidden')) {
                wrapper.classList.add('section-hidden');
                observer.observe(wrapper);
            }
        });
    }

    initAnimatedCounters() {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target, 10);
                    const suffix = counter.dataset.suffix || '';
                    const prefix = counter.dataset.prefix || '';
                    const duration = parseInt(counter.dataset.duration, 10) || 2000;
                    
                    if (isNaN(target)) {
                        counterObserver.unobserve(counter);
                        return;
                    }
                    
                    this.animateCounter(counter, target, prefix, suffix, duration);
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.stat-counter').forEach(el => {
            counterObserver.observe(el);
        });
    }

    animateCounter(element, target, prefix, suffix, duration) {
        const startTime = performance.now();
        const isFloat = target % 1 !== 0;
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;
            
            if (isFloat) {
                element.textContent = prefix + current.toFixed(1) + suffix;
            } else {
                element.textContent = prefix + Math.floor(current) + suffix;
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = prefix + target + suffix;
                // Add glow pulse after counting finishes
                element.classList.add('animate-glow-pulse');
            }
        };
        
        requestAnimationFrame(update);
    }

    initTiltEffect() {
        const tiltCards = document.querySelectorAll('.tilt-card');
        
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * -8;
                const rotateY = (x - centerX) / centerX * 8;
                
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    initHeroMouseParallax() {
        const heroSection = document.querySelector('#home');
        if (!heroSection) return;
        
        const decorativeCircles = heroSection.querySelectorAll('.absolute.w-32, .absolute.w-24');
        if (decorativeCircles.length === 0) return;
        
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            decorativeCircles.forEach((circle, index) => {
                const speed = index === 0 ? 20 : 12;
                const moveX = x * speed;
                const moveY = y * speed;
                circle.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
        
        heroSection.addEventListener('mouseleave', () => {
            decorativeCircles.forEach(circle => {
                circle.style.transform = 'translate(0, 0)';
            });
        });
    }

    initCardHoverEffects() {
        // Service cards interactive effects
        const serviceCards = document.querySelectorAll('.card-hover');
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
            });
        });

        // Skills animation on hover
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'scale(1.05) rotateY(10deg)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'scale(1) rotateY(0deg)';
            });
        });
    }

    addBackToTopButton() {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'fixed bottom-6 right-6 bg-soft-blue-600 text-white p-3 rounded-full shadow-lg opacity-0 transition-all duration-300 z-50 hover:bg-soft-blue-700 hover:scale-110';
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTopBtn);

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Show/hide back to top button
        window.addEventListener('scroll', this.throttle(() => {
            if (window.scrollY > 300) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.pointerEvents = 'auto';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.pointerEvents = 'none';
            }
        }, 100));
    }

    initNotificationSystem() {
        // Create notification container
        const notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.className = 'fixed top-20 right-4 z-50 space-y-2';
        document.body.appendChild(notificationContainer);

        // Make showNotification globally available
        window.showNotification = (message, type = 'info') => {
            this.showNotification(message, type);
        };
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            type === 'warning' ? 'bg-yellow-500 text-black' :
            'bg-blue-500 text-white'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${
                    type === 'success' ? 'fa-check-circle' : 
                    type === 'error' ? 'fa-exclamation-circle' : 
                    type === 'warning' ? 'fa-exclamation-triangle' :
                    'fa-info-circle'
                } mr-2"></i>
                <span class="flex-1">${message}</span>
                <button class="ml-4 hover:opacity-70 notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    initAccessibility() {
        // Focus management
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        // Skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-soft-blue-600 text-white px-4 py-2 rounded z-50';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content id to main element
        const mainContent = document.querySelector('main') || document.querySelector('#home');
        if (mainContent) {
            mainContent.id = 'main-content';
        }

        // Keyboard navigation improvements
        document.addEventListener('keydown', (e) => {
            // Tab navigation improvements could be added here
        });
    }

    initPerformanceOptimizations() {
        // Profile photo lazy loading
        const profilePhotoContainer = document.querySelector('.profile-photo-container [style*="background-image"]');
        if (profilePhotoContainer) {
            this.optimizeProfilePhoto(profilePhotoContainer);
        }

        // General image lazy loading
        this.initImageLazyLoading();

        // Preload critical resources
        this.preloadCriticalResources();
    }

    optimizeProfilePhoto(container) {
        const imageUrl = container.style.backgroundImage.slice(4, -1).replace(/"/g, "");
        
        const testImg = new Image();
        testImg.onload = () => {
            container.style.opacity = '1';
        };
        testImg.onerror = () => {
            container.style.backgroundImage = 'none';
            container.style.backgroundColor = '#e0f2fe';
        };
        testImg.src = imageUrl;
        
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.5s ease';
    }

    initImageLazyLoading() {
        const images = document.querySelectorAll('img:not(.lazy-image)');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            if (img.loading !== 'eager') {
                imageObserver.observe(img);
            }
        });
    }

    preloadCriticalResources() {
        // Preload critical images
        const criticalImages = [
            './assets/firra.png', // Profile photo
            // Add other critical images
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // Utility functions
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
}

export default PortfolioCore;