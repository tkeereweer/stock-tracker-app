import React from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function LoginPage() {
    return (
        <div>
            <h2>Login</h2>
            <form
                method="POST"
                action="https://mcsbt-integration-415614.oa.r.appspot.com/login"
            >
                <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <Link to="/register">Register here</Link>
                .
            </p>
        </div>
    );
}

export default LoginPage;
