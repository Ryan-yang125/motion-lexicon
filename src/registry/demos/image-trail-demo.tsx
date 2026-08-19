"use client";

import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { ImageTrail } from "@/registry/components/image-trail";

export function ImageTrailDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <ImageTrail label={demoValue(locale, "图像轨迹演示", "Image trail demo")} images={[
    { id: "field", src: "/assets/editorial/trail-forest.jpg", alt: demoValue(locale, "森林中蜿蜒的小路", "A path through a forest"), label: demoValue(locale, "小径", "Path") },
    { id: "stone", src: "/assets/editorial/trail-road.jpg", alt: demoValue(locale, "树木间的土路", "Dirt road between trees"), label: demoValue(locale, "山脊", "Ridge") },
    { id: "sea", src: "/assets/editorial/trail-coast.jpg", alt: demoValue(locale, "海岸边的红白灯塔", "Red-and-white lighthouse on the coast"), label: demoValue(locale, "海岸", "Coast") },
    { id: "leaf", src: "/assets/editorial/trail-grass.jpg", alt: demoValue(locale, "树影间的草地", "Grassland among trees"), label: demoValue(locale, "叶隙", "Canopy") },
  ]} />;
}
