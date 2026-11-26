import { useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const fallback = "https://placehold.co/600x400?text=Food";

export default function FoodCard({ food, rating, myRating, onRate }) {
    const { token } = useAuth();
    const { add } = useCart();
    const [hover, setHover] = useState(0);

    const avg = rating?.avg ?? 0;
    const count = rating?.count ?? 0;
    const shown = hover || myRating || 0;

    return (
        <article className="food-card">
            <img
                src={food.image}
                alt={food.name}
                onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallback;
                }}
            />

            <div className="food-body">
                <h3>{food.name}</h3>
                {food.description && <p className="desc">{food.description}</p>}

                <p className="rating-meta">
                    {count > 0
                        ? `★ ${avg.toFixed(1)} · ${count} rating${count > 1 ? "s" : ""}`
                        : "No ratings yet"}
                </p>

                {token ? (
                    <div>
                        <div className="stars" role="group" aria-label={`Rate ${food.name}`}>
                            {[1, 2, 3, 4, 5].map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    className="star-btn"
                                    aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
                                    onMouseEnter={() => setHover(n)}
                                    onMouseLeave={() => setHover(0)}
                                    onFocus={() => setHover(n)}
                                    onBlur={() => setHover(0)}
                                    onClick={() => onRate(food._id, n)}
                                >
                                    <Star
                                        size={22}
                                        fill={shown >= n ? "currentColor" : "none"}
                                    />
                                </button>
                            ))}
                        </div>
                        <small className="rating-meta">
                            {myRating ? `You rated this ${myRating}/5` : "Tap a star to rate"}
                        </small>
                    </div>
                ) : (
                    <small className="rating-meta">
                        <Link to="/login">Log in</Link> to rate this dish
                    </small>
                )}

                <div className="food-footer">
                    <span className="price">Rs. {food.price}</span>
                    <button className="btn btn-primary" onClick={() => add(food)}>
                        Add to cart
                    </button>
                </div>
            </div>
        </article>
    );
}