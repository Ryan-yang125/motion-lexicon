"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import {
  SortableTable,
  type SortableColumn,
} from "@/registry/components/sortable-table";

type Reviewer = {
  id: string;
  name: string;
  open: number;
  seen: string;
  ago: number;
};

const REVIEWERS: Reviewer[] = [
  { id: "r1", name: "Priya Raman", open: 12, seen: "2h ago", ago: 120 },
  { id: "r2", name: "Marco Silva", open: 3, seen: "1d ago", ago: 1440 },
  { id: "r3", name: "Ada Okonjo", open: 21, seen: "18m ago", ago: 18 },
  { id: "r4", name: "Tom Beckett", open: 7, seen: "4d ago", ago: 5760 },
  { id: "r5", name: "Lena Fischer", open: 15, seen: "6h ago", ago: 360 },
  { id: "r6", name: "Noah Kim", open: 1, seen: "9h ago", ago: 540 },
];

export function SortableTableDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const columns: SortableColumn<Reviewer>[] = [
    { id: "name", header: demoValue(locale, "评审者", "Reviewer"), value: (row) => row.name },
    { id: "open", header: demoValue(locale, "待处理", "Open"), width: "72px", align: "end", numeric: true, value: (row) => row.open },
    { id: "seen", header: demoValue(locale, "最近在线", "Last seen"), width: "96px", align: "end", value: (row) => row.ago, cell: (row) => locale === "zh" ? row.seen.replace(" ago", "前").replace("h", "小时").replace("d", "天").replace("m", "分钟") : row.seen },
  ];
  return (
    <div role="group" aria-label={demoText("sortable-table", locale)} className="mx-auto w-full max-w-[440px]">
      <SortableTable
        label={demoValue(locale, "评审者", "Reviewers")}
        rows={REVIEWERS}
        getRowId={(r) => r.id}
        getRowLabel={(r) => r.name}
        markable
        markLabel={demoValue(locale, "关注", "Follow")}
        markRowLabel={locale === "zh" ? (name) => `关注 ${name}` : undefined}
        sortStatus={locale === "zh" ? (header, direction, count) => header && direction ? `已按${header}${direction === "asc" ? "升序" : "降序"}排列，共 ${count} 行。` : `已恢复原始顺序，共 ${count} 行。` : undefined}
        columns={columns}
      />
    </div>
  );
}
