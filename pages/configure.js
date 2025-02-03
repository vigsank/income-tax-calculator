// client/pages/configure.js
import React from 'react';
import TaxSlabConfigurator from '../components/TaxSlabConfigurator';
import { Typography } from '@mui/material';

const ConfigurePage = () => {
    return (
        <>
            <Typography variant="h4" gutterBottom>
                Tax Slab Configurator
            </Typography>
            <TaxSlabConfigurator />
        </>
    );
};

export default ConfigurePage;
