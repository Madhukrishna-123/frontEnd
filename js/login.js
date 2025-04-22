const API_BASE_URL =
    window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1")
        ? "http://localhost:8080/api/users"
        : "https://9bf0-45-127-59-91.ngrok-free.app/api/users";

// Show error on the page
function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = message;
    else console.error(`❌ Missing element: ${elementId}`);
}

// Generic API Call
async function apiCall(endpoint, method, body = null) {
    try {
        const headers = { "Content-Type": "application/json" };
        const token = localStorage.getItem("token");

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: method,
            headers,
            body: body ? JSON.stringify(body) : null,
        });

        const contentType = response.headers.get("content-type");
        const data = contentType?.includes("application/json")
            ? await response.json()
            : await response.text();

        if (!response.ok) {
            throw new Error(data?.message || data || "Something went wrong");
        }

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

// Login Handler
async function loginUser() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        return showError("login-error", "Email and password are required!");
    }

    try {
        const data = await apiCall("login", "POST", { email, password });
        const token = data.token;

        if (!token) {
            return showError("login-error", "No token received from server.");
        }

        // Store user + token
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ Redirect after login
        redirectTo("home");
    } catch (error) {
        showError("login-error", error.message);
    }
}

// Redirect
function redirectTo(page) {
    window.location.href = `${page}.html`;
}
