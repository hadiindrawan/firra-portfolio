// Carousel Module for Mentoring Section

class MentoringCarousel {
    constructor() {
        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.timerInterval = null;
        this.autoplayDelay = 5000; // 5 seconds
        this.isAutoplayPaused = false;
        
        // Use centralized mentoring data from global variable
        this.mentoringData = [...(window.MENTORING_DATA || [])];

        this.init();
    }

    init() {
        this.elements = {
            carousel: document.getElementById('mentoringCarousel'),
            track: document.getElementById('carouselTrack'),
            dots: document.getElementById('carouselDots'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            loader: document.getElementById('carouselLoader'),
            currentTitle: document.getElementById('currentImageTitle'),
            currentDescription: document.getElementById('currentImageDescription'),
            currentIndexSpan: document.getElementById('currentImageIndex').querySelector('.current'),
            totalSpan: document.getElementById('currentImageIndex').querySelector('.total'),
            timerSpan: document.getElementById('autoplayTimer')
        };

        if (!this.elements.carousel) return;

        this.render();
        this.bindEvents();
        this.startAutoplay();
        this.addTouchSupport();
    }

    render() {
        this.renderSlides();
        this.renderDots();
        this.updateInfo();
        
        // Hide loader after rendering
        setTimeout(() => {
            if (this.elements.loader) {
                this.elements.loader.style.opacity = '0';
                setTimeout(() => {
                    this.elements.loader.style.display = 'none';
                }, 300);
            }
        }, 500);
    }

    renderSlides() {
        if (!this.elements.track) return;

        const slidesHTML = this.mentoringData.map((item, index) => `
            <div class="carousel-slide min-w-full relative">
                <div class="h-48 sm:h-56 md:h-64 lg:h-72 bg-gradient-to-br from-soft-blue-100 to-soft-blue-200 relative overflow-hidden">
                    <img 
                        src="${item.image}" 
                        alt="${item.alt}"
                        class="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                        loading="${index === 0 ? 'eager' : 'lazy'}"
                        data-index="${index}"
                    >
                    <!-- Gradient Overlay -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
            </div>
        `).join('');

        this.elements.track.innerHTML = slidesHTML;
    }

    renderDots() {
        if (!this.elements.dots) return;

        const dotsHTML = this.mentoringData.map((_, index) => `
            <button 
                class="carousel-dot w-3 h-3 rounded-full transition-all duration-300 ${
                    index === this.currentIndex 
                        ? 'bg-soft-blue-600 scale-125' 
                        : 'bg-soft-blue-300 hover:bg-soft-blue-400'
                }"
                data-index="${index}"
                aria-label="Go to slide ${index + 1}"
            ></button>
        `).join('');

        this.elements.dots.innerHTML = dotsHTML;

        // Add click events to dots
        this.elements.dots.querySelectorAll('.carousel-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.goToSlide(index);
            });
        });
    }

    updateInfo() {
        const currentItem = this.mentoringData[this.currentIndex];
        
        if (this.elements.currentTitle) {
            this.elements.currentTitle.textContent = currentItem.title;
        }
        
        if (this.elements.currentDescription) {
            this.elements.currentDescription.textContent = currentItem.description;
        }
        
        if (this.elements.currentIndexSpan) {
            this.elements.currentIndexSpan.textContent = this.currentIndex + 1;
        }
        
        if (this.elements.totalSpan) {
            this.elements.totalSpan.textContent = this.mentoringData.length;
        }

        // Update dots
        const dots = this.elements.dots?.querySelectorAll('.carousel-dot');
        if (dots) {
            dots.forEach((dot, index) => {
                if (index === this.currentIndex) {
                    dot.className = 'carousel-dot w-3 h-3 rounded-full transition-all duration-300 bg-soft-blue-600 scale-125';
                } else {
                    dot.className = 'carousel-dot w-3 h-3 rounded-full transition-all duration-300 bg-soft-blue-300 hover:bg-soft-blue-400';
                }
            });
        }
    }

    bindEvents() {
        // Navigation buttons
        if (this.elements.prevBtn) {
            this.elements.prevBtn.addEventListener('click', () => this.previousSlide());
        }
        
        if (this.elements.nextBtn) {
            this.elements.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isCarouselInView()) {
                if (e.key === 'ArrowLeft') this.previousSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
            }
        });

        // Pause autoplay on hover
        if (this.elements.carousel) {
            this.elements.carousel.addEventListener('mouseenter', () => this.pauseAutoplay());
            this.elements.carousel.addEventListener('mouseleave', () => this.resumeAutoplay());
        }
    }



    goToSlide(index) {
        if (index < 0 || index >= this.mentoringData.length) return;
        
        this.currentIndex = index;
        
        if (this.elements.track) {
            this.elements.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        }
        
        this.updateInfo();
        this.resetAutoplay();
    }

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.mentoringData.length;
        this.goToSlide(nextIndex);
    }

    previousSlide() {
        const prevIndex = this.currentIndex === 0 ? this.mentoringData.length - 1 : this.currentIndex - 1;
        this.goToSlide(prevIndex);
    }





    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            if (!this.isAutoplayPaused && this.isCarouselInView()) {
                this.nextSlide();
            }
        }, this.autoplayDelay);
        
        this.startTimer();
    }

    pauseAutoplay() {
        this.isAutoplayPaused = true;
    }

    resumeAutoplay() {
        this.isAutoplayPaused = false;
    }

    resetAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.startAutoplay();
    }

    startTimer() {
        // Clear existing timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        let timeLeft = this.autoplayDelay / 1000;
        
        // Update timer display immediately
        if (this.elements.timerSpan) {
            this.elements.timerSpan.textContent = timeLeft;
        }
        
        this.timerInterval = setInterval(() => {
            if (!this.isAutoplayPaused && this.elements.timerSpan) {
                timeLeft--;
                this.elements.timerSpan.textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    timeLeft = this.autoplayDelay / 1000;
                }
            }
        }, 1000);
    }

    isCarouselInView() {
        if (!this.elements.carousel) return false;
        
        const rect = this.elements.carousel.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    addTouchSupport() {
        if (!this.elements.carousel) return;
        
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        this.elements.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.pauseAutoplay();
        });
        
        this.elements.carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });
        
        this.elements.carousel.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const deltaX = startX - currentX;
            const minSwipeDistance = 50;
            
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
            
            isDragging = false;
            this.resumeAutoplay();
        });
    }

    // Public method to add new mentoring images
    addMentoringImage(imageData) {
        this.mentoringData.push({
            id: this.mentoringData.length + 1,
            ...imageData
        });
        this.render();
    }

    // Public method to remove mentoring image
    removeMentoringImage(id) {
        this.mentoringData = this.mentoringData.filter(item => item.id !== id);
        if (this.currentIndex >= this.mentoringData.length) {
            this.currentIndex = Math.max(0, this.mentoringData.length - 1);
        }
        this.render();
    }



    destroy() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }
}

// Export for use in other modules
export default MentoringCarousel;