import { useState } from "react";
import { ChartExportLibrary } from "./components/ChartExportLibrary";
import {
  ClaimsByHourChart,
  ClaimsOverTimeChart,
  ClaimsVsViewsChart,
  ClimateImpactChart,
  PostsByLocationChart,
  PostsOverTimeChart,
  StaffPostsChart,
  WasteDivertedChart,
} from "./components/Charts";
import { DemandHeatmap } from "./components/DemandHeatmap";
import {
  LOCATIONS,
  POSTS,
  STAFF,
  SUMMARY,
  TABS,
  UNIVERSITY,
  periodLabel,
  type TabId,
} from "./data";
import {
  downloadAllDataXlsx,
  downloadChartsZip,
  downloadFullReport,
  downloadPostsCsv,
} from "./export";

function StatCard({ value, label, accent }: { value: string; label: string; accent?: "green" | "yellow" }) {
  const color = accent === "green" ? "text-brandGreen" : accent === "yellow" ? "text-scOrange" : "text-black";
  return (
    <div className="card p-4">
      <div className={`stat-value ${color}`}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function utilizationClass(utilization: "high" | "medium" | "low") {
  if (utilization === "high") return "bg-scGreen/30";
  if (utilization === "medium") return "bg-scYellow/50";
  return "bg-scOrange/30";
}

function TabPanel({ active, id, children }: { active: boolean; id: TabId; children: React.ReactNode }) {
  return (
    <div hidden={!active} id={`panel-${id}`} role="tabpanel" aria-labelledby={`tab-${id}`} className="space-y-6">
      {children}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [period, setPeriod] = useState("year");
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const label = periodLabel(period);

  async function runExport(action: () => void | Promise<void>, successMessage: string) {
    setExporting(true);
    setExportStatus(null);
    try {
      await action();
      setExportStatus(successMessage);
    } catch (error) {
      setExportStatus(error instanceof Error ? error.message : "Export failed");
    } finally {
      setExporting(false);
    }
  }

  const lowUtilStaff = STAFF.filter((member) => member.utilization === "low");

  return (
    <div className="min-h-screen bg-cream px-4 py-8">
      <div className="relative mx-auto max-w-5xl">
        <div className="pointer-events-none absolute -top-2 right-0 z-10 floating-character hidden md:block">
          <img
            src={`${import.meta.env.BASE_URL}images/SC_apple_transp.png`}
            alt=""
            className="h-32 w-auto drop-shadow-[8px_8px_0_rgba(0,0,0,0.35)]"
          />
        </div>

        <header className="relative z-20 mb-8 flex flex-wrap items-start justify-between gap-4 pr-0 md:pr-36">
          <div className="space-y-2">
            <img
              src={`${import.meta.env.BASE_URL}images/second-course-logo.png`}
              alt="Second Course"
              className="h-10 w-auto md:h-12"
            />
            <h1 className="font-display text-3xl text-black md:text-4xl">University Dashboard DEMO</h1>
            <p className="font-sans text-black/80">{UNIVERSITY}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              className="period-select"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              aria-label="Date range"
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Academic year</option>
            </select>
            <button
              type="button"
              className="btn-secondary"
              disabled={exporting}
              onClick={() => runExport(() => downloadFullReport(label), "Report downloaded.")}
            >
              Download report
            </button>
          </div>
        </header>

        <div className="mb-4 space-y-2">
          <div className="callout-warning">
            <strong className="block mb-1">Demo preview</strong>
            Sample data for design review only — not connected to live Second Course metrics.
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="pill bg-white">Admin access</span>
            <span className="text-xs text-black/60 font-sans">
              Access granted by Second Course per university request
            </span>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Dashboard sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              className={`pill ${activeTab === tab.id ? "pill-active" : "bg-white"}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {exportStatus ? (
          <div className={`mb-4 callout ${exportStatus.includes("failed") || exportStatus.includes("No charts") ? "callout-warning" : "callout-info"}`}>
            {exportStatus}
          </div>
        ) : null}

        <TabPanel active={activeTab === "overview"} id="overview">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard value={String(SUMMARY.totalPosts)} label="Posts (period)" />
            <StatCard value={SUMMARY.totalClaims.toLocaleString()} label="Total claims" accent="green" />
            <StatCard value={`${SUMMARY.claimRate}%`} label="Claim rate" accent="yellow" />
            <StatCard value={`${SUMMARY.avgFirstClaimMin} min`} label="Avg time to first claim" />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <PostsOverTimeChart />
            <ClaimsOverTimeChart />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <ClaimsByHourChart />
            <PostsByLocationChart />
          </div>
          <div className="callout-info">
            <strong className="block mb-1">Smart aggregations</strong>
            Peak demand clusters around lunch (11a–1p) at Alumni Center and Student Union. Evening posts at
            Aztec Recreation underperform — consider timing or staff outreach.
          </div>
          <p className="text-xs text-black/60 font-sans">Source: Second Course · {label}</p>
        </TabPanel>

        <TabPanel active={activeTab === "posts"} id="posts">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard value={`${SUMMARY.claimRate}%`} label="Overall claim rate" accent="yellow" />
            <StatCard value="5.0" label="Avg claims per post" />
            <StatCard value="7.4" label="Avg views per post" />
          </div>
          <ClaimsVsViewsChart />
          <h2 className="font-display text-xl">Individual posts</h2>
          <div className="space-y-3">
            {POSTS.map((post) => (
              <details key={post.id} className="card p-4">
                <summary className="cursor-pointer font-sans text-sm font-semibold">
                  {post.id} — {post.title}
                  <span className="ml-2 text-black/60">{post.claimRate}% claimed</span>
                </summary>
                <div className="mt-3 space-y-2 font-sans text-sm text-black/80">
                  <p>
                    Posted by {post.staff} · {post.location} · {post.posted}
                  </p>
                  <p>{post.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="pill bg-scOrange/20 text-xs">Allergens: {post.allergens}</span>
                    <span className="pill bg-white text-xs">
                      {post.claims} claims / {post.views} views
                    </span>
                    <span className="pill bg-white text-xs">First claim: {post.firstClaimMin} min</span>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </TabPanel>

        <TabPanel active={activeTab === "demand"} id="demand">
          <p className="font-sans text-black/80">
            Demand map shows when and where posts perform best — useful for staffing, outreach, and event planning.
          </p>
          <div className="card p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="font-display text-lg">Performance by location and time</h2>
              <span className="pill pill-active text-xs">Peak window</span>
            </div>
            <DemandHeatmap />
            <p className="mt-2 text-xs text-black/60 font-sans">Cell value = claim rate index (0–20) · {label}</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h3 className="font-display text-lg mb-2">Best-performing time slots</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Avg claims</th>
                    <th>Claim rate</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["11a – 1p", "18.4", "82%"],
                    ["1p – 3p", "14.2", "74%"],
                    ["9a – 11a", "9.8", "61%"],
                    ["5p – 7p", "6.1", "44%"],
                  ].map((row) => (
                    <tr key={row[0]}>
                      <td>{row[0]}</td>
                      <td className="text-right">{row[1]}</td>
                      <td className="text-right">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="font-display text-lg mb-2">Best-performing locations</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Posts</th>
                    <th>Claim rate</th>
                  </tr>
                </thead>
                <tbody>
                  {LOCATIONS.map((location) => (
                    <tr key={location.name}>
                      <td>{location.name}</td>
                      <td className="text-right">{location.posts}</td>
                      <td className="text-right">{location.claimRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabPanel>

        <TabPanel active={activeTab === "staff"} id="staff">
          <p className="font-sans text-black/80">
            Track which staff post, when they post, and whether units are underutilizing the platform.
          </p>
          {lowUtilStaff.length > 0 ? (
            <div className="callout-warning">
              <strong className="block mb-1">Underutilization detected</strong>
              {lowUtilStaff.map((member) => member.name).join(" and ")} have not posted recently. Consider outreach or
              training to increase campus coverage.
            </div>
          ) : null}
          <h2 className="font-display text-xl">Staff posting activity</h2>
          <div className="card overflow-x-auto p-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Staff</th>
                  <th>Role</th>
                  <th>Posts</th>
                  <th>Last post</th>
                  <th>Avg first claim</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {STAFF.map((member) => (
                  <tr key={member.name}>
                    <td>{member.name}</td>
                    <td>{member.role}</td>
                    <td className="text-right">{member.posts}</td>
                    <td>{member.lastPost}</td>
                    <td className="text-right">{member.avgClaimMin} min</td>
                    <td>
                      <span className={`pill text-xs capitalize ${utilizationClass(member.utilization)}`}>
                        {member.utilization}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <StaffPostsChart />
        </TabPanel>

        <TabPanel active={activeTab === "impact"} id="impact">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard value={`${SUMMARY.lbsDiverted.toLocaleString()} lbs`} label="Food diverted (est.)" accent="green" />
            <StatCard value={`${SUMMARY.tco2e} tCO₂e`} label="Climate impact (est.)" accent="green" />
            <StatCard value={`$${SUMMARY.haulingSavings.toLocaleString()}`} label="Waste hauling savings (est.)" />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <WasteDivertedChart />
            <ClimateImpactChart />
          </div>
          <div className="callout-neutral">
            <strong className="block mb-1">Student demographics (future)</strong>
            Demographic breakdowns (year, major, housing status) are planned for a future release. Data will respect
            student privacy and aggregate only at the cohort level.
          </div>
          <div className="card p-4">
            <h2 className="font-display text-lg mb-3">Smart aggregation — sustainability snapshot</h2>
            <div className="grid gap-4 md:grid-cols-2 font-sans text-sm text-black/80">
              <div>
                <p className="font-semibold text-black">Grant-ready metrics</p>
                <p>
                  {SUMMARY.lbsDiverted.toLocaleString()} lbs diverted · {SUMMARY.totalClaims.toLocaleString()} student
                  meals claimed · {SUMMARY.claimRate}% utilization of posted food
                </p>
              </div>
              <div>
                <p className="font-semibold text-black">Engagement signal</p>
                <p>Median time to first claim: 8.6 min — indicates an active, responsive student network</p>
              </div>
            </div>
          </div>
        </TabPanel>

        <TabPanel active={activeTab === "exports"} id="exports">
          <p className="font-sans text-black/80">
            Download raw data for grant reports, sustainability audits, or internal review. Chart exports bundle every
            chart on the dashboard into a single zip file.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card p-4 space-y-3">
              <h2 className="font-display text-lg">Spreadsheet export</h2>
              <p className="text-sm text-black/70 font-sans">
                Posts, staff, monthly trends, locations, and impact estimates as Excel or CSV.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn-primary"
                  disabled={exporting}
                  onClick={() =>
                    runExport(() => downloadAllDataXlsx(label), "All data downloaded as .xlsx")
                  }
                >
                  Download all data (.xlsx)
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={exporting}
                  onClick={() => runExport(() => downloadPostsCsv(label), "Posts downloaded as .csv")}
                >
                  Posts only (.csv)
                </button>
              </div>
            </div>
            <div className="card p-4 space-y-3">
              <h2 className="font-display text-lg">Chart exports</h2>
              <p className="text-sm text-black/70 font-sans">
                PNG or SVG zip of all dashboard charts for presentations and reports.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn-primary"
                  disabled={exporting}
                  onClick={() =>
                    runExport(() => downloadChartsZip("png", label), "Charts downloaded as PNG zip.")
                  }
                >
                  Export charts (PNG)
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={exporting}
                  onClick={() =>
                    runExport(() => downloadChartsZip("svg", label), "Charts downloaded as SVG zip.")
                  }
                >
                  Export charts (SVG)
                </button>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-display text-lg mb-2">Export preview</h3>
            <pre className="card overflow-x-auto p-4 text-xs font-mono text-black/80">
{`post_id,title,staff,location,posted_at,claims,views,claim_rate,first_claim_min,allergens,lbs_diverted
P-1042,Catered lunch surplus,Maria G.,Alumni Center,2026-06-12T11:35,28,41,0.68,4.2,Gluten; dairy,42
P-1038,Pizza and salad leftovers,James T.,Student Union,2026-06-11T13:10,44,52,0.85,3.1,Gluten; dairy; tree nuts,58`}
            </pre>
          </div>
        </TabPanel>

        <ChartExportLibrary />

        <footer className="mt-10 flex flex-col items-center gap-2 text-sm text-black/70 font-sans">
          <a href="https://www.instagram.com/haveasecondcourse/" className="underline hover:text-black">
            @haveasecondcourse
          </a>
          <a href="mailto:support@secondcourse.co" className="underline hover:text-black">
            support@secondcourse.co
          </a>
        </footer>
      </div>
    </div>
  );
}
