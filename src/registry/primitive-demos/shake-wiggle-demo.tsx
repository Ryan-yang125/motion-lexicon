import { useState } from "react";
import { ShakeWigglePrimitive } from "@/registry/primitives/shake-wiggle";
import { PrimitiveDemoSurface, ProductButton, ProductPanel, numberValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function ShakeWiggleDemo({ locale, values, compact }: PrimitiveDemoProps) {
  const [attempt, setAttempt] = useState(0);
  return (
    <PrimitiveDemoSurface label={textFor(locale, "登录工作区", "Sign in to workspace")} meta="error" compact={compact}>
      <div className="grid h-full place-items-center"><ProductPanel className="w-full max-w-[300px] p-4"><label className="text-[9px] font-medium text-stone-400">{textFor(locale, "密码", "PASSWORD")}</label><ShakeWigglePrimitive trigger={attempt} distance={numberValue(values, "distance", 10)} cycles={numberValue(values, "cycles", 3)} duration={numberValue(values, "duration", 240) / 1000}><input aria-label={textFor(locale, "密码", "Password")} defaultValue="incorrect" type="password" className="mt-1.5 h-9 w-full rounded-[8px] border border-[#8A4A3A]/45 bg-[#8A4A3A]/5 px-3 text-[11px] outline-none" /><span className="mt-1.5 block text-[9.5px] text-[#8A4A3A]">{textFor(locale, "密码不正确", "Incorrect password")}</span></ShakeWigglePrimitive>{!compact ? <ProductButton tone="dark" className="mt-3 w-full" onClick={() => setAttempt((value) => value + 1)}>{textFor(locale, "继续", "Continue")}</ProductButton> : null}</ProductPanel></div>
    </PrimitiveDemoSurface>
  );
}
