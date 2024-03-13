import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import StockList from "./components/StockList";
import StockInfo from "./components/StockInfo";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";

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
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/stocklist" element={<StockList />} />
                    <Route path="/stockinfo/:symbol" element={<StockInfo />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
