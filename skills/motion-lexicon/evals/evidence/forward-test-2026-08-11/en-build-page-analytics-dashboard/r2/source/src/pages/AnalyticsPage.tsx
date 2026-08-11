import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LoadingButton } from "../components/motion-lexicon/loading-button";
import { SegmentedControl } from "../components/motion-lexicon/segmented-control";

type RangeKey = "7d" | "30d" | "90d";

type DashboardData = {
  period: string;
  comparedWith: string;
  kpis: Array<{
    label: string;
    value: string;
    delta: string;
    direction: "up" | "down";
    note: string;
  }>;
  retention: Array<{ label: string; values: number[]; color: string }>;
  segments: Array<{ name: string; detail: string; rate: number; delta: string }>;
};

const RANGE_OPTIONS = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
];

const DATA: Record<RangeKey, DashboardData> = {
  "7d": {
    period: "Aug 6–12, 2026",
    comparedWith: "previous 7 days",
    kpis: [
      { label: "Active users", value: "18,420", delta: "+8.4%", direction: "up", note: "1,430 more users" },
      { label: "Activation rate", value: "47.8%", delta: "+2.1 pp", direction: "up", note: "Reached the first key action" },
      { label: "D7 retention", value: "31.4%", delta: "+1.6 pp", direction: "up", note: "Returned seven days later" },
      { label: "Sessions / user", value: "4.8", delta: "−0.3%", direction: "down", note: "72 min median total time" },
    ],
    retention: [
      { label: "All users", values: [100, 58, 46, 40, 36, 33, 31], color: "var(--chart-primary)" },
      { label: "Invited", values: [100, 67, 56, 51, 47, 44, 42], color: "var(--chart-secondary)" },
      { label: "Organic", values: [100, 51, 38, 32, 28, 25, 23], color: "var(--chart-tertiary)" },
    ],
    segments: [
      { name: "Power collaborators", detail: "3+ shared projects", rate: 68.2, delta: "+5.8 pp" },
      { name: "Team invites", detail: "Joined by invitation", rate: 52.4, delta: "+3.1 pp" },
      { name: "Template starters", detail: "Started from a template", rate: 43.7, delta: "+1.9 pp" },
      { name: "Solo explorers", detail: "No workspace members", rate: 21.6, delta: "−0.8 pp" },
    ],
  },
  "30d": {
    period: "Jul 14–Aug 12, 2026",
    comparedWith: "previous 30 days",
    kpis: [
      { label: "Active users", value: "64,280", delta: "+12.6%", direction: "up", note: "7,190 more users" },
      { label: "Activation rate", value: "45.2%", delta: "+3.4 pp", direction: "up", note: "Reached the first key action" },
      { label: "D7 retention", value: "29.7%", delta: "+2.2 pp", direction: "up", note: "Returned seven days later" },
      { label: "Sessions / user", value: "4.4", delta: "+5.1%", direction: "up", note: "68 min median total time" },
    ],
    retention: [
      { label: "All users", values: [100, 55, 43, 37, 33, 31, 30], color: "var(--chart-primary)" },
      { label: "Invited", values: [100, 64, 53, 48, 44, 42, 40], color: "var(--chart-secondary)" },
      { label: "Organic", values: [100, 48, 36, 30, 27, 24, 22], color: "var(--chart-tertiary)" },
    ],
    segments: [
      { name: "Power collaborators", detail: "3+ shared projects", rate: 65.4, delta: "+6.2 pp" },
      { name: "Team invites", detail: "Joined by invitation", rate: 49.8, delta: "+4.7 pp" },
      { name: "Template starters", detail: "Started from a template", rate: 41.2, delta: "+2.4 pp" },
      { name: "Solo explorers", detail: "No workspace members", rate: 20.3, delta: "+0.6 pp" },
    ],
  },
  "90d": {
    period: "May 15–Aug 12, 2026",
    comparedWith: "previous 90 days",
    kpis: [
      { label: "Active users", value: "174,960", delta: "+18.2%", direction: "up", note: "26,940 more users" },
      { label: "Activation rate", value: "42.6%", delta: "+4.8 pp", direction: "up", note: "Reached the first key action" },
      { label: "D7 retention", value: "27.9%", delta: "+3.6 pp", direction: "up", note: "Returned seven days later" },
      { label: "Sessions / user", value: "4.1", delta: "+6.8%", direction: "up", note: "63 min median total time" },
    ],
    retention: [
      { label: "All users", values: [100, 52, 40, 35, 31, 29, 28], color: "var(--chart-primary)" },
      { label: "Invited", values: [100, 61, 51, 45, 42, 39, 38], color: "var(--chart-secondary)" },
      { label: "Organic", values: [100, 45, 34, 29, 25, 23, 21], color: "var(--chart-tertiary)" },
    ],
    segments: [
      { name: "Power collaborators", detail: "3+ shared projects", rate: 62.9, delta: "+7.3 pp" },
      { name: "Team invites", detail: "Joined by invitation", rate: 47.1, delta: "+5.2 pp" },
      { name: "Template starters", detail: "Started from a template", rate: 38.8, delta: "+3.6 pp" },
      { name: "Solo explorers", detail: "No workspace members", rate: 19.4, delta: "+1.1 pp" },
    ],
  },
};

