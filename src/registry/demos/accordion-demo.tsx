"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { Accordion } from "@/registry/components/accordion";

const SIZES_EN = [
  "XS — 44cm chest, 66cm length",
  "S — 48cm chest, 68cm length",
  "M — 52cm chest, 70cm length",
  "L — 56cm chest, 72cm length",
  "XL — 60cm chest, 74cm length",
  "2XL — 64cm chest, 76cm length",
  "3XL — 68cm chest, 78cm length",
];

const SIZES_ZH = [
  "XS — 胸围 44cm，衣长 66cm",
  "S — 胸围 48cm，衣长 68cm",
  "M — 胸围 52cm，衣长 70cm",
  "L — 胸围 56cm，衣长 72cm",
  "XL — 胸围 60cm，衣长 74cm",
  "2XL — 胸围 64cm，衣长 76cm",
  "3XL — 胸围 68cm，衣长 78cm",
];

export function AccordionDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const sizes = locale === "zh" ? SIZES_ZH : SIZES_EN;
  const items = [
    { id: "shipping", title: demoValue(locale, "配送", "Shipping"), meta: demoValue(locale, "3 个区域", "3 zones"), content: <p>{demoValue(locale, "标准配送需要两到四个工作日。当地时间下午 2 点前下单，当天出库。", "Standard delivery lands in two to four working days. Orders placed before 2pm local time leave the warehouse the same day.")}</p> },
    { id: "returns", title: demoValue(locale, "退货", "Returns"), meta: demoValue(locale, "30 天", "30 days"), content: <p>{demoValue(locale, "未穿着商品可在 30 天内退回。", "Send anything back unworn within 30 days. ")}<a href="#returns" className="text-ink underline underline-offset-2">{demoValue(locale, "查看完整政策", "Read the full policy")}</a></p> },
    { id: "sizing", title: demoValue(locale, "尺码", "Sizing"), content: <ul className="space-y-1 tabular-nums">{sizes.map((size) => <li key={size}>{size}</li>)}</ul> },
  ];
  return (
    <div role="group" aria-label={demoText("accordion", locale)} className="mx-auto flex h-[248px] w-full max-w-[440px] items-start">
      <Accordion
        type="single"
        items={items}
        defaultOpen={["shipping"]}
        maxPanelHeight={132}
        className="w-full"
      />
    </div>
  );
}
