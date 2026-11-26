import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Order() {
    const { user } = useAuth();
    const { cart, change, clear, total } = useCart();
    const [form, setForm] = useState({ customerName: "", phone: "", address: "" });
    const [status, setStatus] = useState({ type: "", text: "" });
    const [submitting, setSubmitting] = useState(false);

    // Pre-fill the name for logged-in users
    useEffect(() => {
        if (user) setForm((f) => ({ ...f, customerName: f.customerName || user.name }));
    }, [user]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            setStatus({ type: "error", text: "Your cart is empty. Add something from the menu first." });
            return;
        }

        const name = form.customerName;
        setSubmitting(true);
        setStatus({ type: "", text: "" });

        try {
            await api("/order", {
                method: "POST",
                body: {
                    ...form,
                    items: cart.map(({ name, price, quantity }) => ({ name, price, quantity })),
                    total,
                },
            });
            clear();
            setForm({ customerName: "", phone: "", address: "" });
            setStatus({ type: "ok", text: `Thanks, ${name}! Your order is placed.` });
        } catch (err) {
            setStatus({ type: "error", text: err.message });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="section section-first">
            <div className="container">
                <h1 className="page-title">Your order</h1>

                <div className="order-layout">
                    <div>
                        <h2>Cart</h2>

                        {cart.length === 0 ? (
                            <div className="empty-box">
                                <p className="muted">Your cart is empty.</p>
                                <Link className="btn btn-primary" to="/menu">
                                    Go to menu
                                </Link>
                            </div>
                        ) : (
                            <>
                                {cart.map((item) => (
                                    <div className="cart-item" key={item._id}>
                                        <span className="cart-name">{item.name}</span>
                                        <div className="qty">
                                            <button
                                                className="icon-btn"
                                                aria-label={`Decrease ${item.name}`}
                                                onClick={() => change(item._id, -1)}
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="qty-num">{item.quantity}</span>
                                            <button
                                                className="icon-btn"
                                                aria-label={`Increase ${item.name}`}
                                                onClick={() => change(item._id, 1)}
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <span className="cart-line">Rs. {item.price * item.quantity}</span>
                                    </div>
                                ))}
                                <p className="cart-total">Total: Rs. {total}</p>
                            </>
                        )}
                    </div>

                    <div>
                        <h2>Delivery details</h2>
                        <form className="form" onSubmit={submit}>
                            <div className="field">
                                <label htmlFor="customerName">Your name</label>
                                <input id="customerName" name="customerName" value={form.customerName} onChange={handleChange} required />
                            </div>
                            <div className="field">
                                <label htmlFor="phone">Phone number</label>
                                <input id="phone" name="phone" value={form.phone} onChange={handleChange} required />
                            </div>
                            <div className="field">
                                <label htmlFor="address">Delivery address</label>
                                <input id="address" name="address" value={form.address} onChange={handleChange} required />
                            </div>
                            <button className="btn btn-primary" type="submit" disabled={submitting}>
                                {submitting ? "Placing order…" : "Place order"}
                            </button>
                        </form>

                        {status.text && (
                            <p className={status.type === "ok" ? "alert alert-ok" : "alert"} role="alert">
                                {status.text}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}