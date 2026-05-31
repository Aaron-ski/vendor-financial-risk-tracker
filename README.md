# Vendor Financial Health Risk Tracker

A local-first React demo for monitoring basic vendor financial health risk. It helps a small or mid-sized business review vendor records, understand a transparent health score, and focus follow-up on relationships that need attention.

## Problem This Solves

Vendor financial issues can disrupt operations, but smaller teams may not have a dedicated risk platform. This MVP demonstrates a practical workflow for organizing basic indicators and turning them into a consistent review queue.

## Features

- Dashboard summary cards and risk distribution chart
- Searchable, filterable, sortable vendor watchlist
- Vendor detail view with score trend, deductions, and recommended actions
- Add, edit, and delete vendor records in browser localStorage
- CSV import and export for local follow-up work
- Reset button that restores eight seeded mock vendors
- Responsive layout for laptop and phone screens

## Important Scope Boundaries

This is a portfolio demo, not a production vendor-risk platform. It has no authentication, backend server, database, paid API, cloud data sync, or real operational vendor data. Use mock or approved non-sensitive data only. It is not financial, legal, or compliance advice.

## Tech Stack

- React 18
- TypeScript
- Vite
- Plain CSS and inline SVG charts
- Browser localStorage

## Local Setup

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production build:

```bash
npm run build
npm run preview
```

Run the scoring checks with:

```bash
npm run test:scoring
```

## How Scoring Works

Every vendor starts at `100`. Higher scores indicate a healthier profile.

| Indicator | Score adjustment |
| --- | ---: |
| Declining revenue | -20 |
| Stable revenue | -8 |
| Debt ratio above 65% | -15 |
| Debt ratio from 45% to 65% | -8 |
| Payment delays in past year | -5 each, capped at -25 |
| Less than 2 years in business | -10 |
| Annual revenue below $500,000 | -5 |

Risk categories:

- `Low Risk`: 80-100
- `Moderate Risk`: 60-79
- `High Risk`: 0-59

The business rules live in `src/utils/scoring.ts` so they are easy to review and modify.

## CSV Format

Export the current watchlist to get a ready-to-import template. Imported files replace the current browser watchlist after validation. Required headers are:

```text
vendorName,industry,location,annualRevenue,yearsInBusiness,employeeCount,debtRatio,paymentDelaysPastYear,revenueTrend,criticality,lastReviewed
```

## Deploy To GitHub Pages

The included `.github/workflows/deploy.yml` workflow builds and deploys the static app when changes land on `main` or `master`.

1. Push the repository to GitHub.
2. In the repository settings, open **Pages**.
3. Under **Build and deployment**, select **GitHub Actions** as the source.
4. Push to `main` or `master`, or run the workflow manually from the **Actions** tab.

Vite uses a relative base path, so the build works from a GitHub Pages project URL without hard-coding the repository name.

## Future Roadmap

- Add configurable scoring thresholds
- Support review notes and follow-up owners
- Add CSV merge options and import preview
- Connect an approved financial-data source through `src/services/financialDataService.ts`
- Add user accounts, access controls, and a real database only if moving beyond the demo stage
