import '../styles/skills.css';

const skills = [
    { name: 'Python', level: 95 },
    { name: 'SQL', level: 88 },
    { name: 'Machine Learning', level: 82 },
    { name: 'Data Analysis', level: 90 },
    { name: 'Tableau', level: 78 },
    { name: 'React', level: 80 },
    { name: 'Node.js', level: 75 },
    { name: 'MongoDB', level: 72 },
    { name: 'LLMs & Prompt Eng.', level: 70 },
    { name: 'AWS', level: 45 },
];

export default function Skills() {
    return (
        <section className="skills" id="skills">
            <div className="skills__container">
                <h2 className="section-title">Skills</h2>
                <div className="skills__grid">
                    {skills.map((skill) => (
                        <div className="skills__item" key={skill.name}>
                            <div className="skills__info">
                                <span className="skills__name">{skill.name}</span>
                                <span className="skills__percent">{skill.level}%</span>
                            </div>
                            <div className="skills__bar">
                                <div
                                    className="skills__fill"
                                    style={{ '--skill-level': `${skill.level}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
