// Modal Module for Image Display
class ImageModal {
    constructor() {
        this.init();
    }

    init() {
        this.elements = {
            modal: document.getElementById('imageModal'),
            image: document.getElementById('modalImage'),
            title: document.getElementById('modalTitle'),
            date: document.getElementById('modalDate'),
            organizer: document.getElementById('modalOrganizer'),
            closeBtn: document.getElementById('closeModal')
        };

        if (!this.elements.modal) return;

        this.bindEvents();
    }

    bindEvents() {
        // Listen for custom event from events module
        document.addEventListener('showEventModal', (e) => {
            this.showModal(e.detail.event, e.detail.imageElement);
        });

        // Close modal events
        if (this.elements.closeBtn) {
            this.elements.closeBtn.addEventListener('click', () => this.closeModal());
        }

        // Close modal when clicking outside the image
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) {
                this.closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isModalOpen()) {
                this.closeModal();
            }
        });

        // Prevent modal from closing when clicking on modal content
        const modalContent = this.elements.modal.querySelector('.relative');
        if (modalContent) {
            modalContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    showModal(event, imageElement) {
        if (!this.elements.modal || !event) return;

        // Set modal content
        if (this.elements.image && imageElement) {
            this.elements.image.src = imageElement.src;
            this.elements.image.alt = imageElement.alt;
        }

        if (this.elements.title) {
            this.elements.title.textContent = event.title;
        }

        if (this.elements.date) {
            this.elements.date.textContent = event.date;
        }

        if (this.elements.organizer) {
            this.elements.organizer.textContent = `Organized by: ${event.organizer}`;
        }

        // Show modal with animation
        this.elements.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Add entrance animation
        requestAnimationFrame(() => {
            this.elements.modal.style.opacity = '1';
            const modalContent = this.elements.modal.querySelector('.relative');
            if (modalContent) {
                modalContent.style.transform = 'scale(1)';
            }
        });

        // Focus management for accessibility
        this.elements.closeBtn?.focus();
    }

    closeModal() {
        if (!this.elements.modal || !this.isModalOpen()) return;

        // Add exit animation
        this.elements.modal.style.opacity = '0';
        const modalContent = this.elements.modal.querySelector('.relative');
        if (modalContent) {
            modalContent.style.transform = 'scale(0.95)';
        }

        setTimeout(() => {
            this.elements.modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            
            // Reset styles
            this.elements.modal.style.opacity = '';
            if (modalContent) {
                modalContent.style.transform = '';
            }
        }, 200);
    }

    isModalOpen() {
        return this.elements.modal && !this.elements.modal.classList.contains('hidden');
    }

    // Public method to show modal with custom content
    showCustomModal(title, imageSrc, description = '', additionalInfo = '') {
        if (!this.elements.modal) return;

        const customEvent = {
            title,
            date: description,
            organizer: additionalInfo
        };

        const customImageElement = {
            src: imageSrc,
            alt: title
        };

        this.showModal(customEvent, customImageElement);
    }
}

// Enhanced Modal with Image Zoom and Navigation
class EnhancedImageModal extends ImageModal {
    constructor() {
        super();
        this.isZoomed = false;
        this.zoomLevel = 1;
        this.maxZoom = 3;
        this.minZoom = 1;
        this.addZoomFeature();
    }

    addZoomFeature() {
        if (!this.elements.image) return;

        // Add zoom controls
        const zoomControls = document.createElement('div');
        zoomControls.className = 'absolute top-4 left-4 flex space-x-2 z-20';
        zoomControls.innerHTML = `
            <button id="zoomIn" class="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors">
                <i class="fas fa-plus"></i>
            </button>
            <button id="zoomOut" class="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors">
                <i class="fas fa-minus"></i>
            </button>
            <button id="resetZoom" class="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors">
                <i class="fas fa-expand-arrows-alt"></i>
            </button>
        `;

        const modalContent = this.elements.modal.querySelector('.relative');
        if (modalContent) {
            modalContent.appendChild(zoomControls);
        }

        // Bind zoom events
        document.getElementById('zoomIn')?.addEventListener('click', () => this.zoomIn());
        document.getElementById('zoomOut')?.addEventListener('click', () => this.zoomOut());
        document.getElementById('resetZoom')?.addEventListener('click', () => this.resetZoom());

        // Mouse wheel zoom
        this.elements.image.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                this.zoomIn();
            } else {
                this.zoomOut();
            }
        });

        // Double-click to zoom
        this.elements.image.addEventListener('dblclick', () => {
            if (this.zoomLevel === 1) {
                this.zoomIn();
            } else {
                this.resetZoom();
            }
        });
    }

    zoomIn() {
        if (this.zoomLevel < this.maxZoom) {
            this.zoomLevel += 0.25;
            this.applyZoom();
        }
    }

    zoomOut() {
        if (this.zoomLevel > this.minZoom) {
            this.zoomLevel -= 0.25;
            this.applyZoom();
        }
    }

    resetZoom() {
        this.zoomLevel = 1;
        this.applyZoom();
    }

    applyZoom() {
        if (this.elements.image) {
            this.elements.image.style.transform = `scale(${this.zoomLevel})`;
            this.elements.image.style.cursor = this.zoomLevel > 1 ? 'grab' : 'default';
        }
    }

    closeModal() {
        super.closeModal();
        this.resetZoom();
    }
}

export { ImageModal, EnhancedImageModal };
export default EnhancedImageModal;