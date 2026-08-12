"use client";

import type { DemoLocaleProps } from "../demo-locale";
import { ProductLandingBlock } from "@/registry/blocks/product-landing";

export function ProductLandingDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <ProductLandingBlock locale={locale} />;
}
