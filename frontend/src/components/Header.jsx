import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Header() {
    const { user, logout } = useAuth();
    const { count } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="site-header">
            <div className="container header-inner">
                <Link to="/" className="brand">
                    Tasty<span>Bites</span>
                </Link>

                <nav className="nav">
                    <NavLink to="/" end>Home</NavLink>
                    <NavLink to="/menu">Menu</NavLink>
                    <NavLink to="/order">
                        Order
                        {count > 0 && <span className="badge">{count}</span>}
                    </NavLink>

                    {user ? (
                        <>
                            <span className="nav-user">Hi, {user.name.split(" ")[0]}</span>
                            <button className="btn btn-secondary" onClick={handleLogout}>
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login">Log in</NavLink>
                            <Link className="btn btn-primary" to="/register">
                                Sign up
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}