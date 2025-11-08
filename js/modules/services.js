// Services Module for Services Section

class ServicesManager {
    constructor() {
        // Use centralized services data from global variable
        this.servicesData = [...(window.SERVICES_DATA || [])];

        this.init();
    }

    init() {
        this.elements = {
            container: document.getElementById('servicesContainer')
        };

        if (!this.elements.container) return;

        this.render();
    }

    render() {
        this.elements.container.innerHTML = this.servicesData.map(service => this.createServiceCard(service)).join('');
    }

    createServiceCard(service) {
        const featuresHTML = service.features.map(feature => 
            `<li>• ${feature}</li>`
        ).join('');
        
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
    }

    // Public methods for managing services
    addService(serviceData) {
        this.servicesData.push({
            id: Math.max(...this.servicesData.map(s => s.id)) + 1,
            ...serviceData
        });
        this.render();
    }

    removeService(id) {
        this.servicesData = this.servicesData.filter(service => service.id !== id);
        this.render();
    }

    updateService(id, updatedData) {
        const serviceIndex = this.servicesData.findIndex(service => service.id === id);
        if (serviceIndex !== -1) {
            this.servicesData[serviceIndex] = { ...this.servicesData[serviceIndex], ...updatedData };
            this.render();
        }
    }
}

// Export for use in other modules
export default ServicesManager;