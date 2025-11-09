// Events Module for Speaking Events Section

class SpeakingEvents {
    constructor() {
        this.showAllEvents = false;
        this.eventsToShow = 3; // Initial number of events to show
        
        // Use centralized events data from global variable and sort by year (newest first)
        this.eventsData = [...(window.SPEAKING_EVENTS_DATA || [])].sort((a, b) => {
            return parseInt(b.year) - parseInt(a.year);
        });

        this.init();
    }

    init() {
        this.elements = {
            container: document.getElementById('eventsContainer'),
            showMoreBtn: document.getElementById('showMoreEventsBtn')
        };

        if (!this.elements.container) return;

        this.render();
        this.bindEvents();
    }

    render() {
        const eventsToRender = this.showAllEvents ? this.eventsData : this.eventsData.slice(0, this.eventsToShow);
        
        this.elements.container.innerHTML = eventsToRender.map(event => this.createEventCard(event)).join('');
        
        this.updateShowMoreButton();
        this.attachEventListeners();
    }

    createEventCard(event) {
        const tagsHTML = event.tags.map(tag => 
            `<span class="px-2 py-1 ${event.themeColors.tags} text-xs rounded-full">${tag}</span>`
        ).join('');
        
        return `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-2 group" data-event-id="${event.id}">
                <!-- Event Image -->
                <div class="h-48 bg-gradient-to-br ${event.themeColors.gradient} relative overflow-hidden cursor-pointer speaking-event-image" data-event-id="${event.id}">
                    <img src="${event.image}" alt="${event.title}" class="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110" loading="eager">
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

    updateShowMoreButton() {
        if (!this.elements.showMoreBtn) return;

        if (this.eventsData.length > this.eventsToShow) {
            this.elements.showMoreBtn.classList.remove('hidden');
            
            const btnText = this.elements.showMoreBtn.querySelector('.btn-text');
            const btnIcon = this.elements.showMoreBtn.querySelector('i');
            
            if (this.showAllEvents) {
                btnText.textContent = 'Show Less Events';
                btnIcon.className = 'fas fa-chevron-up mr-2';
            } else {
                btnText.textContent = `Show More Events (${this.eventsData.length - this.eventsToShow} more)`;
                btnIcon.className = 'fas fa-chevron-down mr-2';
            }
        } else {
            this.elements.showMoreBtn.classList.add('hidden');
        }
    }

    bindEvents() {
        if (this.elements.showMoreBtn) {
            this.elements.showMoreBtn.addEventListener('click', () => {
                this.showAllEvents = !this.showAllEvents;
                this.render();
                
                // Smooth scroll to events section when showing more
                if (this.showAllEvents) {
                    const eventsSection = document.getElementById('speaking');
                    if (eventsSection) {
                        eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        }
    }

    attachEventListeners() {
        // Add click event to all event images for modal
        const eventImages = this.elements.container.querySelectorAll('.speaking-event-image');
        eventImages.forEach(imageContainer => {
            imageContainer.addEventListener('click', (e) => {
                const eventId = parseInt(imageContainer.dataset.eventId);
                const event = this.eventsData.find(e => e.id === eventId);
                
                if (event) {
                    // Dispatch custom event for modal handling
                    document.dispatchEvent(new CustomEvent('showEventModal', {
                        detail: { event, imageElement: imageContainer.querySelector('img') }
                    }));
                }
            });
        });
    }



    // Public methods for managing events
    addEvent(eventData) {
        this.eventsData.push({
            id: Math.max(...this.eventsData.map(e => e.id)) + 1,
            ...eventData
        });
        this.render();
    }

    removeEvent(eventId) {
        this.eventsData = this.eventsData.filter(event => event.id !== eventId);
        this.render();
    }

    getEvents() {
        return [...this.eventsData];
    }

    updateEvent(eventId, updatedData) {
        const index = this.eventsData.findIndex(event => event.id === eventId);
        if (index !== -1) {
            this.eventsData[index] = { ...this.eventsData[index], ...updatedData };
            this.render();
        }
    }
}

export default SpeakingEvents;