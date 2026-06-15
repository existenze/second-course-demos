import {
  ClaimsByHourChart,
  ClaimsOverTimeChart,
  ClaimsVsViewsChart,
  ClimateImpactChart,
  PostsByLocationChart,
  PostsOverTimeChart,
  StaffPostsChart,
  WasteDivertedChart,
} from "./Charts";
import { DemandHeatmap } from "./DemandHeatmap";

/** Off-screen charts for export — full size while dashboard tabs stay hidden. */
export function ChartExportLibrary() {
  return (
    <div
      id="chart-export-library"
      aria-hidden="true"
      className="pointer-events-none fixed left-[-9999px] top-0 w-[720px] space-y-6 opacity-0"
    >
      <div data-chart-export="chart-posts-over-time">
        <PostsOverTimeChart />
      </div>
      <div data-chart-export="chart-claims-over-time">
        <ClaimsOverTimeChart />
      </div>
      <div data-chart-export="chart-claims-by-hour">
        <ClaimsByHourChart />
      </div>
      <div data-chart-export="chart-posts-by-location">
        <PostsByLocationChart />
      </div>
      <div data-chart-export="chart-claims-vs-views">
        <ClaimsVsViewsChart />
      </div>
      <div data-chart-export="chart-staff-posts">
        <StaffPostsChart />
      </div>
      <div data-chart-export="chart-waste-diverted">
        <WasteDivertedChart />
      </div>
      <div data-chart-export="chart-climate-impact">
        <ClimateImpactChart />
      </div>
      <div data-chart-export="chart-demand-heatmap" className="chart-export">
        <h3 className="font-display text-lg text-black mb-3">Performance by location and time</h3>
        <DemandHeatmap />
      </div>
    </div>
  );
}
