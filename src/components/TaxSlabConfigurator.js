// client/src/components/TaxSlabConfigurator.js

import React, { useState, useEffect } from 'react';

const TaxSlabConfigurator = () => {
    const [year, setYear] = useState(2024);
    const [slabs, setSlabs] = useState([{ start: '', end: '', rate: '' }]);
    const [message, setMessage] = useState('');

    // Load any saved slabs for this year from localStorage when the year changes
    useEffect(() => {
        const saved = localStorage.getItem(`taxSlabs_${year}`);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSlabs(parsed);
            } catch (err) {
                console.error("Error parsing saved slabs", err);
            }
        } else {
            setSlabs([{ start: '', end: '', rate: '' }]);
        }
    }, [year]);

    const handleSlabChange = (index, field, value) => {
        const newSlabs = [...slabs];
        newSlabs[index][field] = value;
        setSlabs(newSlabs);
    };

    const addSlab = () => {
        setSlabs([...slabs, { start: '', end: '', rate: '' }]);
    };

    const removeSlab = (index) => {
        const newSlabs = slabs.filter((_, i) => i !== index);
        setSlabs(newSlabs);
    };

    const handleSave = () => {
        // Validate and convert values:
        // For each slab, convert start and end to numbers (or null if empty) and convert rate from percentage to decimal.
        const validated = slabs.map(slab => ({
            start: parseFloat(slab.start),
            end: slab.end === '' ? null : parseFloat(slab.end),
            rate: parseFloat(slab.rate) / 100  // convert percent to decimal (e.g., 5 becomes 0.05)
        }));
        // Save to localStorage under the key "taxSlabs_{year}"
        localStorage.setItem(`taxSlabs_${year}`, JSON.stringify(validated));
        setMessage(`Tax slabs for year ${year} saved successfully.`);
    };

    return (
        <div>
            <h2>Tax Slab Configurator</h2>
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
            <h3>Define Tax Slabs</h3>
            <p>
                Enter the starting income, ending income (leave blank for no upper limit), and tax rate (in %).
                For example: 0 to 250000 – 0%.
            </p>
            {slabs.map((slab, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                    <label>
                        Slab {index + 1} Start:
                        <input
                            type="number"
                            value={slab.start}
                            onChange={(e) => handleSlabChange(index, 'start', e.target.value)}
                        />
                    </label>
                    <label style={{ marginLeft: '10px' }}>
                        End:
                        <input
                            type="number"
                            value={slab.end}
                            onChange={(e) => handleSlabChange(index, 'end', e.target.value)}
                            placeholder="No limit if empty"
                        />
                    </label>
                    <label style={{ marginLeft: '10px' }}>
                        Rate (%):
                        <input
                            type="number"
                            value={slab.rate}
                            onChange={(e) => handleSlabChange(index, 'rate', e.target.value)}
                        />
                    </label>
                    {slabs.length > 1 && (
                        <button onClick={() => removeSlab(index)} style={{ marginLeft: '10px' }}>
                            Remove
                        </button>
                    )}
                </div>
            ))}
            <button onClick={addSlab}>Add Slab</button>
            <br /><br />
            <button onClick={handleSave}>Save Tax Slabs</button>
            {message && <p style={{ color: 'green' }}>{message}</p>}
        </div>
    );
};

export default TaxSlabConfigurator;
