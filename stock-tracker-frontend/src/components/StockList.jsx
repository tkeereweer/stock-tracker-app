import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./StockList.css";

function StockList() {
    const [portfolio, setPortfolio] = useState([]);

    useEffect(() => {
        fetch("https://mcsbt-integration-415614.oa.r.appspot.com/user1") // Assuming user1 for demonstration
            .then((response) => response.json())
            .then((data) => {
                setPortfolio(data); // Update this line to handle the new data structure
            })
            .catch((error) =>
                console.error("Error fetching portfolio:", error)
            );
    }, []);

    // Extract total value if it exists
    const totalValue = portfolio.length > 0 ? portfolio[0].total_value : 0;

    return (
        <div className="container">
            <h1>Stock Portfolio</h1>
            <table>
                <thead>
                    <tr>
                        <th>Stock Symbol</th>
                        <th>Quantity</th>
                        <th>Value</th> {/* New column for value */}
                    </tr>
                </thead>
                <tbody>
                    {portfolio.slice(1).map((item, index) => {
                        const stock = Object.keys(item)[0];
                        const details = item[stock];
                        return (
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
                        );
                    })}
                </tbody>
            </table>
            {/* Displaying total portfolio value */}
            <p>Total Portfolio Value: ${totalValue}</p>
        </div>
    );
}

export default StockList;
