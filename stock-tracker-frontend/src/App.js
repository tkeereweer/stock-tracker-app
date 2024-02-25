import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StockList from "./components/StockList";
import StockInfo from "./components/StockInfo";

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
