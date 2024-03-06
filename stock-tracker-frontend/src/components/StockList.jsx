import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./StockList.css";

function StockList() {
    const [portfolio, setPortfolio] = useState({ total_value: 0, symbols: {} });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("https://mcsbt-integration-415614.oa.r.appspot.com/user1")
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

    if (error) {
        return <div className="container">{error}</div>;
    }

    return (
        <div className="container">
            <h1>Stock Portfolio</h1>
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
        </div>
    );
}

export default StockList;
