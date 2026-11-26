import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthPage({ mode }) {
    const isLogin = mode === "login";
    const { saveSession } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/";

    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setBusy(true);
        try {
            const path = isLogin ? "/auth/login" : "/auth/register";
            const body = isLogin ? { email: form.email, password: form.password } : form;
            const data = await api(path, { method: "POST", body });
            saveSession(data.token, data.user);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <section className="section section-first">
            <div className="container narrow">
                <h1 className="page-title">{isLogin ? "Welcome back" : "Create your account"}</h1>
                <p className="muted">
                    {isLogin
                        ? "Log in to rate the dishes you've tried."
                        : "It takes less than a minute."}
                </p>

                <form className="form" onSubmit={submit}>
                    {!isLogin && (
                        <Field label="Full name" name="name" value={form.name} onChange={handleChange} autoComplete="name" required />
                    )}
                    <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" required />
                    <Field label="Password" name="password" type="password" value={form.password} onChange={handleChange} autoComplete={isLogin ? "current-password" : "new-password"} minLength={6} required />

                    {error && <p className="alert" role="alert">{error}</p>}

                    <button className="btn btn-primary" type="submit" disabled={busy}>
                        {busy ? "Please wait…" : isLogin ? "Log in" : "Sign up"}
                    </button>
                </form>

                <p className="muted">
                    {isLogin ? (
                        <>New here? <Link to="/register">Create an account</Link></>
                    ) : (
                        <>Already have an account? <Link to="/login">Log in</Link></>
                    )}
                </p>
            </div>
        </section>
    );
}

function Field({ label, name, ...props }) {
    return (
        <div className="field">
            <label htmlFor={name}>{label}</label>
            <input id={name} name={name} {...props} />
        </div>
    );
}