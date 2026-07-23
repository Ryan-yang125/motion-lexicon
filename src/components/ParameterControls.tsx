import { RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Locale, MotionRecipe, ParamValue, ParamValues } from "../data/types";
import { text } from "../data/site";
import { clampToStep, getParamDisplayValue } from "../lib/motion-engine";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

type ParameterControlsProps = {
  locale: Locale;
  recipe: MotionRecipe;
  values: ParamValues;
  onChange: (paramId: string, value: ParamValue) => void;
  onReset: () => void;
};

export function ParameterControls({
  locale,
  recipe,
  values,
  onChange,
  onReset
}: ParameterControlsProps) {
  const { t } = useTranslation();

  function displayValue(param: MotionRecipe["params"][number], value: ParamValue) {
    if (param.kind === "segmented") {
      const selected = param.options.find((option) => option.value === value);
      return selected ? text(selected.label, locale) : String(value);
    }
    if (param.kind === "toggle") {
      return locale === "zh" ? (value ? "开启" : "关闭") : value ? "On" : "Off";
    }
    return getParamDisplayValue(param, value);
  }

  return (
    <div className="controls" aria-label={t("workspace.controlsLabel")}>
      <div className="controls-head">
        <span>{t("common.parameter")}</span>
        <Button type="button" variant="soft" size="sm" onClick={onReset}>
          <RotateCcw aria-hidden="true" size={15} strokeWidth={1.8} />
          {t("common.reset")}
        </Button>
      </div>
      {recipe.params.map((param) => {
        const value = values[param.id];
        const label = text(param.label, locale);
        const visibleValue = displayValue(param, value);
        const controlId = `motion-control-${recipe.id}-${param.id}`;
        return (
          <div className="control" key={param.id}>
            <div className="control-head">
              <span className="control-label">{label}</span>
              {param.kind === "range" ? (
                <label className="control-number" htmlFor={controlId}>
                  <span className="sr-only">{label}</span>
                  <input
                    id={controlId}
                    type="number"
                    inputMode="decimal"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={Number(value)}
                    onChange={(event) => {
                      const next = Number(event.currentTarget.value);
                      if (Number.isFinite(next)) onChange(param.id, clampToStep(next, param));
                    }}
                  />
                  <span>{param.unit}</span>
                </label>
              ) : (
                <span className="control-value">{visibleValue}</span>
              )}
            </div>
            <p className="control-description">{text(param.description, locale)}</p>
            {param.kind === "range" ? (
              <Slider
                value={[Number(value)]}
                min={param.min}
                max={param.max}
                step={param.step}
                onValueChange={([next]) => onChange(param.id, next)}
                thumbAriaLabel={label}
                thumbAriaValueText={visibleValue}
              />
            ) : null}
            {param.kind === "segmented" ? (
              <ToggleGroup
                type="single"
                value={String(value)}
                onValueChange={(next) => {
                  if (next) {
                    onChange(param.id, next);
                  }
                }}
                aria-label={label}
              >
                {param.options.map((option) => (
                  <ToggleGroupItem key={option.value} value={option.value} aria-label={text(option.label, locale)}>
                    {text(option.label, locale)}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            ) : null}
            {param.kind === "toggle" ? (
              <label className="control-switch" htmlFor={controlId}>
                <input
                  id={controlId}
                  type="checkbox"
                  checked={Boolean(value)}
                  onChange={(event) => onChange(param.id, event.currentTarget.checked)}
                />
                <span aria-hidden="true"><i /></span>
                <strong>{visibleValue}</strong>
              </label>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
