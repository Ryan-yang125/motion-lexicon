"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { VoiceCapture } from "@/registry/components/voice-capture";

export function VoiceCaptureDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return (
    <div role="group" aria-label={demoText("voice-capture", locale)} className="grid w-full max-w-[440px] place-items-center rounded-[18px] bg-[#DDD7CD] px-4 py-16 dark:bg-[#292825]">
      <VoiceCapture
        label={demoValue(locale, "记录想法", "Record an idea")}
        recordLabel={demoValue(locale, "录制语音", "Record voice message")}
        pauseLabel={demoValue(locale, "暂停录制", "Pause recording")}
        resumeLabel={demoValue(locale, "继续录制", "Resume recording")}
        sendLabel={demoValue(locale, "发送录音", "Send recording")}
        deleteLabel={demoValue(locale, "删除录音", "Delete recording")}
        onSend={() => undefined}
      />
    </div>
  );
}
