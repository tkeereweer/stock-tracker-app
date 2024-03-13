import React from "react";
import { Link } from "react-router-dom";
import "./Register.css";

function RegisterPage() {
    return (
        <div>
            <h2>Register</h2>
            <form
                method="POST"
                action="https://mcsbt-integration-415614.oa.r.appspot.com/register"
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
                <button type="submit">Register</button>
            </form>
            <p>
                Already have an account? <Link to="/">Login here</Link>.
            </p>
        </div>
    );
}

export default RegisterPage;
