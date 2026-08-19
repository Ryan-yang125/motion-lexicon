"use client";

import type { DemoLocaleProps } from "../demo-locale";
import { CommerceStorefrontBlock } from "@/registry/blocks/commerce-storefront";

export function CommerceStorefrontDemo({ locale = "en" }: DemoLocaleProps = {}) { return <CommerceStorefrontBlock locale={locale} />; }
