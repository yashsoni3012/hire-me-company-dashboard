# JobPortal — Admin Dashboard (Materio-style)

A fully responsive React + Tailwind CSS admin dashboard for a job portal platform, modeled after the **Materio** admin template (https://themewagon.github.io/materio/), re-themed for recruitment data with a violet/purple brand palette.

## Tech Stack
- React 18 (hooks only, no class components)
- React Router v6
- Tailwind CSS (pure utility classes, no UI library)
- React Icons (`react-icons/tb` — Tabler set)
- Vite

## Getting Started

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

To build for production:
```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx           # Nav sidebar with gradient active-pill (Materio style)
│   │   ├── Header.jsx            # Top header: search pill, theme toggle, bell, avatar
│   │   ├── NotificationPanel.jsx # Slide-in notification drawer
│   │   └── DashboardLayout.jsx   # Wraps Sidebar + Header + <Outlet/>
│   ├── ui/
│   │   ├── Avatar.jsx
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   └── Card.jsx              # Card, CardHeader, IconChip
│   └── dashboard/
│       ├── WelcomeCard.jsx       # "Congratulations" hero banner
│       ├── StatisticsCard.jsx    # 4-icon stat row
│       ├── WeeklyOverview.jsx    # Big percent + CTA card
│       ├── TotalHires.jsx        # Earnings-style breakdown w/ progress bars
│       ├── MiniStatGrid.jsx      # 2x2 grid of small stat cards
│       ├── LocationsCard.jsx     # "Sales by Countries" equivalent
│       ├── ListCard.jsx          # Reusable Deposit/Withdraw-style list
│       └── JobsTable.jsx         # Bottom data table widget
├── data/
│   └── staticData.js             # All static/demo data lives here
├── pages/
│   ├── Dashboard.jsx             # Assembles all dashboard widgets in Materio's grid
│   ├── JobListings.jsx           # Full searchable/filterable jobs table
│   ├── Candidates.jsx            # Full searchable/filterable candidates table
│   ├── Messages.jsx              # Two-panel chat UI
│   └── Placeholder.jsx           # Generic "coming soon" page
├── App.jsx                       # Route definitions
├── main.jsx                      # Entry point
└── index.css                     # Tailwind directives + global styles
```

## Theming — Global Brand Color

All brand colors are defined in `tailwind.config.js` under `theme.extend.colors`:

```js
brand: {
  500: '#8C57FF', // ← Materio violet — change this to re-theme everything
  ...
},
success: { 500: '#56CA00' },
info:    { 500: '#16B1FF' },
warn:    { 500: '#FFB400' },
danger:  { 500: '#FF4C51' },
```

Every component references these tokens (`brand-50` … `brand-900`, `success-500`, etc.) instead of hardcoded hex values, so the whole UI re-themes from this one file.

## Dashboard Layout (matches Materio's structure)

| Materio section | JobPortal equivalent |
|---|---|
| Congratulations John! card | Welcome / Congratulations Admin card |
| Statistics Card (Sales/Customers/Products/Revenue) | Jobs Posted / Candidates / Companies / Revenue |
| Weekly Overview | Weekly Overview (hiring performance %) |
| Total Earning + company logos | Total Hires + company breakdown with progress bars |
| Total Profit / Refunds / New Project / Sales Queries | Total Placements / Withdrawn Jobs / New Job Posts / Support Queries |
| Sales by Countries | Candidates by Location |
| Deposit / Withdraw lists | New Applications / Closed Jobs |
| Employee data table | Job Listings table |

## Pages Included
- **Dashboard** — full Materio-style widget grid
- **Job Listings** — searchable/filterable table with CRUD action buttons
- **Candidates** — searchable/filterable candidate table
- **Messages** — two-panel chat UI (conversation list + thread)
- **Companies / Applications / Interviews / Settings / Reports** — placeholder pages ready to build out

## Responsive Behavior
- Sidebar collapses off-canvas below `lg` breakpoint, toggled via hamburger menu with backdrop overlay
- Dashboard grid reflows: 3-column → 2-column → 1-column stacking on smaller screens
- Tables scroll horizontally on small screens
- Messages page hides the conversation list on mobile (single-column chat view)

## Next Steps (suggested)
- Replace static data in `src/data/staticData.js` with API calls (Axios + your `setAuthToken` utility)
- Add protected routes / JWT auth wrapper around `DashboardLayout`
- Wire up the unified login flow before this dashboard route
