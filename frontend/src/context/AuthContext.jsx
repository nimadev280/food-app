import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    }, []);

    const saveSession = useCallback((newToken, newUser) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(newUser);
    }, []);

    // On load, check that the saved token is still valid
    useEffect(() => {
        if (!token) {
            setReady(true);
            return;
        }
        let cancelled = false;
        api("/auth/me", { token })
            .then((d) => { if (!cancelled) setUser(d.user); })
            .catch(() => { if (!cancelled) logout(); })
            .finally(() => { if (!cancelled) setReady(true); });
        return () => { cancelled = true; };
    }, [token, logout]);

    return (
        <AuthContext.Provider value={{ token, user, ready, saveSession, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);