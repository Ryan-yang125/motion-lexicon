"use client";

import { useId, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { motion, useReducedMotion } from "motion/react";

export type FileDropzoneProps = {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  onFiles: (files: File[]) => void;
  onReject?: (message: string) => void;
  className?: string;
};

function accepts(file: File, accept?: string) {
  if (!accept?.trim()) return true;
  return accept.split(",").some((value) => { const rule = value.trim().toLowerCase(); return rule.startsWith(".") ? file.name.toLowerCase().endsWith(rule) : rule.endsWith("/*") ? file.type.startsWith(rule.slice(0, -1)) : file.type === rule; });
}

export function FileDropzone({ label = "Add files", accept, multiple = true, maxFiles = 8, onFiles, onReject, className = "" }: FileDropzoneProps) {
  const reduced = useReducedMotion() === true; const inputId = useId(); const inputRef = useRef<HTMLInputElement>(null); const [dragging, setDragging] = useState(false); const [message, setMessage] = useState("Drop a file, paste, or browse.");
  const receive = (incoming: FileList | File[]) => {
    const files = Array.from(incoming); const valid = files.filter((file) => accepts(file, accept)).slice(0, multiple ? maxFiles : 1);
    if (valid.length !== files.length) { const next = `Accepted ${valid.length} of ${files.length} files.`; setMessage(next); onReject?.(next); }
    else setMessage(valid.length ? `${valid.length} file${valid.length === 1 ? "" : "s"} ready to add.` : "No supported files found.");
    if (valid.length) onFiles(valid);
  };
  const drop = (event: DragEvent<HTMLDivElement>) => { event.preventDefault(); setDragging(false); receive(event.dataTransfer.files); };
  const input = (event: ChangeEvent<HTMLInputElement>) => { if (event.target.files) receive(event.target.files); event.target.value = ""; };
  return <section aria-label={label} className={`rounded-[16px] border border-dashed p-3 transition ${dragging ? "border-[#4568FF] bg-[#edf0ff]" : "border-black/[.14] bg-[#f8f8f6]"} ${className}`}>
    <div onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false); }} onDrop={drop} onPaste={(event) => { const files = event.clipboardData.files; if (files.length) { event.preventDefault(); receive(files); } }} tabIndex={0} className="flex min-h-[170px] flex-col items-center justify-center rounded-[11px] bg-white px-5 text-center outline-none focus-visible:ring-2 focus-visible:ring-[#4568FF]">
      <motion.span animate={reduced ? { y: 0 } : { y: dragging ? -4 : 0 }} className="grid size-11 place-items-center rounded-full bg-[#242424] text-xl text-white">↑</motion.span><h3 className="mt-4 text-[14px] font-medium text-[#292929]">{label}</h3><p role="status" className="mt-1 text-[12px] text-neutral-500">{message}</p>
      <input ref={inputRef} id={inputId} type="file" accept={accept} multiple={multiple} onChange={input} className="sr-only" /><label htmlFor={inputId} className="mt-4 inline-flex min-h-11 cursor-pointer items-center rounded-full border border-black/[.12] px-4 text-[12px] font-medium text-[#292929] transition hover:bg-neutral-50">Browse files</label>
    </div>
  </section>;
}
