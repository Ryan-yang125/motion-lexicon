import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/Button";

type RangeKey = "7d" | "30d" | "90d";

type Report = {
  label: string;
  period: string;
  updated: string;
  metrics: Array<{ label: string; value: string; change: string; direction: "up" | "down"; note: string }>;
  retention: number[];
  cohorts: Array<{ label: string; value: string; tone: string }>;
  segments: Array<{ name: string; description: string; members: string; rate: string; revenue: string; color: string }>;
};

const reports: Record<RangeKey, Report> = {
  "7d": {
    label: "Last 7 days",
    period: "Aug 5 – Aug 11, 2026",
    updated: "Updated 8 min ago",
    metrics: [
      { label: "Active users", value: "24,892", change: "+12.4%", direction: "up", note: "vs. previous 7 days" },
      { label: "Activation rate", value: "68.2%", change: "+3.1 pts", direction: "up", note: "vs. previous 7 days" },
      { label: "Net revenue", value: "$84,320", change: "+8.7%", direction: "up", note: "vs. previous 7 days" },
      { label: "Expansion MRR", value: "$12,860", change: "−2.6%", direction: "down", note: "vs. previous 7 days" },
    ],
    retention: [100, 82, 74, 68, 63, 59, 57, 54],
    cohorts: [
      { label: "New signups", value: "57%", tone: "blue" },
      { label: "Returning", value: "38%", tone: "green" },
      { label: "Reactivated", value: "5%", tone: "stone" },
    ],
    segments: [
      { name: "Product-led teams", description: "Self-serve workspaces with 5–20 seats", members: "8,462", rate: "72.4%", revenue: "$31.8k", color: "blue" },
      { name: "Agency partners", description: "Multi-client delivery accounts", members: "3,218", rate: "69.8%", revenue: "$24.1k", color: "violet" },
      { name: "Scale accounts", description: "Annual contracts with 50+ seats", members: "1,084", rate: "64.1%", revenue: "$18.6k", color: "orange" },
    ],
  },
  "30d": {
    label: "Last 30 days",
    period: "Jul 13 – Aug 11, 2026",
    updated: "Updated today, 09:42",
    metrics: [
      { label: "Active users", value: "78,416", change: "+8.2%", direction: "up", note: "vs. previous 30 days" },
      { label: "Activation rate", value: "65.8%", change: "+1.8 pts", direction: "up", note: "vs. previous 30 days" },
      { label: "Net revenue", value: "$312,480", change: "+11.9%", direction: "up", note: "vs. previous 30 days" },
      { label: "Expansion MRR", value: "$49,220", change: "+6.2%", direction: "up", note: "vs. previous 30 days" },
    ],
    retention: [100, 80, 72, 67, 62, 59, 55, 51],
    cohorts: [
      { label: "New signups", value: "54%", tone: "blue" },
      { label: "Returning", value: "41%", tone: "green" },
      { label: "Reactivated", value: "5%", tone: "stone" },
    ],
    segments: [
      { name: "Product-led teams", description: "Self-serve workspaces with 5–20 seats", members: "25,421", rate: "70.8%", revenue: "$114.4k", color: "blue" },
      { name: "Agency partners", description: "Multi-client delivery accounts", members: "9,182", rate: "67.5%", revenue: "$92.2k", color: "violet" },
      { name: "Scale accounts", description: "Annual contracts with 50+ seats", members: "3,706", rate: "63.7%", revenue: "$76.1k", color: "orange" },
    ],
  },
  "90d": {
    label: "Last 90 days",
    period: "May 14 – Aug 11, 2026",
    updated: "Updated today, 09:42",
    metrics: [
      { label: "Active users", value: "182,590", change: "+15.6%", direction: "up", note: "vs. previous 90 days" },
      { label: "Activation rate", value: "63.1%", change: "+4.6 pts", direction: "up", note: "vs. previous 90 days" },
      { label: "Net revenue", value: "$891,640", change: "+18.3%", direction: "up", note: "vs. previous 90 days" },
      { label: "Expansion MRR", value: "$132,480", change: "+14.2%", direction: "up", note: "vs. previous 90 days" },
    ],
    retention: [100, 78, 69, 63, 58, 54, 50, 47],
    cohorts: [
      { label: "New signups", value: "51%", tone: "blue" },
      { label: "Returning", value: "44%", tone: "green" },
      { label: "Reactivated", value: "5%", tone: "stone" },
    ],
    segments: [
      { name: "Product-led teams", description: "Self-serve workspaces with 5–20 seats", members: "54,348", rate: "68.1%", revenue: "$313.8k", color: "blue" },
      { name: "Agency partners", description: "Multi-client delivery accounts", members: "21,468", rate: "65.2%", revenue: "$269.1k", color: "violet" },
      { name: "Scale accounts", description: "Annual contracts with 50+ seats", members: "8,406", rate: "61.9%", revenue: "$221.9k", color: "orange" },
    ],
  },
};

