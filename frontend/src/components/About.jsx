import '../styles/about.css';

const skillCategories = [
    {
        title: 'Frontend',
        skills: ['React', 'JavaScript', 'HTML5', 'CSS3'],
    },
    {
        title: 'Backend',
        skills: ['Node.js', 'MongoDB', 'REST APIs', 'Express.js'],
    },
    {
        title: 'Data & Analytics',
        skills: ['Python', 'SQL', 'Tableau', 'Pandas'],
    },
    {
        title: 'Machine Learning',
        skills: ['Scikit-learn', 'Feature Engineering', 'LLMs', 'Prompt Engineering'],
    },
];

export default function About() {
    return (
        <section className="about" id="about">
            <div className="about__container">
                <h2 className="section-title">About Me</h2>
                <p className="about__text">
                    I'm a <strong>Python Developer &amp; Data Analyst</strong> with 4+ years of experience
                    crafting data-driven solutions, building full-stack web applications, and developing
                    machine learning models. I hold a B.E. in Computer Science with a specialization in
                    AI &amp; Machine Learning.
                </p>
                <p className="about__text">
                    My passion lies at the intersection of software engineering and data science — I love
                    turning complex datasets into actionable insights, building intelligent systems, and
                    creating seamless user experiences. Currently expanding my expertise in AWS cloud
                    services and Large Language Models.
                </p>

                <div className="about__skills-grid">
                    {skillCategories.map((cat) => (
                        <div className="about__skill-card" key={cat.title}>
                            <h3 className="about__skill-title">{cat.title}</h3>
                            <ul className="about__skill-list">
                                {cat.skills.map((skill) => (
                                    <li key={skill}>{skill}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
