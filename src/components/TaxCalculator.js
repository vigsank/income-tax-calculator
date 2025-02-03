// client/src/components/TaxCalculator.js

import React, { useState, useEffect } from 'react';

const TaxCalculator = () => {
    const [year, setYear] = useState(2024);
    const [fullCTC, setFullCTC] = useState(1000);
    const [hikePercent, setHikePercent] = useState(0);
    const [customSlabs, setCustomSlabs] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    // Load custom slabs for the selected year from localStorage (if any)
    useEffect(() => {
        const saved = localStorage.getItem(`taxSlabs_${year}`);
        if (saved) {
            try {
                const slabs = JSON.parse(saved);
                setCustomSlabs(slabs);
            } catch (err) {
                console.error("Error parsing saved slabs", err);
            }
        } else {
            setCustomSlabs(null);
        }
    }, [year]);

    const handleCalculate = async () => {
        setError('');
        try {
            const response = await fetch('/api/calculate-tax', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    year: parseInt(year),
                    fullCTC: parseFloat(fullCTC),
                    hikePercent: parseFloat(hikePercent),
                    customSlabs: customSlabs
                })
            });
            const data = await response.json();
            if (response.ok) {
                setResult(data);
            } else {
                setError(data.error || 'Error calculating tax');
            }
        } catch (err) {
            console.error(err);
            setError('Error connecting to server');
        }
    };

    return (
        <div>
            <h2>Tax Calculator</h2>
            <div>
                <label>
                    Year:
                    <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Full CTC (in INR):
                    <input
                        type="number"
                        value={fullCTC}
                        onChange={(e) => setFullCTC(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Hike Percentage (if any):
                    <input
                        type="number"
                        value={hikePercent}
                        onChange={(e) => setHikePercent(e.target.value)}
                    />
                </label>
            </div>
            {customSlabs && (
                <div>
                    <p>
                        Using custom tax slabs for year {year} (from localStorage):
                    </p>
                    <ul>
                        {customSlabs.map((slab, index) => (
                            <li key={index}>
                                Slab {index + 1}: From {slab.start} to {slab.end === null ? '∞' : slab.end}, Rate: {(parseFloat(slab.rate)*100).toFixed(2)}%
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <button onClick={handleCalculate}>Calculate Tax</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {result && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Results for Year {result.year}</h3>
                    <p><strong>New Full CTC:</strong> ₹{result.newFullCTC.toFixed(2)}</p>
                    <p><strong>Fixed Pay (88% of New Full CTC):</strong> ₹{result.fixedPay.toFixed(2)}</p>
                    <p>
                        <strong>Taxable Income (Fixed Pay - Standard Deduction ₹75,000):</strong> ₹{result.taxableIncome.toFixed(2)}
                    </p>
                    <p><strong>Total Tax:</strong> ₹{result.tax.toFixed(2)}</p>
                    <h4>Tax Breakdown:</h4>
                    <ul>
                        {result.breakdown.map((item, index) => (
                            <li key={index}>
                                Slab {item.slab} ({item.range}): Taxable Amount ₹{item.taxable.toFixed(2)} at {(item.rate * 100).toFixed(2)}% = ₹{item.tax.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                    <h4>Income Breakdown:</h4>
                    <p><strong>Annual Pre-Tax Income:</strong> ₹{result.annualPreTax.toFixed(2)}</p>
                    <p><strong>Annual Post-Tax Income:</strong> ₹{result.annualPostTax.toFixed(2)}</p>
                    <p><strong>Monthly Pre-Tax Income:</strong> ₹{result.monthlyPreTax.toFixed(2)}</p>
                    <p><strong>Monthly Post-Tax Income:</strong> ₹{result.monthlyPostTax.toFixed(2)}</p>
                </div>
            )}
        </div>
    );
};

export default TaxCalculator;