const rangeOptions: Array<{ key: RangeKey; label: string }> = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
];

function RetentionChart({ values }: { values: number[] }) {
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${100 - value}`).join(" ");
  const area = `0,100 ${points} 100,100`;

  return (
    <div className="chart-wrap" aria-label="Weekly retention trend chart">
      <div className="chart-y-labels" aria-hidden="true"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div>
      <svg className="retention-chart" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={`Retention declines from ${values[0]} percent to ${values[values.length - 1]} percent`}>
        <defs>
          <linearGradient id="retention-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".20" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 25, 50, 75, 100].map((line) => <line key={line} x1="0" x2="100" y1={line} y2={line} vectorEffect="non-scaling-stroke" />)}
        <polygon points={area} fill="url(#retention-fill)" />
        <polyline points={points} fill="none" vectorEffect="non-scaling-stroke" />
        {values.map((value, index) => <circle key={index} cx={(index / (values.length - 1)) * 100} cy={100 - value} r="1.35" vectorEffect="non-scaling-stroke" />)}
      </svg>
      <div className="chart-x-labels" aria-hidden="true"><span>Week 0</span><span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span><span>Week 5</span><span>Week 6</span><span>Week 7</span></div>
    </div>
  );
}

export function AnalyticsPage() {
  const [range, setRange] = useState<RangeKey>("30d");
  const [isUpdating, setIsUpdating] = useState(false);
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [exportStatus, setExportStatus] = useState<"idle" | "exporting" | "done">("idle");
  const report = reports[range];

  useEffect(() => {
    if (!isUpdating) return;
    const timeout = window.setTimeout(() => setIsUpdating(false), 380);
    return () => window.clearTimeout(timeout);
  }, [isUpdating, refreshNonce]);

  function changeRange(next: RangeKey) {
    if (next === range) return;
    setRange(next);
    setIsUpdating(true);
    setRefreshNonce((nonce) => nonce + 1);
  }

  function exportReport() {
    if (exportStatus === "exporting") return;
    setExportStatus("exporting");
    window.setTimeout(() => {
      const csv = ["Metric,Value", ...report.metrics.map((metric) => `${metric.label},${metric.value.replace(/,/g, "")}`)].join("\n");
      const link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      link.download = `northstar-analytics-${range}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
      setExportStatus("done");
      window.setTimeout(() => setExportStatus("idle"), 2200);
    }, 450);
  }

  const lastValue = report.retention[report.retention.length - 1];
  const rangeLiveText = useMemo(() => isUpdating ? `Refreshing report for ${report.label}` : `Report for ${report.label} loaded`, [isUpdating, report.label]);

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <a className="brand focus-target" href="/analytics" aria-label="Northstar Analytics home"><span className="brand-mark">N</span><span>Northstar</span></a>
        <nav aria-label="Primary navigation" className="main-nav"><a className="focus-target active" href="/analytics">Analytics</a><a className="focus-target" href="#segments">Customers</a><a className="focus-target" href="#retention">Reports</a></nav>
        <div className="header-actions">
          <Button className="icon-button" aria-label="Toggle color theme" onClick={() => document.documentElement.classList.toggle("dark")}>◐</Button>
          <Button className="export-button" onClick={exportReport} disabled={exportStatus === "exporting"}>
            <span aria-hidden="true">↓</span> {exportStatus === "exporting" ? "Preparing…" : exportStatus === "done" ? "Exported" : "Export CSV"}
          </Button>
        </div>
      </header>

      <section className="dashboard-intro" aria-labelledby="dashboard-title">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 id="dashboard-title">Analytics overview</h1>
          <p className="lede">A clear read on product momentum, customer behavior, and retained value.</p>
        </div>
        <div className="report-controls">
          <div className="range-picker" role="group" aria-label="Reporting period">
            {rangeOptions.map((option) => <Button key={option.key} aria-pressed={range === option.key} className={`range-button ${range === option.key ? "selected" : ""}`} onClick={() => changeRange(option.key)}>{option.label}</Button>)}
          </div>
          <p className="report-date"><span className={`status-dot ${isUpdating ? "loading" : ""}`} />{isUpdating ? "Refreshing view…" : report.period}</p>
        </div>
      </section>

      <p className="sr-only" aria-live="polite">{rangeLiveText}</p>
      <section className={`dashboard-content ${isUpdating ? "is-updating" : ""}`} aria-busy={isUpdating}>
        <section className="metric-grid" aria-label="Key performance indicators">
          {report.metrics.map((metric) => <article className="metric-card" key={metric.label}>
            <p className="metric-label">{metric.label}</p>
            <div className="metric-value-row"><strong>{metric.value}</strong><span className={`metric-change ${metric.direction}`}>{metric.direction === "up" ? "↑" : "↓"} {metric.change.replace("−", "")}</span></div>
            <p className="metric-note">{metric.note}</p>
          </article>)}
        </section>

        <section className="analysis-grid">
          <article className="panel retention-panel" id="retention">
            <div className="panel-heading">
              <div><p className="eyebrow">Engagement</p><h2>Weekly retention</h2></div>
              <div className="retention-stat"><strong>{lastValue}%</strong><span>at week 7</span></div>
            </div>
            <RetentionChart values={report.retention} />
            <div className="cohort-legend" aria-label="Cohort mix">
              {report.cohorts.map((cohort) => <div key={cohort.label}><span className={`legend-dot ${cohort.tone}`} /><span>{cohort.label}</span><strong>{cohort.value}</strong></div>)}
            </div>
          </article>

          <aside className="panel insight-panel" aria-labelledby="insight-title">
            <p className="eyebrow">Signal</p>
            <h2 id="insight-title">Activation is compounding</h2>
            <p>Teams that invite a second collaborator in their first session retain <strong>1.6×</strong> better by week four.</p>
            <a className="insight-link focus-target" href="#segments">Explore activated teams <span aria-hidden="true">→</span></a>
            <p className="updated-note">{report.updated}</p>
          </aside>
        </section>

        <section className="panel segments-panel" id="segments" aria-labelledby="segments-title">
          <div className="panel-heading segments-heading"><div><p className="eyebrow">Customers</p><h2 id="segments-title">Top segments</h2></div><p>Ranked by retained revenue</p></div>
          <div className="segment-table" role="table" aria-label="Top customer segments">
            <div className="segment-row segment-head" role="row"><span role="columnheader">Segment</span><span role="columnheader">Members</span><span role="columnheader">Activation</span><span role="columnheader">Retained revenue</span></div>
            {report.segments.map((segment, index) => <div className="segment-row" role="row" key={segment.name}>
              <div className="segment-name" role="cell"><span className={`segment-swatch ${segment.color}`}>{index + 1}</span><div><strong>{segment.name}</strong><small>{segment.description}</small></div></div>
              <span role="cell" data-label="Members">{segment.members}</span><span role="cell" data-label="Activation"><b>{segment.rate}</b></span><span role="cell" data-label="Retained revenue"><b>{segment.revenue}</b></span>
            </div>)}
          </div>
        </section>
      </section>
    </main>
  );
}
