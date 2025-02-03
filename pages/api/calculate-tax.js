// client/pages/api/calculate-tax.js

import { calculateTaxGeneric } from '../../lib/taxCalculator';

export default function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { year, fullCTC, hikePercent, customSlabs } = req.body;

    if (!year || !fullCTC || isNaN(fullCTC)) {
        res.status(400).json({ error: 'Year and fullCTC must be provided and valid.' });
        return;
    }

    try {
        const result = calculateTaxGeneric({
            year: parseInt(year),
            fullCTC: parseFloat(fullCTC),
            hikePercent: parseFloat(hikePercent) || 0,
            customSlabs: customSlabs || null
        });
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error calculating tax.' });
    }
}
