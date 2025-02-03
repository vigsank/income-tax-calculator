# Income Tax Calculator Tool

A full-featured, Next.js-based application designed to help you calculate your income tax under the new Indian tax regime. This tool provides three main features:

- **Tax Calculator:**  
  Calculate your tax payable based on your full cost-to-company (CTC) salary, an optional hike percentage, and customizable tax slabs. The calculator displays detailed results, including the adjusted salary figures, tax payable, and a breakdown of tax by slab. It also shows both annual and monthly pre- and post-tax incomes.

- **Tax Slab Configurator:**  
  View and customize tax slab ranges and rates. For the years 2024 and 2025, the tool comes pre-loaded with government-defined default slabs (sourced from JSON files in the `data` folder). Users can adjust these defaults temporarily in the configurator (session-only), while for any other year, custom slabs are saved to local storage so that your configurations persist between sessions.

- **Tax Comparator:**  
  Compare tax calculations for two different years side-by-side. Enter two tax years (e.g., 2024 and 2025), a common full CTC, and individual hike percentages. The tool displays key figures for both years in a comparison table and computes the differences. For instance, if Year 2’s tax payable is lower than Year 1’s, the difference is highlighted in bold green; if higher, in bold red. Similarly, differences in take-home salaries (both monthly and annual) are computed and color-coded based on whether they represent an increase (green) or decrease (red).

## Features & Customizations

- **Dynamic Tax Calculations:**
    - Input your full CTC, an optional hike percentage, and your chosen tax slab configuration.
    - The tool automatically computes your adjusted salary, fixed pay (88% of adjusted CTC), taxable income (after subtracting a ₹75,000 standard deduction), and your total tax payable.
    - A detailed breakdown shows how much tax is applied in each slab.

- **Customizable Tax Slabs:**
    - For 2024 and 2025, default slabs are pre-loaded from JSON files in the `data` folder:
        - **2024 Defaults:**
            - Up to ₹3,00,000: Nil
            - ₹3,00,001 to ₹7,00,000: 5%
            - ₹7,00,001 to ₹10,00,000: 10%
            - ₹10,00,001 to ₹12,00,000: 15%
            - ₹12,00,001 to ₹15,00,000: 20%
            - Above ₹15,00,000: 30%
        - **2025 Defaults:**
            - Up to ₹4,00,000: Nil
            - ₹4,00,001 to ₹8,00,000: 5%
            - ₹8,00,001 to ₹12,00,000: 10%
            - ₹12,00,001 to ₹16,00,000: 15%
            - ₹16,00,001 to ₹20,00,000: 20%
            - ₹20,00,001 to ₹24,00,000: 25%
            - Above ₹24,00,000: 30%
    - Users can temporarily adjust these defaults via the Tax Slab Configurator (session-only for 2024/2025). For other years, custom slab configurations are saved to local storage.

- **Tax Comparison:**
    - Compare tax outcomes for two different years by inputting two separate years along with their respective hike percentages.
    - The comparison view displays key figures such as New Full CTC, Fixed Pay, Taxable Income, Total Tax, and take-home incomes, side-by-side.
    - The tool calculates the difference for each field. For tax payable, a lower value in Year 2 is shown as a benefit (green); for take-home salary, a higher value in Year 2 is shown in green, while adverse differences are shown in red.

- **User-Friendly Interface:**
    - Built using Next.js and Material UI, the application features a responsive design, a top navigation bar with active tab highlighting, and polished UI components such as Cards, Tables, Grids, and Accordions.
    - Real-time calculations and caching ensure a smooth and interactive user experience.

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later recommended)
- npm (or yarn)

### Steps to Run Locally

1. **Clone the Repository:**

   ```bash
   git clone <repository-url>
   cd <repository-folder>/client
   ```
2.	Install Dependencies:

    ```bash
    npm install
    ```

3.	Run the Development Server:

    ```bash
    npm run dev
    ```

Open http://localhost:3000 in your browser. The home page will automatically redirect to the Tax Calculator page.

## Deployment

This project is designed to be deployed as a unified Next.js application, which includes both the frontend and backend API routes. For a hassle-free deployment, consider using Vercel.

Deploying to Vercel
1.	Install the Vercel CLI (if needed):

      ```bash
      npm install -g vercel 
      ```

2. Login
    ```bash
    vercel login 
    ```

3.	Deploy:
At root folder, run
      ```bash
      vercel 
      ```
Follow the prompts to deploy your application. For production deployments, use:

   ```shell
   vercel --prod
   ```

## License

This project is licensed under the MIT License.



