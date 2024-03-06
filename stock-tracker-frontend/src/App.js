import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import StockList from "./components/StockList";
import StockInfo from "./components/StockInfo";

// Header component to display the application name
function Header() {
    return (
        <header>
            <h1>DebuggingDollars</h1>
        </header>
    );
}

// Router component with two routes for StockList and StockInfo
function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/" element={<StockList />} />
                    <Route path="/stockinfo/:symbol" element={<StockInfo />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
