import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // Using useNavigate instead of useHistory

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "https://mcsbt-integration-415614.oa.r.appspot.com/login",
                {
                    method: "POST",
                    credentials: "include", // Important for cookies
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: `username=${encodeURIComponent(
                        username
                    )}&password=${encodeURIComponent(password)}`,
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                // Redirect to another page on successful login
                navigate("/overview");
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <p>Get insights about your stock portfolio</p>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            <p className="link-to-register">
                Don't have an account yet?{" "}
                <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}

export default LoginPage;
