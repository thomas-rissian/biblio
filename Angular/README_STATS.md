# Stats Page (Angular)

This file summarizes the Stats page scaffolding, dependencies and usage instructions.

## Libraries used / recommended
- Charts: Apache ECharts (via `ngx-echarts`) — performant and flexible
	(Network/Graph was removed from the UI and codebase per request.)

## How to install dependencies
From `Angular/` directory run:

```powershell
npm install echarts ngx-echarts --save
<!-- Network/Graph guidance was removed since the feature was retired. -->
```

## New components & route
- `pages/statistique/statistique` — Stats page
- `components/chart-card` — Reusable card wrapper
- `components/echart` — Generic ECharts wrapper (placeholder if ngx-echarts not installed)

Route added: `/statistiques`

## How to run the app
From `Angular` folder:

```powershell
npm run build
npm run start
```

Then open http://localhost:4200/statistiques (or the configured port)

## Notes
- ECharts integration in `app-echart` is currently a placeholder; to enable full features install `ngx-echarts` and import `NgxEchartsModule` in `app.module.ts` or use standalone import.
- `categoriesService.getBookCountPerCategory()` was added to fetch server-provided per-category counts if backend provides them.
- For large networks, consider adding `sigma` or `cytoscape` integration with WebGL or layout offloading to web workers.
