import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./StockList.css";

function StockList() {
    const [portfolio, setPortfolio] = useState({ total_value: 0, symbols: {} });
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState(null);
    const [form, setForm] = useState({
        stock_symbol: "",
        quantity: "",
        operation: "add",
    });

    useEffect(() => {
        fetch("https://mcsbt-integration-415614.oa.r.appspot.com/overview")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setPortfolio(data); // Set the entire data structure
            })
            .catch((error) => {
                console.error("Error fetching portfolio:", error);
                setError("Failed to fetch portfolio. Please try again later.");
            });
    }, []);

    const isPortfolioEmpty = () => {
        return Object.keys(portfolio.symbols).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(
            "https://mcsbt-integration-415614.oa.r.appspot.com/modifyPortfolio",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            }
        )
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((data) => {
                        throw new Error(data.error);
                    });
                }
                return response.json();
            })
            .then((data) => {
                setPortfolio(data); // Update portfolio data
                setFormError(null); // Clear any existing error messages
            })
            .catch((error) => {
                setFormError(error.message);
            });
    };

    if (error) {
        return <div className="container">{error}</div>;
    }

    return (
        <div className="container">
            <h1>Stock Portfolio</h1>
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
                                        <td>${details.value}</td>{" "}
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
