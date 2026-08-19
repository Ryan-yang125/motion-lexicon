"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useState } from "react";
import { Drawer } from "@/registry/components/drawer";

const FIELD =
  "h-10 w-full rounded-[10px] border-2 border-stone-200 bg-stone-100/70 px-3 text-[13px] text-stone-700 shadow-[inset_0_1px_2px_rgba(28,25,23,0.07)] outline-none transition-[border-color,background-color,box-shadow] duration-150 placeholder:text-stone-400 focus:border-[#4568FF] focus:bg-white focus:shadow-none dark:border-white/[0.08] dark:bg-[#1D1D1A] dark:text-stone-200 dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.45)] dark:placeholder:text-stone-500 dark:focus:border-[#93B0FF] dark:focus:bg-[#252522]";

const LABEL =
  "block text-[11px] font-medium uppercase tracking-[0.06em] text-stone-400 dark:text-stone-500";

export function DrawerDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [open, setOpen] = useState(false);

  return (
    <div role="group" aria-label={demoText("drawer", locale)} className="grid w-full place-items-center rounded-[16px] bg-[#eff4f2] p-8">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mat-cap press h-9 rounded-[9px] px-3.5 text-[13px] font-medium text-ink"
      >
        {demoValue(locale, "编辑资料", "Edit profile")}
      </button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        width={420}
        title={demoValue(locale, "编辑资料", "Edit profile")}
        description={demoValue(locale, "工作区所有成员可见", "Visible to everyone in the workspace")}
        closeLabel={demoValue(locale, "关闭面板", "Close panel")}
        hint={locale === "zh" ? "按 Escape 关闭面板，或将手柄拖向边缘。" : undefined}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-8 rounded-[8px] border border-stone-200 px-3 text-[12.5px] font-medium text-stone-700 outline-none transition-colors duration-150 hover:bg-stone-100 focus-visible:border-[#4568FF] dark:border-white/[0.16] dark:text-stone-200 dark:hover:bg-white/10 dark:focus-visible:border-[#93B0FF]"
            >
              {demoValue(locale, "取消", "Cancel")}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-8 rounded-[8px] bg-stone-800 px-3 text-[12.5px] font-medium text-white outline-none transition-colors duration-150 hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
            >
              {demoValue(locale, "保存更改", "Save changes")}
            </button>
          </div>
        }
      >
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1.5">
            <label htmlFor="drawer-name" className={LABEL}>
              {demoValue(locale, "显示名称", "Display name")}
            </label>
            <input
              id="drawer-name"
              defaultValue="Mira Sandoval"
              className={FIELD}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="drawer-role" className={LABEL}>
              {demoValue(locale, "角色", "Role")}
            </label>
            <select id="drawer-role" defaultValue="design" className={FIELD}>
              <option value="design">{demoValue(locale, "设计", "Design")}</option>
              <option value="eng">{demoValue(locale, "工程", "Engineering")}</option>
              <option value="ops">{demoValue(locale, "运营", "Operations")}</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="drawer-email" className={LABEL}>
              {demoValue(locale, "邮箱", "Email")}
            </label>
            <input
              id="drawer-email"
              type="email"
              defaultValue="mira@studio.co"
              className={FIELD}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="drawer-bio" className={LABEL}>
              {demoValue(locale, "简介", "About")}
            </label>
            <textarea
              id="drawer-bio"
              rows={4}
              defaultValue={demoValue(locale, "主要从事住宅室内设计，目前在里斯本翻修一栋 1930 年代的联排住宅。", "Interiors, mostly residential. Currently rebuilding a 1930s terrace in Lisbon.")}
              className={`${FIELD} h-auto resize-none py-2.5 leading-relaxed`}
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2.5 text-[12.5px] text-stone-600 dark:text-stone-300">
            <input
              type="checkbox"
              defaultChecked
              className="size-3.5 rounded-[5px] accent-[#4568FF]"
            />
            {demoValue(locale, "向团队成员显示我的当地时间", "Show my local time to teammates")}
          </label>
        </form>
      </Drawer>
    </div>
  );
}
