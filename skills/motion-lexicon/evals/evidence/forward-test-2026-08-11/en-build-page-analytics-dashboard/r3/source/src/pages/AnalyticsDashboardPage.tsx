import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SegmentedControl } from "../components/motion-lexicon/segmented-control";
import { Button } from "../components/ui/Button";

type RangeKey = "7d" | "30d" | "90d";
type ExportState = "idle" | "pending" | "success" | "error";

type DashboardSnapshot = {
  period: string;
  comparison: string;
  kpis: Array<{
    label: string;
    value: string;
    change: string;
    trend: "up" | "down";
    note: string;
  }>;
  retention: {
    labels: string[];
    current: number[];
    previous: number[];
  };
  segments: Array<{
    name: string;
    description: string;
    users: string;
    share: number;
    change: string;
  }>;
};

const RANGE_OPTIONS = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
];

const DASHBOARD_DATA: Record<RangeKey, DashboardSnapshot> = {
  "7d": {
    period: "Aug 6–12, 2026",
    comparison: "vs. previous 7 days",
    kpis: [
      { label: "Active users", value: "12,480", change: "+8.2%", trend: "up", note: "946 newly active" },
      { label: "Activation rate", value: "68.4%", change: "+3.1%", trend: "up", note: "Goal completion" },
      { label: "Week 4 retention", value: "42.8%", change: "+1.9%", trend: "up", note: "Across mature cohorts" },
      { label: "Net revenue", value: "$284K", change: "+12.6%", trend: "up", note: "$25.1K expansion" },
    ],
    retention: {
      labels: ["Day 0", "Day 1", "Day 2", "Day 3", "Day 5", "Day 6", "Day 7"],
      current: [100, 76, 67, 60, 54, 49, 46],
      previous: [100, 73, 63, 56, 49, 45, 42],
    },
    segments: [
      { name: "Product-led teams", description: "3+ collaborators, weekly projects", users: "4,112", share: 78, change: "+14.2%" },
      { name: "Scale accounts", description: "More than 100 active seats", users: "2,846", share: 61, change: "+9.8%" },
      { name: "Automation adopters", description: "Runs 5+ workflows per week", users: "2,194", share: 48, change: "+7.1%" },
    ],
  },
  "30d": {
    period: "Jul 14–Aug 12, 2026",
    comparison: "vs. previous 30 days",
    kpis: [
      { label: "Active users", value: "38,240", change: "+11.4%", trend: "up", note: "4,208 newly active" },
      { label: "Activation rate", value: "65.7%", change: "+2.6%", trend: "up", note: "Goal completion" },
      { label: "Week 4 retention", value: "41.2%", change: "+1.4%", trend: "up", note: "Across mature cohorts" },
      { label: "Net revenue", value: "$1.12M", change: "+9.8%", trend: "up", note: "$96.4K expansion" },
    ],
    retention: {
      labels: ["Week 0", "Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
      current: [100, 72, 60, 51, 43, 39, 36],
      previous: [100, 68, 55, 47, 40, 36, 33],
    },
    segments: [
      { name: "Product-led teams", description: "3+ collaborators, weekly projects", users: "12,680", share: 82, change: "+16.8%" },
      { name: "Scale accounts", description: "More than 100 active seats", users: "8,942", share: 64, change: "+12.1%" },
      { name: "Automation adopters", description: "Runs 5+ workflows per week", users: "6,704", share: 51, change: "+8.4%" },
    ],
  },
  "90d": {
    period: "May 15–Aug 12, 2026",
    comparison: "vs. previous 90 days",
    kpis: [
      { label: "Active users", value: "81,960", change: "+18.7%", trend: "up", note: "12,906 newly active" },
      { label: "Activation rate", value: "63.1%", change: "+1.8%", trend: "up", note: "Goal completion" },
      { label: "Week 4 retention", value: "39.6%", change: "−0.8%", trend: "down", note: "Across mature cohorts" },
      { label: "Net revenue", value: "$3.18M", change: "+15.2%", trend: "up", note: "$418K expansion" },
    ],
    retention: {
      labels: ["Week 0", "Week 2", "Week 4", "Week 6", "Week 8", "Week 10", "Week 12"],
      current: [100, 66, 53, 44, 39, 35, 32],
      previous: [100, 64, 51, 45, 40, 36, 34],
    },
    segments: [
      { name: "Product-led teams", description: "3+ collaborators, weekly projects", users: "26,944", share: 86, change: "+21.4%" },
      { name: "Scale accounts", description: "More than 100 active seats", users: "19,310", share: 68, change: "+17.6%" },
      { name: "Automation adopters", description: "Runs 5+ workflows per week", users: "14,886", share: 56, change: "+13.2%" },
    ],
  },
};

function Icon({ name }: { name: "grid" | "chart" | "users" | "settings" | "sun" | "moon" | "download" | "check" | "spark" }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    chart: <><path d="M4 19V9"/><path d="M10 19V5"/><path d="M16 19v-7"/><path d="M22 19H2"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08A1.7 1.7 0 0 0 8.94 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.57 15 1.7 1.7 0 0 0 3 14H3v-4h.08A1.7 1.7 0 0 0 4.6 8.94a1.7 1.7 0 0 0-.34-1.88L4.2 7l2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.57 1.7 1.7 0 0 0 10 3h4v.08a1.7 1.7 0 0 0 1.06 1.52 1.7 1.7 0 0 0 1.88-.34L17 4.2 19.83 7l-.06.06a1.7 1.7 0 0 0-.34 1.88A1.7 1.7 0 0 0 21 10h.08v4H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></>,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/>,
    download: <><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    spark: <><path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4L12 3Z"/><path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14Z"/></>,
  };

  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function RetentionChart({ snapshot }: { snapshot: DashboardSnapshot }) {
  const { labels, current, previous } = snapshot.retention;
  const width = 680;
  const height = 250;
  const left = 46;
  const right = 16;
  const top = 18;
  const bottom = 42;
  const x = (index: number) => left + (index * (width - left - right)) / (labels.length - 1);
  const y = (value: number) => top + ((100 - value) * (height - top - bottom)) / 100;
  const points = (values: number[]) => values.map((value, index) => `${x(index)},${y(value)}`).join(" ");

  return (
    <div className="chart-frame">
      <svg className="retention-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="retention-title retention-desc">
        <title id="retention-title">Retention curve for {snapshot.period}</title>
        <desc id="retention-desc">Current retention ends at {current.at(-1)} percent, compared with {previous.at(-1)} percent in the previous period.</desc>
        {[100, 75, 50, 25, 0].map((tick) => (
          <g key={tick}>
            <line className="chart-gridline" x1={left} x2={width - right} y1={y(tick)} y2={y(tick)} />
            <text className="chart-axis-label" x={left - 10} y={y(tick) + 4} textAnchor="end">{tick}%</text>
          </g>
        ))}
        <polyline className="chart-line chart-line-previous" points={points(previous)} />
        <polyline className="chart-line chart-line-current" points={points(current)} />
        {current.map((value, index) => (
          <circle key={labels[index]} className="chart-point" cx={x(index)} cy={y(value)} r="3.5" />
        ))}
        {labels.map((label, index) => (
          <text key={label} className="chart-axis-label chart-x-label" x={x(index)} y={height - 14} textAnchor="middle">{label}</text>
        ))}
      </svg>
    </div>
  );
}

export function AnalyticsDashboardPage() {
  const [range, setRange] = useState<RangeKey>("30d");
  const [rangeState, setRangeState] = useState<"ready" | "updating">("ready");
  const [exportState, setExportState] = useState<ExportState>("idle");
  const [announcement, setAnnouncement] = useState("Analytics ready for the last 30 days.");
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const reducedMotion = useReducedMotion();
  const rangeVersion = useRef(0);
  const rangeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exportTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exportVersion = useRef(0);
  const snapshot = DASHBOARD_DATA[range];

  const exportLabel = useMemo(() => {
    if (exportState === "pending") return "Preparing…";
    if (exportState === "success") return "Exported";
    if (exportState === "error") return "Retry export";
    return "Export CSV";
  }, [exportState]);

  useEffect(() => () => {
    if (rangeTimer.current) clearTimeout(rangeTimer.current);
    if (exportTimer.current) clearTimeout(exportTimer.current);
  }, []);

  useEffect(() => {
    if (exportState !== "pending") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      exportVersion.current += 1;
      if (exportTimer.current) clearTimeout(exportTimer.current);
      setExportState("idle");
      setAnnouncement("Export canceled.");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [exportState]);

  const handleRangeChange = (nextValue: string) => {
    const next = nextValue as RangeKey;
    if (next === range) return;

    rangeVersion.current += 1;
    const version = rangeVersion.current;
    if (rangeTimer.current) clearTimeout(rangeTimer.current);
    setRangeState("updating");
    setRange(next);
    setAnnouncement(`Updating analytics for the last ${next === "7d" ? "7 days" : next === "30d" ? "30 days" : "90 days"}.`);

    rangeTimer.current = setTimeout(() => {
      if (version !== rangeVersion.current) return;
      setRangeState("ready");
      setAnnouncement(`Analytics updated for ${DASHBOARD_DATA[next].period}.`);
    }, reducedMotion ? 40 : 260);
  };

  const handleTheme = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
    setAnnouncement(`${next ? "Dark" : "Light"} theme enabled.`);
  };

  const handleExport = () => {
    if (exportState === "pending") {
      exportVersion.current += 1;
      if (exportTimer.current) clearTimeout(exportTimer.current);
      setExportState("idle");
      setAnnouncement("Export canceled.");
      return;
    }
    exportVersion.current += 1;
    const version = exportVersion.current;
    if (exportTimer.current) clearTimeout(exportTimer.current);
    setExportState("pending");
    setAnnouncement(`Preparing CSV export for ${snapshot.period}. Press Escape to cancel.`);

    exportTimer.current = setTimeout(() => {
      if (version !== exportVersion.current) return;
      try {
        const rows = [
          ["Metric", "Value", "Change"],
          ...snapshot.kpis.map((kpi) => [kpi.label, kpi.value, kpi.change]),
          [],
          ["Top segment", "Users", "Change"],
          ...snapshot.segments.map((segment) => [segment.name, segment.users, segment.change]),
        ];
        const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
        const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `signal-analytics-${range}.csv`;
        anchor.click();
        URL.revokeObjectURL(url);
        setExportState("success");
        setAnnouncement(`CSV export ready for ${snapshot.period}.`);
        exportTimer.current = setTimeout(() => setExportState("idle"), 2200);
      } catch {
        setExportState("error");
        setAnnouncement("Export failed. Use Retry export to try again.");
      }
    }, reducedMotion ? 80 : 480);
  };

  const transition = reducedMotion ? { duration: 0 } : { duration: 0.22, ease: [0.23, 1, 0.32, 1] as const };

  return (
    <div className="analytics-app" data-theme={dark ? "dark" : "light"}>
      <a className="skip-link" href="#analytics-content">Skip to analytics</a>
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand-row">
          <span className="brand-mark" aria-hidden="true"><Icon name="spark" /></span>
          <span className="brand-name">Signal</span>
        </div>
        <div className="workspace-switcher" aria-label="Current workspace">
          <span className="workspace-avatar">AO</span>
          <span><strong>Arcadia Ops</strong><small>Growth workspace</small></span>
        </div>
        <nav className="nav-list">
          <a className="nav-item is-active" href="#analytics-content" aria-current="page"><Icon name="grid" /><span>Overview</span></a>
          <a className="nav-item" href="#retention"><Icon name="chart" /><span>Retention</span></a>
          <a className="nav-item" href="#segments"><Icon name="users" /><span>Audiences</span></a>
          <a className="nav-item" href="#preferences"><Icon name="settings" /><span>Preferences</span></a>
        </nav>
        <div className="sidebar-foot" id="preferences">
          <Button className="theme-button" type="button" onClick={handleTheme} aria-pressed={dark} aria-label={`Switch to ${dark ? "light" : "dark"} theme`}>
            <Icon name={dark ? "sun" : "moon"} /><span>{dark ? "Light mode" : "Dark mode"}</span>
          </Button>
          <div className="user-row"><span className="user-avatar">MK</span><span><strong>Maya Kim</strong><small>Admin</small></span></div>
        </div>
      </aside>

      <div className="mobile-header">
        <div className="brand-row"><span className="brand-mark" aria-hidden="true"><Icon name="spark" /></span><span className="brand-name">Signal</span></div>
        <Button className="icon-button" type="button" onClick={handleTheme} aria-pressed={dark} aria-label={`Switch to ${dark ? "light" : "dark"} theme`}>
          <Icon name={dark ? "sun" : "moon"} />
        </Button>
      </div>

      <main className="dashboard-main" id="analytics-content">
        <header className="page-heading">
          <div>
            <p className="eyebrow">Product analytics</p>
            <h1>Performance overview</h1>
            <p className="page-subtitle">Health, retention, and revenue signals in one view.</p>
          </div>
          <Button className={`export-button export-${exportState}`} type="button" onClick={handleExport} aria-disabled={exportState === "pending"}>
            <Icon name={exportState === "success" ? "check" : "download"} />
            <span>{exportLabel}</span>
          </Button>
        </header>

        <section className="range-toolbar" aria-label="Report controls">
          <div className="period-copy">
            <span className="period-label">Reporting period</span>
            <strong>{snapshot.period}</strong>
          </div>
          <SegmentedControl options={RANGE_OPTIONS} label="Reporting range" value={range} onValueChange={handleRangeChange} className="range-control" />
          <div className={`sync-status is-${rangeState}`} role="status" aria-live="polite">
            <span className="status-dot" aria-hidden="true" />
            {rangeState === "updating" ? "Updating data" : "Synced just now"}
          </div>
        </section>

        <div className="sr-only" aria-live="polite">{announcement}</div>

        <motion.div
          key={range}
          className="dashboard-workspace"
          data-state={rangeState}
          aria-busy={rangeState === "updating"}
          initial={reducedMotion ? false : { opacity: 0.35, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
        >
          <section className="kpi-grid" aria-label="Key performance indicators">
            {snapshot.kpis.map((kpi, index) => (
              <article className="kpi-card" key={kpi.label}>
                <div className="kpi-topline"><span>{kpi.label}</span><span className="kpi-index">0{index + 1}</span></div>
                <div className="kpi-value-row"><strong>{kpi.value}</strong><span className={`trend trend-${kpi.trend}`}>{kpi.change}</span></div>
                <p>{kpi.note} · {snapshot.comparison}</p>
              </article>
            ))}
          </section>

          <section className="analysis-grid">
            <article className="panel chart-panel" id="retention">
              <div className="panel-heading">
                <div><p className="eyebrow">Retention</p><h2>Cohort curve</h2></div>
                <div className="chart-legend" aria-label="Chart legend"><span><i className="legend-current" />Current</span><span><i className="legend-previous" />Previous</span></div>
              </div>
              <p className="panel-description">Share of users returning after their first meaningful action.</p>
              <RetentionChart snapshot={snapshot} />
              <div className="chart-insight"><span className="insight-icon"><Icon name="spark" /></span><p><strong>{snapshot.retention.current.at(-1)}% retained at period end</strong><span>{Number(snapshot.retention.current.at(-1)) - Number(snapshot.retention.previous.at(-1)) >= 0 ? "+" : ""}{Number(snapshot.retention.current.at(-1)) - Number(snapshot.retention.previous.at(-1))} points compared with the previous period.</span></p></div>
            </article>

            <article className="panel segments-panel" id="segments">
              <div className="panel-heading"><div><p className="eyebrow">Audience</p><h2>Top segments</h2></div><span className="segment-count">3 tracked</span></div>
              <p className="panel-description">Highest-engagement groups ranked by active users.</p>
              <ol className="segment-list">
                {snapshot.segments.map((segment, index) => (
                  <li key={segment.name}>
                    <div className="segment-row"><span className="segment-rank">{String(index + 1).padStart(2, "0")}</span><div className="segment-name"><strong>{segment.name}</strong><span>{segment.description}</span></div><div className="segment-metric"><strong>{segment.users}</strong><span>{segment.change}</span></div></div>
                    <div className="segment-track" aria-label={`${segment.name}: ${segment.share} percent engagement index`}><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: segment.share / 100 }} transition={transition} /></div>
                  </li>
                ))}
              </ol>
              <a className="panel-link" href="#analytics-content">View audience report <span aria-hidden="true">↗</span></a>
            </article>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
