import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null); // Reset error state

        try {
            const response = await fetch(
                "https://mcsbt-integration-415614.oa.r.appspot.com/register",
                {
                    method: "POST",
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
                // Redirect to login page on successful registration
                navigate("/"); // Assuming "/" is your login route
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setError(error.message);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
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
                <button type="submit">Register</button>
            </form>
            {error && <div className="error">{error}</div>}
            <p>
                Already have an account? <Link to="/">Login here</Link>.
            </p>
        </div>
    );
}

export default RegisterPage;
