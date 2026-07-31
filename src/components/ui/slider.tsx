import { SliderDetents } from "../interior/slider-detents";
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
    <SliderDetents
      value={value[0] ?? min}
      min={min}
      max={max}
      step={step}
      onValueChange={(next) => onValueChange?.([next])}
      label={thumbAriaLabel}
      format={() => thumbAriaValueText ?? String(value[0] ?? min)}
      showValue={false}
      disabled={disabled}
      haptic
      className={cn("ml-slider interior-slider", className)}
    />
  );
}
