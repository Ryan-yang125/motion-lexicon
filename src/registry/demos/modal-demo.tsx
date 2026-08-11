"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Modal } from "@/registry/components/modal";

const EASE = [0.23, 1, 0.32, 1] as const;

export function ModalDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [open, setOpen] = useState(false);
  const [working, setWorking] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const confirm = () => {
    setWorking(true);
    timers.current.push(
      setTimeout(() => {
        setWorking(false);
        setOpen(false);
      }, 900),
    );
  };

  return (
    <div role="group" aria-label={demoText("modal", locale)} className="grid w-full place-items-center">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mat-cap press h-9 rounded-[9px] px-3.5 text-[13px] font-medium text-ink"
      >
        {demoValue(locale, "删除项目", "Delete project")}
      </button>

      <Modal
        open={open}
        onClose={() => (working ? undefined : setOpen(false))}
        initialFocusRef={cancelRef}
        closeOnBackdrop={!working}
        closeOnEscape={!working}
        title={demoValue(locale, "删除 atlas-edge？", "Delete atlas-edge?")}
        description={demoValue(locale, "项目、部署和域名都会移除。此操作无法撤销。", "This removes the project, its deployments and its domains. It cannot be undone.")}
        footer={
          <>
            <button
              ref={cancelRef}
              type="button"
              onClick={() => setOpen(false)}
              className="h-8 rounded-[8px] border border-stone-200 px-3 text-[12.5px] font-medium text-stone-700 outline-none transition-colors duration-150 hover:bg-stone-100 focus-visible:border-[#4568FF] dark:border-white/[0.16] dark:text-stone-200 dark:hover:bg-white/10 dark:focus-visible:border-[#93B0FF]"
            >
              {demoValue(locale, "取消", "Cancel")}
            </button>
            <button
              type="button"
              onClick={confirm}
              className="grid h-8 place-items-center rounded-[8px] bg-stone-800 px-3 text-[12.5px] font-medium text-white outline-none transition-colors duration-150 hover:bg-stone-700 focus-visible:shadow-[inset_0_0_0_1px_#93B0FF] dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white focus-visible:dark:shadow-[inset_0_0_0_1px_#4568FF]"
            >
              <span aria-hidden className="invisible col-start-1 row-start-1">
                {demoValue(locale, "删除中", "Deleting")}
              </span>
              <motion.span
                aria-hidden
                className="col-start-1 row-start-1"
                initial={false}
                animate={{ opacity: working ? 0 : 1 }}
                transition={{ duration: 0.16, ease: EASE }}
              >
                {demoValue(locale, "删除", "Delete")}
              </motion.span>
              <motion.span
                aria-hidden
                className="col-start-1 row-start-1"
                initial={false}
                animate={{ opacity: working ? 1 : 0 }}
                transition={{ duration: 0.16, ease: EASE }}
              >
                {demoValue(locale, "删除中", "Deleting")}
              </motion.span>
              <span className="sr-only">{working ? demoValue(locale, "删除中", "Deleting") : demoValue(locale, "删除", "Delete")}</span>
            </button>
          </>
        }
      >
        <p className="text-stone-500 dark:text-stone-400">
          {demoValue(locale, "关联了四个部署和一个自定义域名。", "Four deployments and one custom domain are attached.")}
        </p>
      </Modal>
    </div>
  );
}
