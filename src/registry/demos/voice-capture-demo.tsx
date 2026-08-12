"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { VoiceCapture } from "@/registry/components/voice-capture";

export function VoiceCaptureDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return (
    <div role="group" aria-label={demoText("voice-capture", locale)} className="grid w-full max-w-[440px] place-items-center rounded-[10px] border border-stone-200 bg-[#f5f5f5] px-4 py-16 dark:border-white/[0.12] dark:bg-[#181818]">
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
