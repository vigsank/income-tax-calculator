// client/components/TaxCalculator.js
import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Card,
    CardContent,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import defaultTaxSlabs2024 from '../data/taxSlabs2024.json';
import defaultTaxSlabs2025 from '../data/taxSlabs2025.json';

const TaxCalculator = () => {
    const [year, setYear] = useState(2024);
    const [fullCTC, setFullCTC] = useState(3150000);
    const [hikePercent, setHikePercent] = useState(0);
    const [customSlabs, setCustomSlabs] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [cache, setCache] = useState({});

    // For 2024/2025, always use defaults (or session modifications) without using localStorage.
    useEffect(() => {
        if (year === 2024 || year === 2025) {
            setCustomSlabs(null);
        } else {
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
        }
    }, [year]);

    // Merge defaults with any custom modifications for 2024/2025.
    const getMergedSlabs = () => {
        const defaults = year === 2024 ? defaultTaxSlabs2024 : defaultTaxSlabs2025;
        if (!customSlabs || customSlabs.length === 0) {
            return defaults;
        }
        return defaults.map((def, i) => {
            if (i < customSlabs.length && customSlabs[i].start != null && customSlabs[i].rate != null) {
                return {
                    start: customSlabs[i].start || def.start,
                    end:
                        customSlabs[i].end === undefined ||
                        customSlabs[i].end === '' ||
                        customSlabs[i].end === null
                            ? def.end
                            : customSlabs[i].end,
                    rate: customSlabs[i].rate
                };
            }
            return def;
        });
    };

    // Compute current input signature.
    const currentSignature = JSON.stringify({
        year,
        fullCTC,
        hikePercent,
        slabs: year === 2024 || year === 2025 ? getMergedSlabs() : customSlabs
    });

    // When input signature changes, update the result from cache if available; otherwise, clear result.
    useEffect(() => {
        if (cache[currentSignature]) {
            setResult(cache[currentSignature]);
        } else {
            setResult(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSignature]);

    const handleCalculate = async () => {
        setError('');
        if (cache[currentSignature]) {
            setResult(cache[currentSignature]);
            return;
        }
        try {
            const slabsToSend =
                year === 2024 || year === 2025 ? getMergedSlabs() : customSlabs;
            const response = await fetch('/api/calculate-tax', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    year: parseInt(year),
                    fullCTC: parseFloat(fullCTC),
                    hikePercent: parseFloat(hikePercent),
                    customSlabs: slabsToSend
                })
            });
            const data = await response.json();
            if (response.ok) {
                setCache(prev => ({ ...prev, [currentSignature]: data }));
                setResult(data);
            } else {
                setError(data.error || 'Error calculating tax');
            }
        } catch (err) {
            console.error(err);
            setError('Error connecting to server');
        }
    };

    // Helper to safely format numbers.
    const safeFixed = (num, digits = 2) => Number(num ?? 0).toFixed(digits);

    return (
        <Box>
            {/* Input Form */}
            <Box sx={{ mb: 2 }}>
                <TextField
                    label="Year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    sx={{ mr: 2 }}
                />
                <TextField
                    label="Full CTC (in INR)"
                    type="number"
                    value={fullCTC}
                    onChange={(e) => setFullCTC(e.target.value)}
                    sx={{ mr: 2 }}
                />
                <TextField
                    label="Hike Percentage"
                    type="number"
                    value={hikePercent}
                    onChange={(e) => setHikePercent(e.target.value)}
                    sx={{ mr: 2 }}
                />
                <Button variant="contained" onClick={handleCalculate}>
                    Calculate Tax
                </Button>
            </Box>
            {error && <Alert severity="error">{error}</Alert>}

            {/* Results Section */}
            {result && (
                <Card sx={{ mt: 4 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Results for Year {result.year}
                        </Typography>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={6}>
                                <Typography>
                                    <strong>New Full CTC:</strong> ₹{safeFixed(result.newFullCTC)}
                                </Typography>
                                <Typography>
                                    <strong>Fixed Pay:</strong> ₹{safeFixed(result.fixedPay)}
                                </Typography>
                                <Typography>
                                    <strong>Taxable Income:</strong> ₹{safeFixed(result.taxableIncome)}
                                </Typography>
                                <Typography>
                                    <strong>Total Tax:</strong> ₹{safeFixed(result.tax)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>
                                    <strong>Annual Pre-Tax Income:</strong> ₹{safeFixed(result.annualPreTax)}
                                </Typography>
                                <Typography>
                                    <strong>Annual Post-Tax Income:</strong> ₹{safeFixed(result.annualPostTax)}
                                </Typography>
                                <Typography>
                                    <strong>Monthly Pre-Tax Income:</strong> ₹{safeFixed(result.monthlyPreTax)}
                                </Typography>
                                <Typography>
                                    <strong>Monthly Post-Tax Income:</strong> ₹{safeFixed(result.monthlyPostTax)}
                                </Typography>
                            </Grid>
                        </Grid>
                        {/* Tax Breakdown Accordion */}
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="subtitle1">Tax Breakdown</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Slab</TableCell>
                                            <TableCell>Range</TableCell>
                                            <TableCell align="right">Taxable Amount (₹)</TableCell>
                                            <TableCell align="right">Rate (%)</TableCell>
                                            <TableCell align="right">Tax (₹)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {result.breakdown.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.slab}</TableCell>
                                                <TableCell>{item.range}</TableCell>
                                                <TableCell align="right">{safeFixed(item.taxable)}</TableCell>
                                                <TableCell align="right">{safeFixed(item.rate * 100)}</TableCell>
                                                <TableCell align="right">{safeFixed(item.tax)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </AccordionDetails>
                        </Accordion>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default TaxCalculator;
