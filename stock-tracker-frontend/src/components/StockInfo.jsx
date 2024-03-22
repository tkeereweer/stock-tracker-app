import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import "./StockInfo.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function StockInfo() {
    const { symbol } = useParams();
    const navigate = useNavigate();
    const [stockInfo, setStockInfo] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "Close Price",
                data: [],
                backgroundColor: "rgba(53, 162, 235, 0.5)",
                borderColor: "rgba(53, 162, 235, 1)",
            },
        ],
    });
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
                if (data && Array.isArray(data)) {
                    const dates = data.map((item) => item[0]).reverse(); // This line is changed to reverse the order
                    const closePrices = data
                        .map((item) => Number(item[1]["4. close"]))
                        .reverse(); // Reverse the order of prices to match dates

                    setChartData({
                        labels: dates,
                        datasets: [
                            {
                                label: "Close Price",
                                data: closePrices,
                                backgroundColor: "rgba(53, 162, 235, 0.5)",
                                borderColor: "rgba(53, 162, 235, 1)",
                            },
                        ],
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching stock info:", error);
                setError(
                    "Failed to fetch stock information. Please try again later."
                );
            });
    }, [symbol]);

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
        <div>
            <div className="header">
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>
            <div className="container">
                <h1>Stock Information for {symbol}</h1>
                <Line data={chartData} key={chartData.labels.length} />
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
        </div>
    );
}

export default StockInfo;
