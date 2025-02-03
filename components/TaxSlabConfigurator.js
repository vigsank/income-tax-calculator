// client/components/TaxSlabConfigurator.js
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert, Grid } from '@mui/material';
import defaultTaxSlabs2024 from '../data/taxSlabs2024.json';
import defaultTaxSlabs2025 from '../data/taxSlabs2025.json';

const TaxSlabConfigurator = () => {
    const [year, setYear] = useState(2024);
    const [slabs, setSlabs] = useState([{ start: '', end: '', rate: '' }]);
    const [message, setMessage] = useState('');

    // For 2024/2025, load defaults from JSON; otherwise, load from localStorage.
    useEffect(() => {
        if (year === 2024 || year === 2025) {
            const defaults = year === 2024 ? defaultTaxSlabs2024 : defaultTaxSlabs2025;
            setSlabs(defaults);
        } else {
            const saved = localStorage.getItem(`taxSlabs_${year}`);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setSlabs(parsed);
                } catch (err) {
                    console.error("Error parsing saved slabs", err);
                    setSlabs([{ start: '', end: '', rate: '' }]);
                }
            } else {
                setSlabs([{ start: '', end: '', rate: '' }]);
            }
        }
    }, [year]);

    const handleSlabChange = (index, field, value) => {
        const newSlabs = [...slabs];
        newSlabs[index] = { ...newSlabs[index], [field]: value };
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
        const validated = slabs.map(slab => ({
            start: parseFloat(slab.start),
            end: slab.end === '' ? null : parseFloat(slab.end),
            rate: parseFloat(slab.rate) / 100
        }));
        if (year === 2024 || year === 2025) {
            // For these years, update session state only.
            setSlabs(validated);
            setMessage(`Tax slabs for year ${year} updated (session only). Refresh to reload defaults.`);
        } else {
            localStorage.setItem(`taxSlabs_${year}`, JSON.stringify(validated));
            setMessage(`Tax slabs for year ${year} saved successfully.`);
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 2 }}>
                <TextField
                    label="Year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    sx={{ mr: 2 }}
                />
            </Box>
            <Typography variant="h6" gutterBottom>
                Define Tax Slabs
            </Typography>
            <Typography variant="body2" gutterBottom>
                Enter the starting income, ending income (leave blank for no upper limit), and tax rate (in %).
            </Typography>
            {slabs.map((slab, index) => (
                <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs={3}>
                        <TextField
                            label={`Slab ${index + 1} Start`}
                            type="number"
                            value={slab.start}
                            onChange={(e) => handleSlabChange(index, 'start', e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="End"
                            type="number"
                            value={slab.end === null ? '' : slab.end}
                            onChange={(e) => handleSlabChange(index, 'end', e.target.value)}
                            placeholder="No limit if empty"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Rate (%)"
                            type="number"
                            value={slab.rate ? slab.rate * 100 : ''}
                            onChange={(e) => handleSlabChange(index, 'rate', e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={3}>
                        {slabs.length > 1 && (
                            <Button variant="outlined" color="error" onClick={() => removeSlab(index)}>
                                Remove
                            </Button>
                        )}
                    </Grid>
                </Grid>
            ))}
            <Box sx={{ mb: 2 }}>
                <Button variant="outlined" onClick={addSlab}>
                    Add Slab
                </Button>
            </Box>
            <Button variant="contained" onClick={handleSave}>
                Save Tax Slabs
            </Button>
            {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
        </Box>
    );
};

export default TaxSlabConfigurator;
