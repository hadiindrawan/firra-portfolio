// Central Services Data Management
// Single source of truth for all services

const SERVICES_DATA = [
    {
        id: 1,
        icon: 'fas fa-chalkboard-teacher',
        title: 'Professional Training',
        description: 'Comprehensive training programs designed to enhance professional skills and competencies aligned with industry standards.',
        features: [
            'Personal Growth',
            'Communication Skills',
            'Networking & Relationship',
        ]
    },
    {
        id: 2,
        icon: 'fas fa-user-friends',
        title: '1 on 1 Mentoring',
        description: 'Personalized career guidance to help you navigate professional challenges and identify growth opportunities through one-on-one mentoring sessions.',
        features: [
            'Career Path Planning',
            'Skill Gap Analysis',
            'Goal Setting & Strategy'
        ]
    },
    {
        id: 3,
        icon: 'fas fa-users',
        title: 'L&D Strategy',
        description: 'Strategic learning and development solutions to build individual capabilities and drive business results.',
        features: [
            'Learning Strategy Design',
            'Capability Assessment',
            'Performance Improvement'
        ]
    },
    {
        id: 4,
        icon: 'fas fa-chart-line',
        title: 'Skills Development',
        description: 'Targeted skill enhancement programs to meet current and future industry demands and technological changes.',
        features: [
            'Technical Skills Training',
            'Soft Skills Enhancement',
            'Digital Literacy'
        ]
    },
    {
        id: 5,
        icon: 'fas fa-lightbulb',
        title: 'Workshop Facilitation',
        description: 'Interactive workshops and seminars designed to engage participants and deliver practical, actionable insights.',
        features: [
            'Interactive Sessions',
            'Team Workshops',
            'Custom Programs'
        ]
    },
    {
        id: 6,
        icon: 'fas fa-handshake',
        title: 'Consultation',
        description: 'Strategic consultation services to help organizations build effective learning cultures and development frameworks.',
        features: [
            'Organizational Analysis',
            'Strategic Planning',
            'Implementation Support'
        ]
    }
];

// Global variable for scripts
if (typeof window !== 'undefined') {
    window.SERVICES_DATA = SERVICES_DATA;
}