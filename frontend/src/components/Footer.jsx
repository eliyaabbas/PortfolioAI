import '../styles/footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__container">
                <p className="footer__copy">
                    &copy; {new Date().getFullYear()} Eliya Abbas Sayyed. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
