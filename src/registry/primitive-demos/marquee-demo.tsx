import { MarqueePrimitive } from "@/registry/primitives/marquee";
import { PrimitiveDemoSurface, Avatar, numberValue, booleanValue, stringValue, textFor, type PrimitiveDemoProps } from "./_shared";

const people = [{ initials: "MS", name: "Mira", tone: "clay" }, { initials: "AK", name: "Aki", tone: "moss" }, { initials: "RY", name: "Ryan", tone: "blue" }, { initials: "LN", name: "Lina", tone: "stone" }] as const;

export function MarqueeDemo({ locale, values, compact }: PrimitiveDemoProps) {
  return (
    <PrimitiveDemoSurface label={textFor(locale, "在线成员", "People online")} meta="marquee" compact={compact}>
      <div className="grid h-full place-items-center"><div className="w-full max-w-[350px] overflow-hidden rounded-[12px] border border-stone-200 bg-white py-3 dark:border-white/[0.1] dark:bg-[#1E1E1B]"><MarqueePrimitive duration={numberValue(values, "duration", 8000) / 1000} gap={numberValue(values, "gap", 32)} direction={stringValue(values, "direction", "left") as "left" | "right"} pauseOnHover={booleanValue(values, "pauseOnHover", true)} trackClassName="px-3"><>{people.map((person) => <span className="flex min-w-[110px] items-center gap-2" key={person.name}><Avatar initials={person.initials} tone={person.tone} /><span><strong className="block text-[10.5px]">{person.name}</strong><i className="text-[9px] not-italic text-[#55745D]">● {textFor(locale, "在线", "online")}</i></span></span>)}</></MarqueePrimitive></div></div>
    </PrimitiveDemoSurface>
  );
}
