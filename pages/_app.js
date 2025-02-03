// client/pages/_app.js
import React from 'react';
import Head from 'next/head';
import { CssBaseline, Container } from '@mui/material';
import NavigationBar from '../components/NavigationBar';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Income Tax Calculator</title>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <CssBaseline />
            <SpeedInsights/>
            <SpeedInsights />
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <NavigationBar />
                <Component {...pageProps} />
            </Container>
        </>
    );
}
