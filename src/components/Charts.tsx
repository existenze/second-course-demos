import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CLAIMS_BY_HOUR,
  CLAIMS_BY_MONTH,
  CLIMATE_MONTHS,
  CLIMATE_TCO2,
  HOURS,
  LOCATIONS,
  MONTHS,
  POSTS,
  POSTS_BY_MONTH,
  STAFF,
  WASTE_LBS,
  WASTE_MONTHS,
} from "../data";

const CHART_COLORS = ["#6EC100", "#FFDE00", "#FF6E02", "#FD8DFD", "#008B48", "#FE0000"];

export function ChartShell({
  id,
  title,
  caption,
  children,
  className = "",
}: {
  id: string;
  title: string;
  caption?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`chart-export ${className}`} id={id}>
      <h3 className="font-display text-lg text-black mb-3">{title}</h3>
      <div className="h-48 w-full">{children}</div>
      {caption ? <p className="mt-2 text-xs text-black/60 font-sans">{caption}</p> : null}
    </div>
  );
}

export function PostsOverTimeChart() {
  const data = MONTHS.map((month, index) => ({
    month,
    posts: POSTS_BY_MONTH[index],
  }));

  return (
    <ChartShell id="chart-posts-over-time" title="Posts over time" caption="Y-axis: post count">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#18181b22" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="posts" name="Posts" fill="#6EC100" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function ClaimsOverTimeChart() {
  const data = MONTHS.map((month, index) => ({
    month,
    claims: CLAIMS_BY_MONTH[index],
  }));

  return (
    <ChartShell id="chart-claims-over-time" title="Claims over time" caption="Y-axis: claim count">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#18181b22" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line type="monotone" dataKey="claims" name="Claims" stroke="#008B48" strokeWidth={3} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function ClaimsByHourChart() {
  const data = HOURS.map((hour, index) => ({
    hour,
    claims: CLAIMS_BY_HOUR[index],
  }));

  return (
    <ChartShell id="chart-claims-by-hour" title="Claims by time of day" caption="X-axis: hour · Y-axis: claims">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#18181b22" />
          <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="claims" name="Claims" fill="#FFDE00" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function PostsByLocationChart() {
  const data = LOCATIONS.map((location) => ({
    name: location.name,
    value: location.posts,
  }));

  return (
    <ChartShell id="chart-posts-by-location" title="Posts by location" caption="Share of posts by campus location">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={45} outerRadius={72} paddingAngle={2}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="#18181b" strokeWidth={1} />
            ))}
          </Pie>
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function ClaimsVsViewsChart() {
  const data = POSTS.map((post) => ({
    id: post.id,
    views: post.views,
    claims: post.claims,
  }));

  return (
    <ChartShell id="chart-claims-vs-views" title="Claims vs views by post" caption="Top sample posts">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#18181b22" />
          <XAxis dataKey="id" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="views" name="Views" fill="#EDDBC3" stroke="#18181b" strokeWidth={1} radius={[4, 4, 0, 0]} />
          <Bar dataKey="claims" name="Claims" fill="#6EC100" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function StaffPostsChart() {
  const data = STAFF.map((member) => ({
    name: member.name,
    posts: member.posts,
  }));

  return (
    <ChartShell id="chart-staff-posts" title="Posts per staff member" caption="Horizontal bar chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#18181b22" />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={72} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="posts" name="Posts" fill="#FF6E02" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function WasteDivertedChart() {
  const data = WASTE_MONTHS.map((month, index) => ({
    month,
    lbs: WASTE_LBS[index],
  }));

  return (
    <ChartShell id="chart-waste-diverted" title="Food waste diverted (lbs)" caption="Estimated cumulative trend">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#18181b22" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line type="monotone" dataKey="lbs" name="Lbs diverted" stroke="#6EC100" strokeWidth={3} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function ClimateImpactChart() {
  const data = CLIMATE_MONTHS.map((month, index) => ({
    month,
    tco2e: CLIMATE_TCO2[index],
  }));

  return (
    <ChartShell id="chart-climate-impact" title="Estimated climate impact (tCO₂e)" caption="Emissions avoided from landfill diversion">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#18181b22" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line type="monotone" dataKey="tco2e" name="tCO₂e" stroke="#008B48" strokeWidth={3} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}
