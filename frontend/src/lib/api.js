export const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function api(path, { method = "GET", body, token } = {}) {
    const headers = {};
    if (body) headers["Content-Type"] = "application/json";
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res
        .json()
        .catch(() => ({ success: false, message: "Unexpected response from the server." }));

    if (!res.ok || data.success === false) {
        throw new Error(data.message || "Something went wrong. Please try again.");
    }
    return data;
}