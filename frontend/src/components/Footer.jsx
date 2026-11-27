import { Link } from "react-router-dom";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-grid">
                    <div>
                        <div className="brand light">
                            Tasty<span>Bites</span>
                        </div>
                        <p className="footer-text">Freshly cooked and delivered to your door.</p>
                    </div>

                    <div className="footer-col">
                        <h3>Explore</h3>
                        <Link to="/">Home</Link>
                        <Link to="/menu">Menu</Link>
                        <Link to="/order">Order</Link>
                    </div>

                    <div className="footer-col">
                        <h3>Account</h3>
                        <Link to="/login">Log in</Link>
                        <Link to="/register">Sign up</Link>
                    </div>

                    <div className="footer-col">
                        <h3>Contact</h3>
                        <span className="footer-text">TastyBites@gmail.com</span>
                        <span className="footer-text">+977 9808373755</span>
                    </div>
                </div>

                <div className="footer-bottom">
                    © {year} Tasty Bites. All rights reserved.
                </div>
            </div>
        </footer>
    );
}