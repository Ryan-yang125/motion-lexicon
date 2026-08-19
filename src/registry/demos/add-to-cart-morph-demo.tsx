"use client";

import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { AddToCartMorph } from "@/registry/components/add-to-cart-morph";

export function AddToCartMorphDemo({ locale = "en" }: DemoLocaleProps = {}) { return <AddToCartMorph label={demoValue(locale, "版本 06", "Edition 06")} product={demoValue(locale, "沿海读本", "Coastal reader")} price="$32.00" image="/assets/editorial/cart-book.jpg" imageAlt={demoValue(locale, "一本放在桌上的书", "A book resting on a table")} />; }
