// Portfolio JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuIcon = mobileMenuBtn.querySelector('i');
    
    mobileMenuBtn.addEventListener('click', function() {
        const isOpen = mobileMenu.classList.contains('active');
        
        if (isOpen) {
            mobileMenu.classList.remove('active');
            mobileMenu.classList.add('hidden');
            mobileMenuIcon.className = 'fas fa-bars text-xl';
        } else {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('active');
            mobileMenuIcon.className = 'fas fa-times text-xl';
        }
    });
    
    // Close mobile menu when clicking on links
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenu.classList.add('hidden');
            mobileMenuIcon.className = 'fas fa-bars text-xl';
        });
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
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
    
    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('nav a[href^="#"]');
    
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinksAll.forEach(link => {
                    link.classList.remove('text-soft-blue-600', 'font-semibold');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('text-soft-blue-600', 'font-semibold');
                    }
                });
            }
        });
    }
    
    // Navbar background change on scroll
    const navbar = document.querySelector('nav');
    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-lg', 'bg-white/95', 'backdrop-blur-sm');
        } else {
            navbar.classList.remove('shadow-lg', 'bg-white/95', 'backdrop-blur-sm');
        }
        updateActiveNav();
    }
    
    window.addEventListener('scroll', updateNavbar);
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card-hover, .timeline-item, .skill-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
    
    // Form submission handling
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-2"></i>
                <span>${message}</span>
                <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(full)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    // Typing animation for hero text
    function typeWriter(element, text, speed = 50) {
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
    }
    
    // Initialize typing animation for hero subtitle
    const heroSubtitle = document.querySelector('#home p');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        // Start typing animation after a delay
        setTimeout(() => {
            typeWriter(heroSubtitle, originalText, 30);
        }, 1000);
    }
    
    // Parallax effect for hero section
    function parallaxEffect() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('#home');
        const parallaxElements = heroSection.querySelectorAll('.relative:not(.profile-photo-container)');
        
        parallaxElements.forEach(el => {
            const speed = 0.1;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
    
    // Add parallax effect on scroll (throttled)
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(() => {
                parallaxEffect();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Skills animation on hover
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotateY(10deg)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotateY(0deg)';
        });
    });
    
    // Service cards interactive effects
    const serviceCards = document.querySelectorAll('.card-hover');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
    
    // Profile photo background image loading
    const profilePhotoContainer = document.querySelector('.profile-photo-container [style*="background-image"]');
    if (profilePhotoContainer) {
        const imageUrl = profilePhotoContainer.style.backgroundImage.slice(4, -1).replace(/"/g, "");
        
        // Create a new image to test loading
        const testImg = new Image();
        testImg.onload = function() {
            // Image loaded successfully
            profilePhotoContainer.style.opacity = '1';
        };
        testImg.onerror = function() {
            // Image failed to load, show fallback
            profilePhotoContainer.style.backgroundImage = 'none';
            profilePhotoContainer.style.backgroundColor = '#e0f2fe';
            const fallback = profilePhotoContainer.nextElementSibling;
            if (fallback) {
                fallback.style.opacity = '1';
            }
        };
        testImg.src = imageUrl;
        
        // Initially hide until loaded
        profilePhotoContainer.style.opacity = '0';
        profilePhotoContainer.style.transition = 'opacity 0.5s ease';
    }
    
    // Image lazy loading with placeholder for other images
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('img-loading');
                
                const tempImg = new Image();
                tempImg.onload = function() {
                    img.src = this.src;
                    img.classList.remove('img-loading');
                };
                tempImg.src = img.src;
                
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
    
    // Back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'fixed bottom-6 right-6 bg-soft-blue-600 text-white p-3 rounded-full shadow-lg opacity-0 transition-opacity duration-300 z-50 hover:bg-soft-blue-700';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopBtn);
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Show/hide back to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.opacity = '1';
        } else {
            backToTopBtn.style.opacity = '0';
        }
    });
    
    // Preloader (optional)
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }
        
        // Initialize animations after page load
        document.querySelectorAll('.animate-on-load').forEach(el => {
            el.classList.add('animate-fade-in-up');
        });
    });
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            mobileMenu.classList.add('hidden');
            mobileMenuIcon.className = 'fas fa-bars text-xl';
        }
    });
    
    // Focus management for accessibility
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const modal = document.querySelector('.modal');
    
    if (modal) {
        const firstFocusableElement = modal.querySelectorAll(focusableElements)[0];
        const focusableContent = modal.querySelectorAll(focusableElements);
        const lastFocusableElement = focusableContent[focusableContent.length - 1];
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
            }, 0);
        });
    }
    
    // Service Worker registration (for future PWA features)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
    
    // Services Data & Functionality
    // Use centralized services data from global variable
    const servicesData = window.SERVICES_DATA || [
        // Fallback data if services.js fails to load
        {
            id: 1,
            icon: 'fas fa-chalkboard-teacher',
            title: 'Professional Training',
            description: 'Comprehensive training programs designed to enhance professional skills.',
            features: ['Leadership Development', 'Communication Skills', 'Team Building']
        }
    ];

    // Services Rendering
    function renderServices() {
        const servicesContainer = document.getElementById('servicesContainer');
        if (!servicesContainer || !servicesData.length) return;

        const servicesHTML = servicesData.map(service => {
            const featuresHTML = service.features.map(feature => `<li>• ${feature}</li>`).join('');
            
            return `
                <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:-translate-y-1" data-service-id="${service.id}">
                    <div class="w-12 h-12 bg-soft-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <i class="${service.icon} text-soft-blue-600 text-xl"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-3">${service.title}</h3>
                    <p class="text-gray-600 mb-4">${service.description}</p>
                    <ul class="text-sm text-gray-500 space-y-1">
                        ${featuresHTML}
                    </ul>
                </div>
            `;
        }).join('');

        servicesContainer.innerHTML = servicesHTML;
    }

    // Initialize services
    renderServices();
    
    // Speaking Events Data & Functionality
    // Use centralized events data from global variable
    const eventsData = window.SPEAKING_EVENTS_DATA || [
        // Fallback data if events.js fails to load
        {
            id: 1,
            image: './assets/web-firra-1.jpeg',
            title: 'Create Your Interview Moment and Impress the Recruiter',
            description: 'Delivered an engaging session on interview preparation strategies and techniques.',
            date: 'Saturday, September 1, 2022',
            organizer: 'careernetwork.id',
            role: 'Speaker',
            roleIcon: 'fas fa-microphone',
            year: '2022',
            themeColors: {
                gradient: 'from-soft-blue-100 to-soft-blue-200',
                badge: 'bg-soft-blue-600',
                role: 'text-soft-blue-600',
                tags: 'bg-soft-blue-100 text-soft-blue-700'
            },
            tags: ['Interview Skills', 'Career Development', 'Job Search']
        }
    ];

    // Image Modal Elements
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const modalOrganizer = document.getElementById('modalOrganizer');
    const closeModal = document.getElementById('closeModal');

    // Events Rendering and Management
    let showAllEvents = false;
    const eventsToShow = 3; // Initial number of events to show
    
    // Function to create event card HTML
    function createEventCard(event) {
        const tagsHTML = event.tags.map(tag => 
            `<span class="px-2 py-1 ${event.themeColors.tags} text-xs rounded-full">${tag}</span>`
        ).join('');
        
        return `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-2 group" data-event-id="${event.id}">
                <!-- Event Image -->
                <div class="h-48 bg-gradient-to-br ${event.themeColors.gradient} relative overflow-hidden cursor-pointer speaking-event-image" data-event-id="${event.id}">
                    <img src="${event.image}" alt="${event.title}" class="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110">
                    <!-- Hover Overlay -->
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                        <div class="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                            <i class="fas fa-search-plus text-2xl mb-2"></i>
                            <p class="text-sm font-medium">View Full Image</p>
                        </div>
                    </div>
                    <div class="absolute top-4 left-4 ${event.themeColors.badge} text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                        ${event.year}
                    </div>
                </div>
                
                <!-- Event Content -->
                <div class="p-6">
                    <div class="flex items-center mb-3">
                        <i class="${event.roleIcon} ${event.themeColors.role} mr-2"></i>
                        <span class="${event.themeColors.role} font-semibold text-sm uppercase tracking-wide">${event.role}</span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">${event.title}</h3>
                    <p class="text-gray-600 mb-4 text-sm leading-relaxed">
                        ${event.description}
                    </p>
                    
                    <!-- Event Details -->
                    <div class="space-y-2 text-sm text-gray-500">
                        <div class="flex items-center">
                            <i class="fas fa-calendar-alt w-4 mr-2"></i>
                            <span>${event.date}</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-building w-4 mr-2"></i>
                            <span>${event.organizer}</span>
                        </div>
                    </div>
                    
                    <!-- Topic Tags -->
                    <div class="mt-4 flex flex-wrap gap-2">
                        ${tagsHTML}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Function to render events
    function renderEvents() {
        const container = document.getElementById('eventsContainer');
        const showMoreBtn = document.getElementById('showMoreEventsBtn');
        
        if (!container) return;
        
        const eventsToRender = showAllEvents ? eventsData : eventsData.slice(0, eventsToShow);
        
        container.innerHTML = eventsToRender.map(event => createEventCard(event)).join('');
        
        // Show/hide the "Show More" button
        if (eventsData.length > eventsToShow) {
            showMoreBtn.classList.remove('hidden');
            
            const btnText = showMoreBtn.querySelector('.btn-text');
            const btnIcon = showMoreBtn.querySelector('i');
            
            if (showAllEvents) {
                btnText.textContent = 'Show Less Events';
                btnIcon.className = 'fas fa-chevron-up mr-2';
            } else {
                btnText.textContent = `Show More Events (${eventsData.length - eventsToShow} more)`;
                btnIcon.className = 'fas fa-chevron-down mr-2';
            }
        } else {
            showMoreBtn.classList.add('hidden');
        }
        
        // Re-attach event listeners after rendering
        attachEventListeners();
    }
    
    // Function to attach event listeners
    function attachEventListeners() {
        // Add click event to all event images for modal
        const eventImages = document.querySelectorAll('.speaking-event-image');
        eventImages.forEach(imageContainer => {
            imageContainer.addEventListener('click', function() {
                const eventId = parseInt(this.dataset.eventId);
                const event = eventsData.find(e => e.id === eventId);
                
                if (event && imageModal) {
                    const img = this.querySelector('img');
                    modalImage.src = img.src;
                    modalImage.alt = img.alt;
                    modalTitle.textContent = event.title;
                    modalDate.textContent = event.date;
                    modalOrganizer.textContent = `Organized by: ${event.organizer}`;
                    
                    imageModal.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
    }
    
    // Show More/Less button functionality
    const showMoreBtn = document.getElementById('showMoreEventsBtn');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function() {
            showAllEvents = !showAllEvents;
            renderEvents();
            
            // Smooth scroll to events section when showing more
            if (showAllEvents) {
                const eventsSection = document.getElementById('speaking');
                if (eventsSection) {
                    eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    }
    
    // Initial render of events
    renderEvents();
    
    // Image Modal functionality
    if (imageModal && closeModal) {
        // Close modal functionality
        function closeImageModalFunction() {
            imageModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }

        closeModal.addEventListener('click', closeImageModalFunction);
        
        // Close modal when clicking outside the image
        imageModal.addEventListener('click', function(e) {
            if (e.target === imageModal) {
                closeImageModalFunction();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !imageModal.classList.contains('hidden')) {
                closeImageModalFunction();
            }
        });
    }
});