// Central Mentoring Data Management
// Single source of truth for all mentoring session images

const MENTORING_DATA = [
    {
        id: 1,
        image: './assets/mentor-firra-1.jpeg',
        title: 'Career Strategy Session',
        description: 'One-on-one mentoring session focused on developing comprehensive career roadmaps and strategic planning for professional growth.',
        alt: 'Firra conducting a career strategy mentoring session'
    },
    {
        id: 2,
        image: './assets/mentor-firra-2.jpeg',
        title: 'Skills Development Guidance',
        description: 'Personalized skills assessment and development planning session to identify key competencies for career advancement.',
        alt: 'Firra providing skills development guidance during mentoring'
    },
    {
        id: 3,
        image: './assets/mentor-firra-3.jpeg',
        title: 'Interview Preparation Coaching',
        description: 'Intensive interview preparation session covering behavioral questions, communication strategies, and confidence building techniques.',
        alt: 'Firra coaching client for interview preparation'
    },
    {
        id: 4,
        image: './assets/mentor-firra-4.jpeg',
        title: 'Goal Setting Workshop',
        description: 'Interactive goal-setting session using proven frameworks to establish clear, measurable, and achievable career objectives.',
        alt: 'Firra facilitating goal setting workshop with mentee'
    },
    {
        id: 5,
        image: './assets/mentor-firra-5.jpeg',
        title: 'Professional Development Review',
        description: 'Comprehensive review session evaluating progress, celebrating achievements, and adjusting strategies for continued growth.',
        alt: 'Firra conducting professional development review session'
    }
];

// Global variable for scripts
if (typeof window !== 'undefined') {
    window.MENTORING_DATA = MENTORING_DATA;
}