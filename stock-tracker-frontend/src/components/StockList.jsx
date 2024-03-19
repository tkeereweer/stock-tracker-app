import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./StockList.css";

function StockList() {
    const navigate = useNavigate();
    const [portfolio, setPortfolio] = useState({ total_value: 0, symbols: {} });
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState(null);
    const [form, setForm] = useState({
        stock_symbol: "",
        quantity: "",
        operation: "add",
    });

    useEffect(() => {
        fetch("https://mcsbt-integration-415614.oa.r.appspot.com/overview", {
            credentials: "include",
        })
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 401) {
                        // Redirect to the login page
                        navigate(""); // make sure you have 'navigate' from useNavigate()
                    }
                    throw new Error("Not authorized");
                }
                return response.json();
            })
            .then((data) => {
                setPortfolio(data); // Set the entire data structure
            })
            .catch((error) => {
                if (error.message === "Portfolio empty") {
                    setError("No stocks in portfolio. Please add stocks.");
                } else {
                    console.error("Error fetching portfolio:", error);
                    setError(
                        "Failed to fetch portfolio. Please try again later."
                    );
                }
            });
    }, []);

    const isPortfolioEmpty = () => {
        return Object.keys(portfolio.symbols).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null); // Reset any existing errors

        try {
            const modifyResponse = await fetch(
                "https://mcsbt-integration-415614.oa.r.appspot.com/modifyPortfolio",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                    credentials: "include",
                }
            );

            if (!modifyResponse.ok) {
                const errorData = await modifyResponse.json();
                throw new Error(
                    errorData.error || "Failed to modify portfolio"
                );
            }

            // Fetch the updated stocklist after successful modification
            const overviewResponse = await fetch(
                "https://mcsbt-integration-415614.oa.r.appspot.com/overview",
                {
                    credentials: "include",
                    redirect: "follow",
                }
            );

            if (!overviewResponse.ok) {
                throw new Error("Failed to fetch updated portfolio.");
            }

            const updatedPortfolio = await overviewResponse.json();
            setPortfolio(updatedPortfolio);
        } catch (error) {
            setFormError(error.message);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch(
                "https://mcsbt-integration-415614.oa.r.appspot.com/logout",
                {
                    credentials: "include",
                    redirect: "follow",
                }
            );
            navigate("/"); // Redirect to login page or home page after logout
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (error) {
        return <div className="container">{error}</div>;
    }

    return (
        <div className="container">
            <h1>Stock Portfolio</h1>
            <button onClick={handleLogout}>Logout</button>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="stock_symbol"
                    value={form.stock_symbol}
                    onChange={handleInputChange}
                    placeholder="Stock Symbol"
                    required
                />
                <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleInputChange}
                    placeholder="Quantity"
                    required
                />
                <div>
                    <input
                        type="radio"
                        name="operation"
                        value="add"
                        checked={form.operation === "add"}
                        onChange={handleInputChange}
                    />
                    Add
                    <input
                        type="radio"
                        name="operation"
                        value="remove"
                        checked={form.operation === "remove"}
                        onChange={handleInputChange}
                    />
                    Remove
                </div>
                <button type="submit">Submit</button>
            </form>
            {formError && <div className="error">{formError}</div>}
            {isPortfolioEmpty() ? (
                <p>Portfolio is empty. Please add stocks.</p>
            ) : (
                <>
                    {/* Displaying total portfolio value */}
                    <p>Total Portfolio Value: ${portfolio.total_value}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Stock Symbol</th>
                                <th>Quantity</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(portfolio.symbols).map(
                                ([stock, details], index) => (
                                    <tr key={index}>
                                        <td>
                                            <Link to={`/stockinfo/${stock}`}>
                                                {stock}
                                            </Link>
                                        </td>
                                        <td>{details.quantity}</td>
                                        <td>${details.value}</td>
                                        {""}
                                        {/* Displaying value */}
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

export default StockList;
