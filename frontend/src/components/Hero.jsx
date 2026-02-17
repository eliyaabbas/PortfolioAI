import { useState, useEffect } from 'react';
import '../styles/hero.css';

const titles = [
    'Python Developer',
    'Data Analyst',
    'ML Engineer',
    'Full Stack Builder',
];

export default function Hero() {
    const [titleIndex, setTitleIndex] = useState(0);
    const [displayed, setDisplayed] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const current = titles[titleIndex];
        let timeout;

        if (!deleting) {
            if (displayed.length < current.length) {
                timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
            } else {
                timeout = setTimeout(() => setDeleting(true), 1800);
            }
        } else {
            if (displayed.length > 0) {
                timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
            } else {
                setDeleting(false);
                setTitleIndex((prev) => (prev + 1) % titles.length);
            }
        }

        return () => clearTimeout(timeout);
    }, [displayed, deleting, titleIndex]);

    const handleScroll = (id) => {
        document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="hero" id="hero">
            <div className="hero__content">
                <p className="hero__greeting">Hello, I'm</p>
                <h1 className="hero__name">Eliya Abbas Sayyed</h1>
                <h2 className="hero__title">
                    <span className="hero__typed">{displayed}</span>
                    <span className="hero__cursor">|</span>
                </h2>
                <p className="hero__tagline">
                    Building intelligent solutions with Python, Data &amp; AI — turning raw data into real impact.
                </p>
                <div className="hero__actions">
                    <button className="hero__btn hero__btn--primary" onClick={() => handleScroll('#projects')}>
                        View Projects
                    </button>
                    <button className="hero__btn hero__btn--secondary" onClick={() => handleScroll('#contact')}>
                        Contact Me
                    </button>
                </div>
            </div>
            <div className="hero__glow" />
        </section>
    );
}
