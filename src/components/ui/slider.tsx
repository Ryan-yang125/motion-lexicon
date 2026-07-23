import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../lib/utils";

type SliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
  thumbAriaLabel?: string;
  thumbAriaValueText?: string;
};

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, thumbAriaLabel, thumbAriaValueText, ...props }, ref) => (
  <SliderPrimitive.Root ref={ref} className={cn("ml-slider", className)} {...props}>
    <SliderPrimitive.Track className="ml-slider-track">
      <SliderPrimitive.Range className="ml-slider-range" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="ml-slider-thumb"
      aria-label={thumbAriaLabel}
      aria-valuetext={thumbAriaValueText}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