function ArrowIcon({ direction }: { direction: "up" | "down" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" width="12" height="12">
      <path d={direction === "up" ? "M2.5 7.7 6 4.2l3.5 3.5" : "M2.5 4.3 6 7.8l3.5-3.5"} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18" width="18" height="18">
      <path d="M13.9 11.6A6 6 0 0 1 6.4 4.1a5.4 5.4 0 1 0 7.5 7.5Z" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RetentionChart({ series }: { series: DashboardData["retention"] }) {
  const width = 680;
  const height = 280;
  const left = 42;
  const right = 16;
  const top = 16;
  const bottom = 34;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const ticks = [100, 75, 50, 25, 0];
  const x = (index: number) => left + (index / 6) * plotW;
  const y = (value: number) => top + ((100 - value) / 100) * plotH;
  const pathFor = (values: number[]) => values.map((value, index) => `${index === 0 ? "M" : "L"}${x(index)},${y(value)}`).join(" ");

  return (
    <div className="chart-wrap">
      <svg className="retention-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="retention-chart-title retention-chart-desc">
        <title id="retention-chart-title">Weekly retention by acquisition segment</title>
        <desc id="retention-chart-desc">All cohorts start at 100 percent. Invited users retain best through week six, followed by all users and organic users.</desc>
        {ticks.map((tick) => (
          <g key={tick}>
            <line className="chart-grid" x1={left} x2={width - right} y1={y(tick)} y2={y(tick)} />
            <text className="chart-label" x={left - 10} y={y(tick) + 4} textAnchor="end">{tick}%</text>
          </g>
        ))}
        {Array.from({ length: 7 }, (_, index) => (
          <text key={index} className="chart-label" x={x(index)} y={height - 8} textAnchor="middle">W{index}</text>
        ))}
        {series.map((item, seriesIndex) => (
          <g key={item.label}>
            <path className="chart-series" d={pathFor(item.values)} stroke={item.color} strokeWidth={seriesIndex === 0 ? 2.6 : 1.8} />
            {item.values.map((value, index) => (
              <circle key={index} className="chart-point" cx={x(index)} cy={y(value)} r={seriesIndex === 0 ? 3.2 : 2.7} fill="var(--color-panel)" stroke={item.color} strokeWidth="1.8" />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}

export function AnalyticsPage() {
  const reducedMotion = useReducedMotion();
  const [requestedRange, setRequestedRange] = useState<RangeKey>("30d");
  const [displayedRange, setDisplayedRange] = useState<RangeKey>("30d");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  const updateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = DATA[displayedRange];

  useEffect(() => () => {
    if (updateTimer.current) clearTimeout(updateTimer.current);
  }, []);

  const selectRange = (value: string) => {
    const next = value as RangeKey;
    if (next === requestedRange) return;
    if (updateTimer.current) clearTimeout(updateTimer.current);
    setRequestedRange(next);
    setIsUpdating(true);
    updateTimer.current = setTimeout(() => {
      setDisplayedRange(next);
      setIsUpdating(false);
    }, reducedMotion ? 40 : 320);
  };

  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    setIsDark(next);
  };

  const exportCurrentView = async () => {
    await new Promise((resolve) => setTimeout(resolve, reducedMotion ? 80 : 520));
    const rows = [
      ["Metric", "Value", "Change", "Period"],
      ...current.kpis.map((kpi) => [kpi.label, kpi.value, kpi.delta, current.period]),
      [],
      ["Segment", "D7 retention", "Change", "Definition"],
      ...current.segments.map((segment) => [segment.name, `${segment.rate}%`, segment.delta, segment.detail]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `retention-overview-${displayedRange}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="analytics-app">
      <header className="topbar">
        <a className="brand focus-target" href="/analytics" aria-label="Northstar analytics home">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>Northstar</span>
        </a>
        <div className="topbar-actions">
          <button className="icon-button" type="button" onClick={toggleTheme} aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}>
            <MoonIcon />
          </button>
          <LoadingButton
            className="min-h-11 min-w-[104px] analytics-export"
            onAction={exportCurrentView}
            pendingLabel="Preparing…"
            successLabel="Exported"
            errorLabel="Try export again"
          >
            Export CSV
          </LoadingButton>
        </div>
      </header>

      <main className="analytics-shell">
        <section className="page-heading" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">Growth intelligence</p>
            <h1 id="page-title">Retention overview</h1>
            <p className="page-subtitle">See which acquisition paths build durable product habits.</p>
          </div>
          <div className="range-control-wrap">
            <span className="control-label">Reporting range</span>
            <SegmentedControl
              className="range-control"
              label="Reporting range"
              options={RANGE_OPTIONS}
              value={requestedRange}
              onValueChange={selectRange}
            />
          </div>
        </section>

        <div className={`context-bar ${isUpdating ? "is-updating" : ""}`} role="status" aria-live="polite">
          <span className="context-dot" aria-hidden="true" />
          <span>{isUpdating ? `Updating to ${DATA[requestedRange].period}…` : `Showing ${current.period}`}</span>
          <span className="context-compare">Compared with {current.comparedWith}</span>
        </div>

        <section className="work-surface" aria-label="Retention analytics" aria-busy={isUpdating} data-updating={isUpdating || undefined}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={displayedRange}
              className="dashboard-content"
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
              animate={{ opacity: isUpdating ? 0.46 : 1, y: 0 }}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -4 }}
              transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.23, 1, 0.32, 1] }}
            >
              <section className="kpi-grid" aria-label="Key performance indicators">
                {current.kpis.map((kpi) => (
                  <article className="kpi-card" key={kpi.label}>
                    <div className="kpi-topline">
                      <h2>{kpi.label}</h2>
                      <span className={`delta ${kpi.direction}`}><ArrowIcon direction={kpi.direction} />{kpi.delta}</span>
                    </div>
                    <p className="kpi-value">{kpi.value}</p>
                    <p className="kpi-note">{kpi.note}</p>
                  </article>
                ))}
              </section>

              <section className="insights-grid">
                <article className="panel chart-panel">
                  <div className="panel-heading">
                    <div>
                      <p className="section-kicker">Cohort quality</p>
                      <h2>Weekly retention</h2>
                    </div>
                    <div className="chart-legend" aria-label="Chart legend">
                      {current.retention.map((item) => <span key={item.label}><i style={{ background: item.color }} />{item.label}</span>)}
                    </div>
                  </div>
                  <RetentionChart series={current.retention} />
                  <p className="chart-insight"><strong>Invited users lead by 10.3 pp.</strong> Collaborative entry points remain the clearest retention lever.</p>
                </article>

                <article className="panel segments-panel">
                  <div className="panel-heading">
                    <div>
                      <p className="section-kicker">D7 retention</p>
                      <h2>Top segments</h2>
                    </div>
                    <span className="panel-meta">{current.period}</span>
                  </div>
                  <ol className="segment-list">
                    {current.segments.map((segment, index) => (
                      <li key={segment.name}>
                        <div className="segment-rank" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
                        <div className="segment-main">
                          <div className="segment-row">
                            <div>
                              <h3>{segment.name}</h3>
                              <p>{segment.detail}</p>
                            </div>
                            <div className="segment-value">
                              <strong>{segment.rate}%</strong>
                              <span>{segment.delta}</span>
                            </div>
                          </div>
                          <div className="segment-track" aria-hidden="true"><i style={{ width: `${segment.rate}%` }} /></div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </article>
              </section>
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
