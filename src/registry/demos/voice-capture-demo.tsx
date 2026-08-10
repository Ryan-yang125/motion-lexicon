"use client";

import { VoiceCapture } from "@/registry/components/voice-capture";

export function VoiceCaptureDemo() {
  return (
    <div className="grid w-full max-w-[440px] place-items-center rounded-[18px] bg-[#DDD7CD] px-4 py-16 dark:bg-[#292825]">
      <VoiceCapture label="Record an idea" onSend={() => undefined} />
    </div>
  );
}
