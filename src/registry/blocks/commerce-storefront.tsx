"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { AddToCartMorph } from "@/registry/components/add-to-cart-morph";
import { AnimatedCombobox } from "@/registry/components/animated-combobox";
import { CinematicHero } from "@/registry/components/cinematic-hero";
import {
  MediaCarousel,
  type MediaCarouselItem,
} from "@/registry/components/media-carousel";
import { PricingCalculator } from "@/registry/components/pricing-calculator";

type Locale = "zh" | "en";
export type CommerceStorefrontBlockProps = {
  locale?: Locale;
  className?: string;
};

function ProductArt({ shade, label }: { shade: string; label: string }) {
  return (
    <div className={`relative size-full overflow-hidden ${shade}`}>
      <i className="absolute left-[15%] top-[10%] h-[76%] w-[39%] rounded-[48%_48%_18%_18%] bg-white/80 shadow-[20px_28px_30px_-24px_rgba(35,26,20,.65)]" />
      <i className="absolute right-[14%] top-[22%] size-[30%] rounded-full border-[10px] border-[#604939]/75" />
      <span className="absolute bottom-4 left-4 font-mono text-[9px] tracking-[.16em] text-[#543f30]/75">
        {label}
      </span>
    </div>
  );
}

export function CommerceStorefrontBlock({
  locale = "en",
  className = "",
}: CommerceStorefrontBlockProps) {
  const reduced = useReducedMotion() === true;
  const [notice, setNotice] = useState("");
  const c = locale === "zh" ? zh : en;
  const media: MediaCarouselItem[] = [
    {
      id: "sand",
      eyebrow: c.material,
      title: c.materialTitle,
      description: c.materialBody,
      meta: "01",
      art: <ProductArt shade="bg-[#d9bd9a]" label="SAND / 01" />,
    },
    {
      id: "blue",
      eyebrow: c.detail,
      title: c.detailTitle,
      description: c.detailBody,
      meta: "02",
      art: <ProductArt shade="bg-[#9ab6c7]" label="TIDE / 02" />,
    },
    {
      id: "clay",
      eyebrow: c.care,
      title: c.careTitle,
      description: c.careBody,
      meta: "03",
      art: <ProductArt shade="bg-[#d49372]" label="CLAY / 03" />,
    },
  ];
  return (
    <section
      data-page-block="commerce-storefront"
      className={`w-full overflow-hidden rounded-[18px] bg-[#f7f1e8] text-[#342820] shadow-[0_24px_60px_-45px_rgba(58,37,22,.6)] ${className}`}
    >
      <header className="flex min-h-16 items-center justify-between border-b border-[#785d49]/15 px-5 sm:px-8">
        <a
          href="#store-top"
          className="min-h-11 py-3 font-serif text-[22px] tracking-[-.06em] outline-none focus-visible:ring-2 focus-visible:ring-[#4568ff]"
        >
          Serein
        </a>
        <div className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-[.14em] text-[#806a58]">
          <a className="hidden min-h-11 items-center sm:flex" href="#details">
            {c.details}
          </a>
          <span>{notice || c.cart}</span>
        </div>
      </header>
      <div id="store-top">
        <div className="grid gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:px-12 lg:py-16">
          <div className="order-2 lg:order-1">
            <p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#a17252]">
              {c.kicker}
            </p>
            <h1 className="mt-4 max-w-[8ch] font-serif text-[clamp(48px,7vw,82px)] leading-[.84] tracking-[-.075em]">
              {c.title}
            </h1>
            <p className="mt-6 max-w-md text-[14px] leading-6 text-[#765e4d]">
              {c.body}
            </p>
            <div className="mt-7 flex gap-4 text-[10px] text-[#765e4d]">
              <span>01 / 04</span>
              <span>{c.ship}</span>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <CinematicHero
              eyebrow={c.edition}
              title={c.product}
              description={c.body}
              actionLabel={c.details}
              onAction={() =>
                document
                  .getElementById("details")
                  ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" })
              }
              art={<ProductArt shade="bg-[#c9a77e]" label="SEREIN / 2026" />}
            />
          </div>
        </div>
        <div
          id="details"
          className="grid gap-6 border-y border-[#785d49]/15 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,.95fr)] lg:px-12"
        >
          <MediaCarousel
            items={media}
            label={c.details}
            className="bg-[#fffaf3]"
          />
          <aside className="grid content-start gap-5">
            <AddToCartMorph
              product={c.product}
              price="$128 · VAT included"
              image="/og-home-en.png"
              imageAlt={c.product}
              label={c.edition}
              onAdd={() => setNotice(c.added)}
            />
            <AnimatedCombobox
              label={c.details}
              placeholder={c.email}
              options={[
                {
                  id: "standard",
                  label: "Standard delivery",
                  detail: "2–4 days",
                },
                {
                  id: "express",
                  label: "Express delivery",
                  detail: "Tomorrow",
                },
                {
                  id: "studio",
                  label: "Studio pickup",
                  detail: "By appointment",
                },
              ]}
              onChange={(option) => setNotice(option ? option.label : "")}
            />
            <div className="rounded-[15px] border border-[#785d49]/15 bg-[#eee1d0] p-4">
              <p className="font-mono text-[9px] uppercase tracking-[.15em] text-[#806a58]">
                {c.formLabel}
              </p>
              <label className="mt-4 block text-[11px] font-medium">
                {c.email}
                <input
                  className="mt-2 min-h-11 w-full rounded-lg border border-[#785d49]/20 bg-white/70 px-3 text-[12px] outline-none focus-visible:ring-2 focus-visible:ring-[#4568ff]"
                  type="email"
                  placeholder="you@example.com"
                />
              </label>
              <button
                type="button"
                onClick={() => setNotice(c.joined)}
                className="mt-3 min-h-11 w-full rounded-lg bg-[#382920] text-[11px] font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-[#4568ff]"
              >
                {c.join}
              </button>
            </div>
          </aside>
        </div>
        <div className="px-5 py-10 sm:px-8 lg:px-12">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[.15em] text-[#a17252]">
                Studio program
              </p>
              <h2 className="mt-2 font-serif text-[31px] tracking-[-.055em]">
                {c.program}
              </h2>
            </div>
            <p className="max-w-xs text-[11px] leading-5 text-[#765e4d]">
              {c.programBody}
            </p>
          </div>
          <PricingCalculator
            tiers={[
              { id: "studio", label: c.tiers[0], unitPrice: 18 },
              { id: "atelier", label: c.tiers[1], unitPrice: 32 },
              { id: "retail", label: c.tiers[2], unitPrice: 54 },
            ]}
            currency="USD"
            label={c.calculator}
            className="max-w-xl"
          />
        </div>
        <footer className="border-t border-[#785d49]/15 px-5 py-6 text-center font-serif text-[22px] tracking-[-.05em] sm:px-8">
          {c.footer}
          <motion.span
            animate={reduced ? undefined : { opacity: [1, 0.45, 1] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            className="ml-2 text-[#bd7044]"
          >
            ✦
          </motion.span>
        </footer>
      </div>
    </section>
  );
}

const en = {
  cart: "Cart / 0",
  added: "Cart / 1",
  joined: "You are on the list",
  kicker: "Object 04 · a quiet daily tool",
  title: "A vessel for the everyday.",
  body: "Hand-finished stoneware designed to make ordinary rituals feel deliberately yours.",
  ship: "Ships in 2–4 days",
  details: "The object",
  material: "Material",
  materialTitle: "Pale stoneware",
  materialBody: "A warm matte body with a hand-finished rim.",
  detail: "Detail",
  detailTitle: "Balanced by hand",
  detailBody: "A low, weighted base keeps the pour steady.",
  care: "Care",
  careTitle: "Made for use",
  careBody: "Dishwasher safe. Each glaze carries its own variation.",
  product: "Tide carafe",
  edition: "Small-batch edition",
  formLabel: "Studio letters",
  email: "Email address",
  join: "Join the list",
  program: "For places that pour with intention.",
  programBody:
    "Configure a studio order for cafés, restaurants, and considered retail spaces.",
  calculator: "Trade pricing",
  tiers: ["12 pieces", "24 pieces", "48 pieces"],
  footer: "Made slowly, used daily.",
};
const zh: typeof en = {
  cart: "购物袋 / 0",
  added: "购物袋 / 1",
  joined: "已加入名单",
  kicker: "物件 04 · 安静的日常工具",
  title: "盛放日常的器物。",
  body: "手工完成的炻器，让每天重复的仪式变得更贴近自己。",
  ship: "2–4 天内发货",
  details: "这件器物",
  material: "材质",
  materialTitle: "浅色炻器",
  materialBody: "温暖的哑光器身，边缘由手工完成。",
  detail: "细节",
  detailTitle: "手感平衡",
  detailBody: "低重心底座让每次倾倒保持稳定。",
  care: "护理",
  careTitle: "为使用而造",
  careBody: "可放入洗碗机，每道釉色都保留自己的变化。",
  product: "潮汐水壶",
  edition: "小批量版",
  formLabel: "工作室来信",
  email: "邮箱地址",
  join: "加入名单",
  program: "为讲究倒酒的空间而做。",
  programBody: "为咖啡馆、餐厅和审美零售空间配置工作室订单。",
  calculator: "商用定价",
  tiers: ["12 件", "24 件", "48 件"],
  footer: "缓慢制作，天天使用。",
};
