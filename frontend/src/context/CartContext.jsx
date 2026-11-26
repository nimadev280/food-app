import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const add = (food) =>
        setCart((c) => {
            const exists = c.find((i) => i._id === food._id);
            if (exists) {
                return c.map((i) => (i._id === food._id ? { ...i, quantity: i.quantity + 1 } : i));
            }
            return [...c, { _id: food._id, name: food.name, price: food.price, quantity: 1 }];
        });

    const change = (id, delta) =>
        setCart((c) =>
            c.map((i) => (i._id === id ? { ...i, quantity: i.quantity + delta } : i))
                .filter((i) => i.quantity > 0)
        );

    const clear = () => setCart([]);

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const count = cart.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, add, change, clear, total, count }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);