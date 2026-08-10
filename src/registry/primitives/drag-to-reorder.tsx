"use client";

import { Reorder, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export type ReorderPrimitiveItem = { id: string; content: ReactNode };

export type DragToReorderPrimitiveProps = {
  items: readonly ReorderPrimitiveItem[];
  onReorder: (items: ReorderPrimitiveItem[]) => void;
  distance?: number;
  pickupScale?: number;
  className?: string;
  itemClassName?: string;
};

export function DragToReorderPrimitive({
  items,
  onReorder,
  distance = 48,
  pickupScale = 1.03,
  className,
  itemClassName,
}: DragToReorderPrimitiveProps) {
  const reduceMotion = useReducedMotion();

  return (
    <Reorder.Group
      axis="y"
      values={[...items]}
      onReorder={onReorder}
      className={className}
      style={{ touchAction: "none" }}
    >
      {items.map((item) => (
        <Reorder.Item
          key={item.id}
          value={item}
          className={itemClassName}
          whileDrag={reduceMotion ? undefined : {
            transform: `translate3d(0, ${Math.min(8, distance / 6)}px, 0) scale(${pickupScale})`,
            zIndex: 2,
          }}
          transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.7 }}
        >
          {item.content}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
