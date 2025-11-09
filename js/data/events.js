// Central Event Data Management
// Single source of truth for all speaking events

const SPEAKING_EVENTS_DATA = [
    {
        id: 1,
        image: './assets/web-firra-1.jpeg',
        title: 'Create Your Interview Moment and Impress the Recruiter',
        description: 'Delivered an engaging session on interview preparation strategies and techniques to help participants create lasting impressions on recruiters and land their dream jobs.',
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
    },
    {
        id: 2,
        image: './assets/web-firra-2.jpeg',
        title: 'IGNITE: Inspiring Growth in Teams and Execution',
        description: 'Presented an inspiring keynote on fostering team growth and enhancing execution capabilities, providing practical strategies for team leaders and managers.',
        date: 'Friday, June 27, 2025',
        organizer: 'HIMABIS UNPAD 2025',
        role: 'Speaker',
        roleIcon: 'fas fa-microphone',
        year: '2025',
        themeColors: {
            gradient: 'from-emerald-100 to-emerald-200',
            badge: 'bg-emerald-600',
            role: 'text-emerald-600',
            tags: 'bg-emerald-100 text-emerald-700'
        },
        tags: ['Team Growth', 'Leadership', 'Execution Strategy']
    },
    {
        id: 3,
        image: './assets/web-firra-3.jpeg',
        title: 'Team Synergy Training: Boosting Engagement, Communication and Collaboration',
        description: 'Facilitated comprehensive team synergy training focused on enhancing team engagement, improving communication channels, and strengthening collaborative efforts.',
        date: 'Saturday, October 25, 2025',
        organizer: '@impruv.official',
        role: 'Speaker',
        roleIcon: 'fas fa-microphone',
        year: '2025',
        themeColors: {
            gradient: 'from-purple-100 to-purple-200',
            badge: 'bg-purple-600',
            role: 'text-purple-600',
            tags: 'bg-purple-100 text-purple-700'
        },
        tags: ['Team Synergy', 'Communication', 'Collaboration', 'Team Engagement']
    },
    {
        id: 4,
        image: './assets/web-firra-4.jpeg',
        title: 'CV and Interview Preparation Workshop',
        description: 'Conducted a hands-on workshop focused on crafting effective CVs and mastering interview techniques to enhance job seekers\' chances of success.',
        date: 'Saturday, March 15, 2024',
        organizer: 'braincore.id',
        role: 'Speaker',
        roleIcon: 'fas fa-microphone',
        year: '2024',
        themeColors: {
            gradient: 'from-yellow-100 to-yellow-200',
            badge: 'bg-yellow-600',
            role: 'text-yellow-600',
            tags: 'bg-yellow-100 text-yellow-700'
        },
        tags: ['CV Writing', 'Interview Skills', 'Job Search']
    }
];

// Global variable for scripts
if (typeof window !== 'undefined') {
    window.SPEAKING_EVENTS_DATA = SPEAKING_EVENTS_DATA;
}