"use client";

import { DiffReview } from "@/registry/components/diff-review";
import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

export function DiffReviewDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const zh = locale === "zh";
  return <div role="group" aria-label={demoText("diff-review", locale)} className="mx-auto w-full max-w-[620px]"><DiffReview title={demoValue(locale, "Agent 提出的组件调整", "Agent-proposed component edits")} acceptLabel={demoValue(locale, "接受", "Accept")} rejectLabel={demoValue(locale, "拒绝", "Reject")} editsLabel={(count) => demoValue(locale, `${count} 项修改`, `${count} edits`)} acceptAllLabel={demoValue(locale, "全部接受", "Accept all")} fieldLabel={demoValue(locale, "字段", "Field")} beforeLabel={demoValue(locale, "修改前", "Before")} afterLabel={demoValue(locale, "修改后", "After")} decisionLabel={demoValue(locale, "决定", "Decision")} acceptedLabel={demoValue(locale, "已接受", "Accepted")} rejectedLabel={demoValue(locale, "已拒绝", "Rejected")} reviewedLabel={(decided, total) => demoValue(locale, `已审阅 ${decided}/${total}`, `${decided}/${total} reviewed`)} changes={[
    { id: "1", field: zh ? "状态标签" : "Status label", before: zh ? "处理中" : "Processing", after: zh ? "正在核对来源" : "Checking sources" },
    { id: "2", field: zh ? "圆角" : "Radius", before: "20px", after: "14px" },
    { id: "3", field: zh ? "完成反馈" : "Completion", before: zh ? "成功" : "Success", after: zh ? "已发布预览" : "Preview published" },
  ]} /></div>;
}
