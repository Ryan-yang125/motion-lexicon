"use client";

import { useId, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";

export type AddToCartMorphProps = { product: string; price: string; image: string; imageAlt: string; label?: string; className?: string; onAdd?: () => void };

export function AddToCartMorph({ product, price, image, imageAlt, label = "Product selection", className = "", onAdd }: AddToCartMorphProps) {
  const reduced = useReducedMotion() === true; const id = useId(); const [added, setAdded] = useState(false); const add = () => { setAdded(true); onAdd?.(); };
  return <section aria-labelledby={id} className={`overflow-hidden rounded-[18px] bg-[#efe5d8] p-3 shadow-[0_16px_40px_-29px_rgba(73,50,32,.55)] ${className}`}><LayoutGroup id={id}><div className="relative grid min-h-[290px] grid-cols-[1fr_auto] gap-3 rounded-[13px] bg-[#faf7f2] p-3"><motion.img layoutId={`${id}-image`} src={image} alt={imageAlt} className="col-span-2 h-40 w-full rounded-[10px] object-cover" /><div><span className="font-mono text-[10px] uppercase tracking-[.14em] text-[#8b7058]">{label}</span><h3 id={id} className="mt-1 text-xl font-medium tracking-[-.05em] text-[#32281f]">{product}</h3><p className="mt-1 text-[12px] text-[#746251]">{price}</p></div><AnimatePresence mode="wait" initial={false}>{added ? <motion.div key="cart" layoutId={`${id}-action`} initial={reduced ? false : { scale: .85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="grid min-h-11 min-w-11 place-items-center self-end rounded-full bg-[#32281f] px-3 text-[11px] text-white">✓ <span className="ml-1 hidden sm:inline">In cart</span></motion.div> : <motion.button key="add" layoutId={`${id}-action`} type="button" onClick={add} className="min-h-11 self-end rounded-full bg-[#32281f] px-4 text-[11px] text-white outline-none hover:bg-[#504134] focus-visible:ring-2 focus-visible:ring-[#4568FF]">Add to cart</motion.button>}</AnimatePresence></div></LayoutGroup></section>;
}
