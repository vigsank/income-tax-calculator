// client/components/NavigationBar.js
import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { useRouter } from 'next/router';

const NavigationBar = () => {
    const router = useRouter();
    const currentPath = router.pathname;

    const handleChange = (event, newValue) => {
        router.push(newValue);
    };

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={currentPath} onChange={handleChange}>
                <Tab label="Tax Calculator" value="/calculate" />
                <Tab label="Tax Slab Configurator" value="/configure" />
                <Tab label="Tax Comparator" value="/comparator" />
            </Tabs>
        </Box>
    );
};

export default NavigationBar;
