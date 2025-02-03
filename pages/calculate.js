// client/pages/calculate.js
import React from 'react';
import TaxCalculator from '../components/TaxCalculator';
import { Typography } from '@mui/material';

const CalculatePage = () => {
    return (
        <>
            <Typography variant="h4" gutterBottom>
                Tax Calculator
            </Typography>
            <TaxCalculator />
        </>
    );
};

export default CalculatePage;
