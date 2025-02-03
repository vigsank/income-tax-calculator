// client/lib/taxCalculator.js

import defaultTaxSlabs2024 from '../data/taxSlabs2024.json';
import defaultTaxSlabs2025 from '../data/taxSlabs2025.json';

/**
 * Calculate tax based on provided parameters.
 *
 * @param {object} params - Parameters for calculation.
 * @param {number} params.year - Tax year.
 * @param {number} params.fullCTC - Full cost-to-company.
 * @param {number} [params.hikePercent=0] - Optional hike percentage.
 * @param {Array} [params.customSlabs=null] - Optional custom slabs. Each slab should have "start", "end", and "rate".
 * @returns {object} Calculation result including tax, breakdown, and income figures.
 */
export function calculateTaxGeneric({ year, fullCTC, hikePercent = 0, customSlabs = null }) {
    const newFullCTC = fullCTC * (1 + hikePercent / 100);
    const fixedPay = newFullCTC * 0.88;
    const taxableIncome = Math.max(0, fixedPay - 75000);

    let slabs;

    if (customSlabs && Array.isArray(customSlabs) && customSlabs.length > 0) {
        slabs = customSlabs.map(slab => ({
            start: parseFloat(slab.start),
            end: slab.end === null || slab.end === '' ? null : parseFloat(slab.end),
            rate: parseFloat(slab.rate)
        }));
    } else if (parseInt(year) === 2024) {
        slabs = defaultTaxSlabs2024;
    } else if (parseInt(year) === 2025) {
        slabs = defaultTaxSlabs2025;
    } else {
        // For years other than 2024/2025, no default slabs are defined.
        // You can change this behavior as needed (for example, throw an error).
        slabs = [];
    }

    const applySlabs = (income, slabs) => {
        let tax = 0;
        let breakdown = [];
        slabs.forEach((slab, i) => {
            // If the income is less than the slab start, nothing to tax here.
            if (income <= slab.start) return;
            // Calculate taxable amount within this slab.
            const taxableForSlab = slab.end === null ? income - slab.start : Math.min(income, slab.end) - slab.start;
            const slabTax = taxableForSlab * slab.rate;
            breakdown.push({
                slab: i + 1,
                range: `${slab.start} to ${slab.end === null ? '∞' : slab.end}`,
                taxable: taxableForSlab,
                rate: slab.rate,
                tax: slabTax
            });
            tax += slabTax;
        });
        return { tax, breakdown };
    };

    const { tax, breakdown } = applySlabs(taxableIncome, slabs);

    return {
        year,
        newFullCTC,
        fixedPay,
        taxableIncome,
        tax,
        breakdown,
        annualPreTax: fixedPay,
        annualPostTax: fixedPay - tax,
        monthlyPreTax: fixedPay / 12,
        monthlyPostTax: (fixedPay - tax) / 12
    };
}
