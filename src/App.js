// client/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TaxCalculator from './components/TaxCalculator';
import TaxSlabConfigurator from './components/TaxSlabConfigurator';

function App() {
    return (
        <Router>
            <div style={{ padding: '20px' }}>
                <h1>Income Tax Calculator</h1>
                <nav>
                    <ul style={{ display: 'flex', listStyle: 'none', gap: '20px' }}>
                        <li>
                            <Link to="/calculate">Calculate Tax</Link>
                        </li>
                        <li>
                            <Link to="/configure">Configure Tax Slabs</Link>
                        </li>
                    </ul>
                </nav>
                <hr />
                <Routes>
                    <Route path="/calculate" element={<TaxCalculator />} />
                    <Route path="/configure" element={<TaxSlabConfigurator />} />
                    <Route path="/" element={<TaxCalculator />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
