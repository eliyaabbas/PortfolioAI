import '../styles/projects.css';

const projects = [
    {
        title: 'Digital Menu Platform',
        description:
            'A QR-based restaurant digital menu system that allows restaurants to create and manage digital menus with custom templates, authentication, and a full dashboard for order management.',
        stack: ['React', 'Node.js', 'MongoDB', 'Express.js'],
        github: '#',
        demo: '#',
    },
    {
        title: 'Wallet Risk Scoring System',
        description:
            'An ML-based credit scoring system operating on a 0–1000 scale for DeFi wallets. Uses feature engineering and unsupervised machine learning to analyze transaction patterns and assess risk.',
        stack: ['Python', 'Scikit-learn', 'Pandas', 'Feature Engineering'],
        github: '#',
        demo: '#',
    },
    {
        title: 'AI Interviewer Concept',
        description:
            'An LLM-powered technical interview simulator that generates questions, evaluates candidate responses, and delivers detailed feedback — simulating a real interview experience.',
        stack: ['Python', 'LLMs', 'Prompt Engineering', 'NLP'],
        github: '#',
        demo: '#',
    },
];

export default function Projects() {
    return (
        <section className="projects" id="projects">
            <div className="projects__container">
                <h2 className="section-title">Projects</h2>
                <div className="projects__grid">
                    {projects.map((project) => (
                        <article className="projects__card" key={project.title}>
                            <div className="projects__card-header">
                                <svg className="projects__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                            </div>
                            <h3 className="projects__card-title">{project.title}</h3>
                            <p className="projects__card-desc">{project.description}</p>
                            <div className="projects__card-stack">
                                {project.stack.map((tech) => (
                                    <span className="projects__tag" key={tech}>{tech}</span>
                                ))}
                            </div>
                            <div className="projects__card-links">
                                <a href={project.github} className="projects__link" target="_blank" rel="noopener noreferrer">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.607.069-.607 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                                    </svg>
                                    GitHub
                                </a>
                                <a href={project.demo} className="projects__link" target="_blank" rel="noopener noreferrer">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                                    </svg>
                                    Live Demo
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
