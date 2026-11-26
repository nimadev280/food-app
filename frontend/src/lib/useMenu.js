import { useCallback, useEffect, useState } from "react";
import { api } from "./api.js";
import { useAuth } from "../context/AuthContext.jsx";

export function useMenu() {
    const { token } = useAuth();
    const [foods, setFoods] = useState([]);
    const [ratings, setRatings] = useState({}); // { foodId: { avg, count } }
    const [mine, setMine] = useState({});       // { foodId: stars }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [f, r] = await Promise.all([api("/food"), api("/rating/summary")]);
            setFoods(f.result);
            setRatings(Object.fromEntries(r.result.map((x) => [x._id, { avg: x.avg, count: x.count }])));

            if (token) {
                const m = await api("/rating/mine", { token });
                setMine(Object.fromEntries(m.result.map((x) => [x.food, x.stars])));
            } else {
                setMine({});
            }
        } catch {
            setError("We couldn't load the menu. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        load();
    }, [load]);

    const rate = async (foodId, stars) => {
        setNotice("");
        try {
            await api("/rating", { method: "POST", token, body: { food: foodId, stars } });
            setMine((m) => ({ ...m, [foodId]: stars }));
            const r = await api("/rating/summary");
            setRatings(Object.fromEntries(r.result.map((x) => [x._id, { avg: x.avg, count: x.count }])));
        } catch (err) {
            setNotice(err.message);
        }
    };

    return { foods, ratings, mine, loading, error, notice, rate, reload: load };
}