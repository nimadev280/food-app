import { Link } from "react-router-dom";
import { useMenu } from "../lib/useMenu.js";
import FoodCard from "../components/FoodCard.jsx";

export default function Home() {
    const { foods, ratings, mine, loading, error, notice, rate } = useMenu();

    const topRated = [...foods]
        .sort((a, b) => (ratings[b._id]?.avg || 0) - (ratings[a._id]?.avg || 0))
        .slice(0, 3);

    return (
        <>
            <section className="hero">
                <div className="container">
                    <h1>
                        Hungry?
                        <br />
                        Good food, fast.
                    </h1>
                    <p>
                        Browse the menu, rate the dishes you've tried, and get your order
                        delivered to your door.
                    </p>
                    <div className="cta-row">
                        <Link className="btn btn-primary" to="/menu">
                            Browse menu
                        </Link>
                        <Link className="btn btn-secondary" to="/order">
                            View cart
                        </Link>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="section-head">
                        <h2>Top rated</h2>
                        <Link to="/menu">See the full menu →</Link>
                    </div>

                    {notice && <p className="alert" role="alert">{notice}</p>}
                    {loading && <p className="muted">Loading dishes…</p>}
                    {error && <p className="alert" role="alert">{error}</p>}
                    {!loading && !error && topRated.length === 0 && (
                        <p className="muted">The menu is empty right now. Check back soon.</p>
                    )}

                    <div className="grid grid-3">
                        {topRated.map((food) => (
                            <FoodCard
                                key={food._id}
                                food={food}
                                rating={ratings[food._id]}
                                myRating={mine[food._id]}
                                onRate={rate}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="section section-tight">
                <div className="container narrow-wide">
                    <h2>How it works</h2>
                    <ol className="steps">
                        <li>
                            <span className="step-num">01</span>
                            <div>
                                <h3>Pick your dishes</h3>
                                <p className="muted">Add anything from the menu to your cart.</p>
                            </div>
                        </li>
                        <li>
                            <span className="step-num">02</span>
                            <div>
                                <h3>Share your details</h3>
                                <p className="muted">Name, phone and delivery address, nothing more.</p>
                            </div>
                        </li>
                        <li>
                            <span className="step-num">03</span>
                            <div>
                                <h3>Rate what you loved</h3>
                                <p className="muted">Log in and leave stars to help others choose.</p>
                            </div>
                        </li>
                    </ol>
                </div>
            </section>
        </>
    );
}