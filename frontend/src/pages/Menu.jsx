import { useMenu } from "../lib/useMenu.js";
import FoodCard from "../components/FoodCard.jsx";

export default function Menu() {
    const { foods, ratings, mine, loading, error, notice, rate } = useMenu();

    return (
        <section className="section section-first">
            <div className="container">
                <div className="section-head">
                    <div>
                        <h1 className="page-title">Menu</h1>
                        <p className="muted">Fresh dishes, rated by people who ate them.</p>
                    </div>
                </div>

                {notice && <p className="alert" role="alert">{notice}</p>}
                {loading && <p className="muted">Loading dishes…</p>}
                {error && <p className="alert" role="alert">{error}</p>}
                {!loading && !error && foods.length === 0 && (
                    <p className="muted">The menu is empty right now. Check back soon.</p>
                )}

                {!loading && !error && foods.length > 0 && (
                    <div className="grid">
                        {foods.map((food) => (
                            <FoodCard
                                key={food._id}
                                food={food}
                                rating={ratings[food._id]}
                                myRating={mine[food._id]}
                                onRate={rate}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}