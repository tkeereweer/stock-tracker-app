import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./StockList.css";

function StockList() {
    const [portfolio, setPortfolio] = useState({ total_value: 0, symbols: {} });

    useEffect(() => {
        fetch("http://127.0.0.1:5000/user1") // Assuming user1 for demonstration
            .then((response) => response.json())
            .then((data) => {
                setPortfolio(data); // Set the entire data structure
            })
            .catch((error) =>
                console.error("Error fetching portfolio:", error)
            );
    }, []);

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
                        <th>Value</th> {/* New column for value */}
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
