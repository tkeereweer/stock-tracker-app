import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./StockList.css";

function StockList() {
    const [portfolio, setPortfolio] = useState([]);

    useEffect(() => {
        fetch("https://mcsbt-integration-415614.oa.r.appspot.com/user1") // Assuming user1 for demonstration
            .then((response) => response.json())
            .then((data) => {
                setPortfolio(data); // Assuming the backend returns an object with stock symbols as keys and quantities held as values
            })
            .catch((error) =>
                console.error("Error fetching portfolio:", error)
            );
    }, []);

    // Assuming the backend returns an object with stock symbols as keys and quantities held as values
    return (
        <div className="container">
            <h1>Stock Portfolio</h1>
            <table>
                <thead>
                    <tr>
                        <th>Stock Symbol</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(portfolio).map(([stock, quantity]) => (
                        <tr key={stock}>
                            <td>
                                <Link to={`/stockinfo/${stock}`}>{stock}</Link>
                            </td>
                            <td>{quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StockList;
