import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import StockList from "./components/StockList";
import StockInfo from "./components/StockInfo";

// Router component with two routes for StockList and StockInfo
function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<StockList />} />
                    <Route path="/stockinfo/:symbol" element={<StockInfo />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
