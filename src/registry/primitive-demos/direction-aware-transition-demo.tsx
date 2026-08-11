import { useState } from "react";
import { DirectionAwareTransitionPrimitive, type NavigationDirection } from "@/registry/primitives/direction-aware-transition";
import { PrimitiveDemoSurface, ProductButton, ProductPanel, easingValue, numberValue, stringValue, textFor, type PrimitiveDemoProps } from "./_shared";

const opposite: Record<NavigationDirection, NavigationDirection> = {
  left: "right",
  right: "left",
  up: "down",
  down: "up",
};

export function DirectionAwareTransitionDemo({ locale, values, compact }: PrimitiveDemoProps) {
  const steps = locale === "zh" ? ["详情", "权限", "确认"] : ["Details", "Access", "Review"];
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<NavigationDirection>("left");
  const preferredDirection = stringValue(values, "direction", "left") as NavigationDirection;
  const move = (next: number) => {
    setDirection(next > step ? preferredDirection : opposite[preferredDirection]);
    setStep(next);
  };
  return (
    <PrimitiveDemoSurface label={textFor(locale, "创建工作区", "Create workspace")} meta={`${step + 1}/3`} compact={compact}>
      <div className="grid h-full place-items-center">
        <ProductPanel className="w-full max-w-[330px] overflow-hidden p-3">
          <div className="mb-3 flex gap-1">{steps.map((_, index) => <i className={`h-1 flex-1 rounded-full ${index <= step ? "bg-stone-800 dark:bg-stone-200" : "bg-stone-200 dark:bg-white/[0.1]"}`} key={index} />)}</div>
          <div className="h-16 overflow-hidden"><DirectionAwareTransitionPrimitive stateKey={step} direction={direction} distance={numberValue(values, "distance", 40)} duration={numberValue(values, "duration", 240) / 1000} easing={easingValue(values, "ease", "soft")}><strong className="block text-[12px]">{steps[step]}</strong><p className="mt-1 text-[10px] text-stone-400">{textFor(locale, "完成当前信息后继续", "Complete this step to continue")}</p></DirectionAwareTransitionPrimitive></div>
          {!compact ? <div className="flex justify-between"><ProductButton disabled={step === 0} onClick={() => move(Math.max(0, step - 1))}>{textFor(locale, "上一步", "Back")}</ProductButton><ProductButton tone="dark" onClick={() => move((step + 1) % steps.length)}>{textFor(locale, "继续", "Continue")}</ProductButton></div> : null}
        </ProductPanel>
      </div>
    </PrimitiveDemoSurface>
  );
}
