import { useEffect, useState } from "react";
import { Plus, Minus } from "lucide-react";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
const fallback = "https://placehold.co/400x300?text=Food";

function App() {
    const [foods, setFoods] = useState([]);
    const [loadingFoods, setLoadingFoods] = useState(true);
    const [foodError, setFoodError] = useState("");
    const [cart, setCart] = useState([]);
    const [form, setForm] = useState({
        customerName: "",
        phone: "",
        address: "",
    });
    const [message, setMessage] = useState("");

    const getFoods = async () => {
        setLoadingFoods(true);
        setFoodError("");
        try {
            const res = await fetch(`${API}/food`);
            const data = await res.json();
            setFoods(data.result);
        } catch (error) {
            setFoodError("We couldn't load the menu. Check your connection and try again.");
        } finally {
            setLoadingFoods(false);
        }
    };

    useEffect(() => {
        getFoods();
    }, []);

    const addToCart = (food) => {
        setMessage("");
        const exists = cart.find((item) => item._id === food._id);
        if (exists) {
            setCart(
                cart.map((item) =>
                    item._id === food._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            setCart([
                ...cart,
                { _id: food._id, name: food.name, price: food.price, quantity: 1 },
            ]);
        }
    };

    const changeQty = (id, change) => {
        setCart(
            cart
                .map((item) =>
                    item._id === id
                        ? { ...item, quantity: item.quantity + change }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const placeOrder = async (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            setMessage("Your cart is empty. Add something from the menu first.");
            return;
        }
        const name = form.customerName;
        try {
            const res = await fetch(`${API}/order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    items: cart.map((item) => ({
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                    total: total,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setCart([]);
                setForm({ customerName: "", phone: "", address: "" });
                setMessage(`Thanks, ${name}! Your order is placed.`);
            } else {
                setMessage(data.message || "We couldn't place your order. Please try again.");
            }
        } catch (error) {
            setMessage("We couldn't reach the server. Check your connection and try again.");
        }
    };

    return (
        <div className="page">
            <header className="header">
                <h1>Tasty Bites</h1>
                <p>Order your favourite food online</p>
            </header>

            <div className="layout">
                <section className="menu">
                    <h2>Menu</h2>

                    {loadingFoods && (
                        <div className="grid">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div className="card skeleton" key={i} aria-hidden="true" />
                            ))}
                        </div>
                    )}

                    {!loadingFoods && foodError && (
                        <div className="state">
                            <p>{foodError}</p>
                            <button className="btn-secondary" onClick={getFoods}>
                                Try again
                            </button>
                        </div>
                    )}

                    {!loadingFoods && !foodError && foods.length === 0 && (
                        <p className="state">The menu is empty right now. Check back soon.</p>
                    )}

                    {!loadingFoods && !foodError && foods.length > 0 && (
                        <div className="grid">
                            {foods.map((food) => (
                                <div className="card" key={food._id}>
                                    <img
                                        src={food.image}
                                        alt={food.name}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = fallback;
                                        }}
                                    />
                                    <div className="card-body">
                                        <h3>{food.name}</h3>
                                        <p className="desc">{food.description}</p>
                                        <div className="card-footer">
                                            <span className="price">Rs. {food.price}</span>
                                            <button onClick={() => addToCart(food)}>
                                                Add to cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <aside className="cart">
                    <h2>Your cart</h2>
                    {cart.length === 0 && (
                        <p>Your cart is empty. Add a dish from the menu to get started.</p>
                    )}
                    {cart.map((item) => (
                        <div className="cart-item" key={item._id}>
                            <span className="cart-name">{item.name}</span>
                            <div className="qty">
                                <button
                                    className="icon-btn"
                                    aria-label="Decrease quantity"
                                    onClick={() => changeQty(item._id, -1)}
                                >
                                    <Minus size={16} strokeWidth={2} />
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    className="icon-btn"
                                    aria-label="Increase quantity"
                                    onClick={() => changeQty(item._id, 1)}
                                >
                                    <Plus size={16} strokeWidth={2} />
                                </button>
                            </div>
                            <span>Rs. {item.price * item.quantity}</span>
                        </div>
                    ))}
                    <h3 className="cart-total">Total: Rs. {total}</h3>

                    <form onSubmit={placeOrder} className="order-form">
                        <input
                            type="text"
                            name="customerName"
                            placeholder="Your name"
                            value={form.customerName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone number"
                            value={form.phone}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="address"
                            placeholder="Delivery address"
                            value={form.address}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit">Place order</button>
                    </form>
                    {message && <p className="message">{message}</p>}
                </aside>
            </div>
        </div>
    );
}

export default App;