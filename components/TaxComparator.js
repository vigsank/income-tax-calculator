// client/components/TaxComparator.js
import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Card,
    CardContent,
    Grid
} from '@mui/material';
import defaultTaxSlabs2024 from '../data/taxSlabs2024.json';
import defaultTaxSlabs2025 from '../data/taxSlabs2025.json';

const TaxComparator = () => {
    // Input states for each year and full CTC (common)
    const [year1, setYear1] = useState(2024);
    const [hike1, setHike1] = useState(0);
    const [year2, setYear2] = useState(2025);
    const [hike2, setHike2] = useState(0);
    const [fullCTC, setFullCTC] = useState(100);
    const [result1, setResult1] = useState(null);
    const [result2, setResult2] = useState(null);
    const [error, setError] = useState('');

    // Helper to safely format numbers.
    const safeFixed = (num, digits = 2) => Number(num ?? 0).toFixed(digits);

    // Updated fetchTaxData explicitly passes default slabs for 2024/2025.
    const fetchTaxData = async (year, hike, ctc) => {
        let slabs = null;
        if (parseInt(year) === 2024) {
            slabs = defaultTaxSlabs2024;
        } else if (parseInt(year) === 2025) {
            slabs = defaultTaxSlabs2025;
        }
        try {
            const response = await fetch('/api/calculate-tax', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    year: parseInt(year),
                    fullCTC: parseFloat(ctc),
                    hikePercent: parseFloat(hike),
                    customSlabs: slabs
                })
            });
            const data = await response.json();
            if (response.ok) {
                return data;
            } else {
                throw new Error(data.error || 'Error calculating tax');
            }
        } catch (err) {
            throw err;
        }
    };

    const handleCompare = async () => {
        setError('');
        setResult1(null);
        setResult2(null);
        try {
            const data1 = await fetchTaxData(year1, hike1, fullCTC);
            const data2 = await fetchTaxData(year2, hike2, fullCTC);
            setResult1(data1);
            setResult2(data2);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Error connecting to server');
        }
    };

    // For fields where profit means lower value in Year 2, compute diff = Year1 - Year2.
    // For fields where profit means higher value in Year 2, compute diff = Year2 - Year1.
    const computeDiff = (key, val1, val2) => {
        let diff;
        if (key === 'tax') {
            // If Year2 tax is lower, then that's beneficial (profit).
            diff = val1 - val2;
        } else if (key === 'annualPostTax' || key === 'monthlyPostTax') {
            // Higher take-home is beneficial.
            diff = val2 - val1;
        } else {
            // For other fields, use Year2 - Year1.
            diff = val2 - val1;
        }
        return diff;
    };

    // Determine if a field is one for which we want to apply profit/loss styling.
    const isProfitField = (key) => {
        return key === 'tax' || key === 'annualPostTax' || key === 'monthlyPostTax';
    };

    // Define the fields to compare.
    const fields = [
        { key: 'newFullCTC', label: 'New Full CTC' },
        { key: 'fixedPay', label: 'Fixed Pay' },
        { key: 'taxableIncome', label: 'Taxable Income' },
        { key: 'tax', label: 'Total Tax' },
        { key: 'annualPreTax', label: 'Annual Pre-Tax Income' },
        { key: 'annualPostTax', label: 'Annual Post-Tax Income' },
        { key: 'monthlyPreTax', label: 'Monthly Pre-Tax Income' },
        { key: 'monthlyPostTax', label: 'Monthly Post-Tax Income' }
    ];

    return (
        <Box>
            {/* Input Form in a Grid for better spacing */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={3}>
                    <TextField
                        label="Year 1"
                        type="number"
                        value={year1}
                        onChange={(e) => setYear1(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        label="Hike % for Year 1"
                        type="number"
                        value={hike1}
                        onChange={(e) => setHike1(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        label="Year 2"
                        type="number"
                        value={year2}
                        onChange={(e) => setYear2(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        label="Hike % for Year 2"
                        type="number"
                        value={hike2}
                        onChange={(e) => setHike2(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Full CTC (in INR)"
                        type="number"
                        value={fullCTC}
                        onChange={(e) => setFullCTC(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button variant="contained" onClick={handleCompare} fullWidth>
                        Compare Taxes
                    </Button>
                </Grid>
            </Grid>
            {error && <Alert severity="error">{error}</Alert>}
            {result1 && result2 && (
                <Card sx={{ mt: 4 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Comparison Results
                        </Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Field</TableCell>
                                    <TableCell align="right">Year {year1}</TableCell>
                                    <TableCell align="right">Year {year2}</TableCell>
                                    <TableCell align="right">Difference</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fields.map((field) => {
                                    const val1 = result1[field.key];
                                    const val2 = result2[field.key];
                                    const diff = computeDiff(field.key, val1, val2);
                                    const diffStyle = isProfitField(field.key)
                                        ? {
                                            fontWeight: 'bold',
                                            color: diff > 0 ? 'green' : diff < 0 ? 'red' : 'inherit'
                                        }
                                        : {};
                                    return (
                                        <TableRow key={field.key}>
                                            <TableCell>{field.label}</TableCell>
                                            <TableCell align="right">₹{safeFixed(val1)}</TableCell>
                                            <TableCell align="right">₹{safeFixed(val2)}</TableCell>
                                            <TableCell align="right">
                                                <span style={diffStyle}>₹{safeFixed(diff)}</span>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default TaxComparator;
