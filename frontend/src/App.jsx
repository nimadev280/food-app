import { Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import Order from "./pages/Order.jsx";
import AuthPage from "./pages/AuthPage.jsx";

export default function App() {
    return (
        <div className="app">
            <Header />
            <main className="main">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/order" element={<Order />} />
                    <Route path="/login" element={<AuthPage mode="login" />} />
                    <Route path="/register" element={<AuthPage mode="register" />} />
                    <Route
                        path="*"
                        element={
                            <section className="section">
                                <div className="container narrow">
                                    <h1>Page not found</h1>
                                    <p className="muted">That page doesn't exist.</p>
                                    <Link className="btn btn-primary" to="/">
                                        Back to home
                                    </Link>
                                </div>
                            </section>
                        }
                    />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}