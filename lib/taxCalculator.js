// client/lib/taxCalculator.js

import defaultTaxSlabs2024 from '../data/taxSlabs2024.json';
import defaultTaxSlabs2025 from '../data/taxSlabs2025.json';

/**
 * Calculates tax based on the provided parameters, incorporating marginal relief and 4% cess.
 *
 * - Taxable income is (CTC - ₹75,000 Standard Deduction).
 * - If taxable income ≤ ₹12,00,000, then tax is fully ZERO.
 * - If taxable income > ₹12,00,000 but ≤ ₹12,75,000, marginal relief is applied.
 * - If taxable income > ₹12,75,000, standard tax slabs apply.
 * - A 4% Health & Education Cess is applied on the final tax payable.
 *
 * @param {object} params - Calculation parameters.
 * @param {number} params.year - Tax year.
 * @param {number} params.fullCTC - Full cost-to-company.
 * @param {number} [params.hikePercent=0] - Optional hike percentage.
 * @param {Array} [params.customSlabs=null] - Optional array of tax slabs.
 *
 * @returns {object} Tax details including breakdown and post-tax incomes.
 */
export function calculateTaxGeneric({ year, fullCTC, hikePercent = 0, customSlabs = null }) {
    // Adjust full CTC based on hike percentage
    const newFullCTC = fullCTC * (1 + hikePercent / 100);

    // Apply ₹75,000 Standard Deduction
    const taxableIncome = Math.max(0, newFullCTC - 75000);

    // If taxable income (after ₹75,000 deduction) is ≤ ₹12,00,000, tax is fully ZERO
    if (taxableIncome <= 1200000) {
        return {
            year,
            newFullCTC,
            taxableIncome,
            tax: 0,
            cess: 0,
            totalTaxPayable: 0,
            breakdown: [],
            annualPreTax: taxableIncome,
            annualPostTax: taxableIncome, // Since tax is zero
            monthlyPreTax: taxableIncome / 12,
            monthlyPostTax: taxableIncome / 12
        };
    }

    // Determine tax slabs: Use custom slabs if provided; else fall back to defaults.
    let slabs;
    if (customSlabs && Array.isArray(customSlabs) && customSlabs.length > 0) {
        slabs = customSlabs.map((slab) => ({
            start: parseFloat(slab.start),
            end: slab.end === null || slab.end === '' ? null : parseFloat(slab.end),
            rate: parseFloat(slab.rate)
        }));
    } else if (parseInt(year) === 2024) {
        slabs = defaultTaxSlabs2024;
    } else if (parseInt(year) === 2025) {
        slabs = defaultTaxSlabs2025;
    } else {
        slabs = [];
    }

    // Calculate tax using slabs
    let tax = 0;
    let breakdown = [];
    slabs.forEach((slab, i) => {
        if (taxableIncome <= slab.start) return;
        const taxableForSlab =
            slab.end === null ? taxableIncome - slab.start : Math.min(taxableIncome, slab.end) - slab.start;
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

    let marginalRelief = 0;
    let taxBeforeMarginalRelief = tax;
    // Apply Marginal Relief if taxable income is between ₹12,00,000 and ₹12,75,000
    if (taxableIncome > 1200000 && taxableIncome <= 1275000) {
        const excessIncome = taxableIncome - 1200000; // Amount exceeding ₹12,00,000
        marginalRelief = tax - excessIncome;
        if (marginalRelief > 0) {
            tax -= marginalRelief; // Reduce tax by the marginal relief amount
        }
    }

    // Apply 4% Health & Education Cess
    const cess = tax * 0.04;
    const totalTaxPayable = tax + cess;

    return {
        year,
        newFullCTC,
        taxableIncome,
        taxBeforeMarginalRelief,
        tax,
        cess,
        totalTaxPayable,
        marginalRelief,
        breakdown,
        annualPreTax: taxableIncome,
        annualPostTax: taxableIncome - totalTaxPayable,
        monthlyPreTax: taxableIncome / 12,
        monthlyPostTax: (taxableIncome - totalTaxPayable) / 12
    };
}
