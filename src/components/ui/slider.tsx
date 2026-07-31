import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../lib/utils";

type SliderProps = {
  value: number[];
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number[]) => void;
  thumbAriaLabel?: string;
  thumbAriaValueText?: string;
  className?: string;
  disabled?: boolean;
};

export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  thumbAriaLabel,
  thumbAriaValueText,
  className,
  disabled
}: SliderProps) {
  return (
    <SliderPrimitive.Root
      value={value}
      min={min}
      max={max}
      step={step}
      onValueChange={onValueChange}
      disabled={disabled}
      className={cn("ml-slider interior-slider", className)}
    >
      <SliderPrimitive.Track className="ml-slider-track">
        <SliderPrimitive.Range className="ml-slider-range" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="ml-slider-thumb"
        aria-label={thumbAriaLabel}
        aria-valuetext={thumbAriaValueText}
      />
    </SliderPrimitive.Root>
  );
}
