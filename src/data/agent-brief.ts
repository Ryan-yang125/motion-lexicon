import type { Locale } from "./types";

export type AgentBriefInput = {
  locale: Locale;
  kind: "block" | "component" | "primitive";
  id: string;
  name: string;
  description: string;
  behavior?: string;
  previewUrl: string;
  registryUrl?: string;
};

export function buildAgentBrief(input: AgentBriefInput) {
  if (input.locale === "zh") {
    return [
      `请在当前项目中使用 Motion Lexicon 的「${input.name}」完成界面实现。`,
      "",
      `条目：${input.id}`,
      `类型：${input.kind}`,
      `预览：${input.previewUrl}`,
      input.registryUrl ? `源码：${input.registryUrl}` : "",
      "",
      `目标：${input.description}`,
      input.behavior ? `核心行为：${input.behavior}` : "",
      "",
      "实现要求：",
      "- 先查看预览和源码，再结合当前项目的结构与视觉语言完成适配。",
      "- 保留核心状态变化、动效连续性和视觉重心。",
      "- 覆盖键盘操作、焦点状态、手机布局、深色模式和 prefers-reduced-motion。",
      "- 使用当前项目已有依赖与组件，交付可运行结果并完成浏览器验收。",
    ].filter(Boolean).join("\n");
  }

  return [
    `Use Motion Lexicon's “${input.name}” to implement this interface in the current project.`,
    "",
    `Item: ${input.id}`,
    `Type: ${input.kind}`,
    `Preview: ${input.previewUrl}`,
    input.registryUrl ? `Source: ${input.registryUrl}` : "",
    "",
    `Goal: ${input.description}`,
    input.behavior ? `Core behavior: ${input.behavior}` : "",
    "",
    "Requirements:",
    "- Inspect the preview and source, then adapt them to the current project structure and visual language.",
    "- Preserve the core state changes, motion continuity, and visual hierarchy.",
    "- Cover keyboard input, focus, mobile layout, dark mode, and prefers-reduced-motion.",
    "- Reuse the project's existing dependencies and components, deliver a working result, and verify it in a browser.",
  ].filter(Boolean).join("\n");
}
