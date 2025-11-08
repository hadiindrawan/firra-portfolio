// Image optimization and lazy loading utilities
class ImageOptimizer {
    constructor() {
        this.observedImages = new Set();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupImageErrorHandling();
        this.preloadCriticalImages();
        this.implementProgressiveLoading();
    }

    setupIntersectionObserver() {
        // Modern lazy loading with Intersection Observer
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.imageObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px', // Start loading 50px before image enters viewport
                threshold: 0.1
            });
        } else {
            // Fallback for older browsers
            this.fallbackLazyLoading();
        }
    }

    observeImage(img) {
        if (this.imageObserver && !this.observedImages.has(img)) {
            this.imageObserver.observe(img);
            this.observedImages.add(img);
        }
    }

    loadImage(img) {
        return new Promise((resolve, reject) => {
            // Show loading state
            this.showImageLoader(img);
            
            const tempImg = new Image();
            
            tempImg.onload = () => {
                // Use requestAnimationFrame for smooth transition
                requestAnimationFrame(() => {
                    img.src = tempImg.src;
                    img.classList.add('loaded');
                    this.hideImageLoader(img);
                    resolve(img);
                });
            };
            
            tempImg.onerror = () => {
                this.showImageError(img);
                reject(new Error(`Failed to load image: ${img.dataset.src}`));
            };
            
            // Start loading
            tempImg.src = img.dataset.src || img.src;
        });
    }

    showImageLoader(img) {
        const container = img.parentElement;
        if (container && !container.querySelector('.image-loader-overlay')) {
            const loader = document.createElement('div');
            loader.className = 'image-loader-overlay absolute inset-0 flex items-center justify-center bg-soft-blue-100';
            loader.innerHTML = `
                <div class="text-center text-soft-blue-600">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-soft-blue-600 mx-auto mb-2"></div>
                    <p class="text-sm font-medium">Loading...</p>
                </div>
            `;
            
            if (container.style.position !== 'relative') {
                container.style.position = 'relative';
            }
            container.appendChild(loader);
        }
    }

    hideImageLoader(img) {
        const container = img.parentElement;
        const loader = container?.querySelector('.image-loader-overlay');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 300);
        }
    }

    showImageError(img) {
        const container = img.parentElement;
        const loader = container?.querySelector('.image-loader-overlay');
        if (loader) {
            loader.innerHTML = `
                <div class="text-center text-gray-400">
                    <i class="fas fa-exclamation-triangle text-4xl mb-2"></i>
                    <p class="text-sm">Image unavailable</p>
                </div>
            `;
        }
    }

    setupImageErrorHandling() {
        // Global image error handler
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                this.handleImageError(e.target);
            }
        }, true);
    }

    handleImageError(img) {
        // Replace broken image with placeholder
        const placeholder = this.generatePlaceholder(
            img.offsetWidth || 400,
            img.offsetHeight || 300,
            img.alt || 'Image'
        );
        img.src = placeholder;
    }

    generatePlaceholder(width, height, text) {
        // Generate SVG placeholder
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f3f4f6"/>
                <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" 
                      text-anchor="middle" dy=".3em" fill="#9ca3af">${text}</text>
            </svg>
        `;
        
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }

    preloadCriticalImages() {
        // Preload critical images for faster initial rendering
        const criticalImages = [
            './assets/firra.png', // Hero image
            './assets/mentor-firra-1.jpeg' // First carousel image
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    implementProgressiveLoading() {
        // Implement progressive image loading for large images
        const largeImages = document.querySelectorAll('img[data-large-src]');
        
        largeImages.forEach(img => {
            this.loadProgressively(img);
        });
    }

    loadProgressively(img) {
        // Load low-quality placeholder first, then high-quality image
        if (img.dataset.placeholderSrc) {
            img.src = img.dataset.placeholderSrc;
            img.classList.add('blur-sm', 'scale-105');
            
            // Then load high-quality version
            const highQualityImg = new Image();
            highQualityImg.onload = () => {
                img.src = img.dataset.largeSrc;
                img.classList.remove('blur-sm', 'scale-105');
                img.classList.add('transition-all', 'duration-300');
            };
            highQualityImg.src = img.dataset.largeSrc;
        }
    }

    fallbackLazyLoading() {
        // Fallback lazy loading for older browsers
        let lazyImages = document.querySelectorAll('img[data-src]');
        
        const loadImagesOnScroll = () => {
            lazyImages.forEach(img => {
                if (this.isInViewport(img)) {
                    this.loadImage(img);
                    img.removeAttribute('data-src');
                }
            });
            
            // Remove loaded images from array
            lazyImages = Array.from(lazyImages).filter(img => img.hasAttribute('data-src'));
        };

        // Check on scroll with throttling
        window.addEventListener('scroll', this.throttle(loadImagesOnScroll, 200));
        window.addEventListener('resize', this.throttle(loadImagesOnScroll, 200));
        
        // Initial check
        loadImagesOnScroll();
    }

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Utility methods
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

    // Public API methods
    optimizeImages() {
        // Find and optimize all images on page
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.loading !== 'eager') {
                this.observeImage(img);
            }
        });
    }

    compressImage(file, quality = 0.8, maxWidth = 1200) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                // Calculate new dimensions
                const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;
                
                // Draw and compress
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    }

    generateResponsiveImages(src, sizes = [400, 800, 1200]) {
        // Generate multiple image sizes for responsive loading
        return sizes.map(size => ({
            src: src.replace(/\.([^.]+)$/, `_${size}w.$1`),
            width: size
        }));
    }
}

export default ImageOptimizer;