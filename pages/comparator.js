// client/pages/comparator.js
import React from 'react';
import TaxComparator from '../components/TaxComparator';
import { Typography } from '@mui/material';

const ComparatorPage = () => {
    return (
        <>
            <Typography variant="h4" gutterBottom>
                Tax Comparator
            </Typography>
            <TaxComparator />
        </>
    );
};

export default ComparatorPage;
