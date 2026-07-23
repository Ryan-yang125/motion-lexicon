import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MotionRecipe, ParamValue, ParamValues } from "../data/types";
import { getDefaultParamValues, parseParamValues, valuesToSearchParams } from "./motion-engine";

export function useRecipeParams(recipe: MotionRecipe) {
  const navigate = useNavigate();
  // Static hosting serves one prerendered document for every query variant.
  // Hydrate that canonical default first, then apply the browser query after
  // React has attached to the complete document.
  const [values, setValues] = useState<ParamValues>(() => getDefaultParamValues(recipe));
  const valuesRef = useRef(values);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const next = parseParamValues(recipe, new URLSearchParams(window.location.search));
      valuesRef.current = next;
      setValues(next);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [recipe]);

  const writeUrlState = useCallback((next: ParamValues) => {
    if (typeof window === "undefined") {
      return;
    }

    const params = valuesToSearchParams(
      recipe,
      next,
      new URLSearchParams(window.location.search)
    );
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    void navigate({
      href: nextUrl,
      replace: true,
      resetScroll: false,
      hashScrollIntoView: false
    });
  }, [navigate, recipe]);

  const updateValue = useCallback(
    (paramId: string, value: ParamValue) => {
      const next = { ...valuesRef.current, [paramId]: value };
      valuesRef.current = next;
      setValues(next);
      writeUrlState(next);
    },
    [writeUrlState]
  );

  const resetValues = useCallback(() => {
    const defaults = getDefaultParamValues(recipe);
    valuesRef.current = defaults;
    setValues(defaults);
    writeUrlState(defaults);
  }, [recipe, writeUrlState]);

  return { values, updateValue, resetValues };
}
