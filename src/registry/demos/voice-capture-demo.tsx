"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { VoiceCapture } from "@/registry/components/voice-capture";

export function VoiceCaptureDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return (
    <div role="group" aria-label={demoText("voice-capture", locale)} className="w-full max-w-[440px] rounded-[18px] bg-[#f3f5f8] p-4 dark:bg-[#101318]">
      <div className="mb-12 grid grid-cols-[1fr_auto] items-end gap-4"><div><p className="font-mono text-[9px] uppercase tracking-[.16em] text-neutral-500">Voice note / 02</p><h3 className="mt-2 max-w-[250px] text-[20px] font-medium leading-tight tracking-[-.035em]">{demoValue(locale, "把想法留给下一个工作回合", "Leave the thought for the next work session")}</h3></div><span className="grid size-10 place-items-center rounded-full bg-[#2457d6] text-[10px] font-semibold text-white">ML</span></div>
      <VoiceCapture
        label={demoValue(locale, "描述你要构建的界面", "Describe the interface to build")}
        recordLabel={demoValue(locale, "给 Agent 语音指令", "Record an agent instruction")}
        pauseLabel={demoValue(locale, "暂停录制", "Pause recording")}
        resumeLabel={demoValue(locale, "继续录制", "Resume recording")}
        recordingLabel={demoValue(locale, "正在录制", "Recording")}
        pausedLabel={demoValue(locale, "录制已暂停", "Recording paused")}
        sendLabel={demoValue(locale, "发送给 Agent", "Send to agent")}
        deleteLabel={demoValue(locale, "删除录音", "Delete recording")}
        onSend={() => undefined}
      />
    </div>
  );
}
