import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./StockInfo.css";

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function StockInfo() {
    const { symbol } = useParams();
    const [stockInfo, setStockInfo] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(
            `https://mcsbt-integration-415614.oa.r.appspot.com/stockinfo/${symbol}`
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setStockInfo(data);
            })
            .catch((error) => {
                console.error("Error fetching stock info:", error);
                setError(
                    "Failed to fetch stock information. Please try again later."
                );
            });
    }, [symbol]);

    if (error) {
        return <div className="container">{error}</div>;
    }

    return (
        <div className="container">
            <h1>Stock Information for {symbol}</h1>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Open</th>
                        <th>High</th>
                        <th>Low</th>
                        <th>Close</th>
                        <th>Volume</th>
                    </tr>
                </thead>
                <tbody>
                    {stockInfo.map((day, index) => (
                        <tr key={index}>
                            <td>{day[0]}</td>
                            <td>
                                {numberWithCommas(
                                    Number(day[1]["1. open"]).toFixed(2)
                                )}
                            </td>
                            <td>
                                {numberWithCommas(
                                    Number(day[1]["2. high"]).toFixed(2)
                                )}
                            </td>
                            <td>
                                {numberWithCommas(
                                    Number(day[1]["3. low"]).toFixed(2)
                                )}
                            </td>
                            <td>
                                {numberWithCommas(
                                    Number(day[1]["4. close"]).toFixed(2)
                                )}
                            </td>
                            <td>{numberWithCommas(day[1]["5. volume"])}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StockInfo;
