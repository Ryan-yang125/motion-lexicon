"use client";

import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { AnimatedTestimonials } from "@/registry/components/animated-testimonials";

export function AnimatedTestimonialsDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <AnimatedTestimonials label={demoValue(locale, "客户声音", "In their words")} testimonials={[
    { id: "mara", quote: demoValue(locale, "每一个过渡都有来处，也有明确的停靠点。", "Every transition has an origin and a place to land."), name: "Mara Ko", role: demoValue(locale, "产品设计负责人", "Head of Product Design"), company: "Lumen", portrait: "/assets/editorial/testimonial-mara.jpg", portraitAlt: demoValue(locale, "Mara 的肖像", "Portrait of Mara") },
    { id: "jon", quote: demoValue(locale, "我们把它装进产品当天，团队就开始用它讨论体验。", "The day we installed it, the team had a clearer language for experience."), name: "Jon Bell", role: demoValue(locale, "创始工程师", "Founding engineer"), company: "Northline", portrait: "/assets/editorial/testimonial-jon.jpg", portraitAlt: demoValue(locale, "Jon 的肖像", "Portrait of Jon") },
    { id: "ayla", quote: demoValue(locale, "它足够有个性，也留出了我们自己的品牌空间。", "It carries character while leaving room for our own brand."), name: "Ayla Reed", role: demoValue(locale, "创意总监", "Creative Director"), company: "Paloma", portrait: "/assets/editorial/testimonial-ayla.jpg", portraitAlt: demoValue(locale, "Ayla 的肖像", "Portrait of Ayla") },
  ]} />;
}
