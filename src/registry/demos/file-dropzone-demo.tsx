"use client";

import { useState } from "react";
import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { FileDropzone } from "@/registry/components/file-dropzone";

export function FileDropzoneDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [files, setFiles] = useState<File[]>([]);
  return <div className="rounded-[18px] bg-[#eceee9] p-3"><FileDropzone label={demoValue(locale, "添加项目素材", "Add project files")} accept="image/*,.pdf" onFiles={(next) => setFiles((current) => [...current, ...next])} />{files.length ? <p className="mt-2 px-2 font-mono text-[10px] text-neutral-500">{files.map((file) => file.name).join(" · ")}</p> : null}</div>;
}
