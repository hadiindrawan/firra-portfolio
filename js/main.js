// Main Portfolio Script - Modular Architecture
// Import all modules
import PortfolioCore from './modules/core.js';
import SpeakingEvents from './modules/events.js';
import MentoringCarousel from './modules/carousel.js';
import EnhancedImageModal from './modules/modal.js';
import ImageOptimizer from './modules/imageOptimizer.js';
import ServicesManager from './modules/services.js';

// Portfolio Application Class
class PortfolioApp {
    constructor() {
        this.modules = {};
        this.init();
    }

    async init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeModules());
        } else {
            this.initializeModules();
        }
    }

    initializeModules() {
        try {
            // Initialize core functionality first
            this.modules.core = new PortfolioCore();
            
            // Initialize other modules
            this.modules.services = new ServicesManager();
            this.modules.events = new SpeakingEvents();
            this.modules.carousel = new MentoringCarousel();
            this.modules.modal = new EnhancedImageModal();
            this.modules.imageOptimizer = new ImageOptimizer();
            
            // Initialize additional features
            this.initContactForm();
            this.initTypingAnimation();
            this.initServiceWorker();
            this.optimizeImages();
            
        } catch (error) {
            console.error('❌ Error initializing portfolio modules:', error);
            this.fallbackInitialization();
        }
    }

    initContactForm() {
        const contactForm = document.querySelector('#contact form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual form handling)
                setTimeout(() => {
                    if (window.showNotification) {
                        window.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    }
                    contactForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }

    initTypingAnimation() {
        const typeWriter = (element, text, speed = 50) => {
            let i = 0;
            element.innerHTML = '';
            
            function type() {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }
            
            type();
        };

        // Initialize typing animation for hero subtitle
        const heroSubtitle = document.querySelector('#home p');
        if (heroSubtitle) {
            const originalText = heroSubtitle.textContent;
            // Start typing animation after a delay
            setTimeout(() => {
                typeWriter(heroSubtitle, originalText, 30);
            }, 1000);
        }
    }

    initServiceWorker() {
        // Service Worker registration (for PWA features)
        if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
            window.addEventListener('load', () => {
                const swPath = './sw.js'; // Use relative path
                
                navigator.serviceWorker.register(swPath)
                    .then(registration => {
                        // Check for updates
                        registration.addEventListener('updatefound', () => {
                            console.log('🔄 Service Worker update found');
                        });
                    })
                    .catch(error => {
                        console.warn('⚠️ Service Worker registration failed:', error);
                        // Continue without service worker - not critical for basic functionality
                    });
                
                // Handle service worker updates
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    console.log('🔄 Service Worker controller changed - reloading page');
                    window.location.reload();
                });
            });
        } else {
            console.log('📱 Service Worker not available (file:// protocol or not supported)');
        }
    }

    optimizeImages() {
        // Initialize image optimization
        if (this.modules.imageOptimizer) {
            setTimeout(() => {
                this.modules.imageOptimizer.optimizeImages();
            }, 100);
        }
    }

    logPerformance() {
        // Performance monitoring
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        console.log(`📊 Page load time: ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
                        console.log(`📊 DOM ready: ${Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart)}ms`);
                    }

                    // Log image optimization stats
                    const images = document.querySelectorAll('img');
                    console.log(`🖼️  Total images: ${images.length}`);
                    console.log(`🚀 Image optimization: Active`);
                }, 0);
            });
        }
    }

    fallbackInitialization() {
        // Fallback initialization if modules fail
        console.warn('⚠️  Falling back to basic functionality');
        
        // Basic mobile menu
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // Basic smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // Public API methods
    getModule(name) {
        return this.modules[name];
    }

    // Method to add new mentoring images
    addMentoringImage(imageData) {
        if (this.modules.carousel) {
            this.modules.carousel.addMentoringImage(imageData);
        }
    }

    // Method to add new speaking events
    addSpeakingEvent(eventData) {
        if (this.modules.events) {
            this.modules.events.addEvent(eventData);
        }
    }

    // Method to show custom modal
    showModal(title, imageSrc, description = '') {
        if (this.modules.modal) {
            this.modules.modal.showCustomModal(title, imageSrc, description);
        }
    }

    // Method to show notification
    showNotification(message, type = 'info') {
        if (this.modules.core && window.showNotification) {
            window.showNotification(message, type);
        }
    }
}

// CSS for enhanced animations and transitions
const portfolioStyles = `
    /* Enhanced animations and transitions */
    .animate-fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Carousel specific styles */
    .carousel-slide {
        transition: transform 0.5s ease-in-out;
    }

    /* Image loading states */
    .image-loader {
        transition: opacity 0.3s ease;
    }

    /* Enhanced modal styles */
    #imageModal {
        transition: opacity 0.2s ease;
        backdrop-filter: blur(8px);
    }

    #imageModal .relative {
        transition: transform 0.2s ease;
    }

    /* Notification styles */
    #notification-container {
        pointer-events: none;
    }

    #notification-container > div {
        pointer-events: auto;
    }

    /* Accessibility improvements */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    .focus\\:not-sr-only:focus {
        position: static;
        width: auto;
        height: auto;
        padding: inherit;
        margin: inherit;
        overflow: visible;
        clip: auto;
        white-space: normal;
    }

    /* Smooth performance improvements */
    * {
        box-sizing: border-box;
    }

    img {
        max-width: 100%;
        height: auto;
    }

    /* Loading states */
    .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: .5;
        }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = portfolioStyles;
document.head.appendChild(styleSheet);

// Initialize the application
const app = new PortfolioApp();

// Make app globally available for debugging
window.portfolioApp = app;

// Export for potential external use
export default PortfolioApp;