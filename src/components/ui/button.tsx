import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { useReducedMotion } from "motion/react";
import { usePressDepth } from "../interior/press-depth";
import { cn } from "../../lib/utils";

const buttonVariants = cva("ml-button", {
  variants: {
    variant: {
      default: "ml-button-primary",
      accent: "ml-button-accent",
      soft: "ml-button-soft",
      ghost: "ml-button-ghost"
    },
    size: {
      default: "ml-button-md",
      sm: "ml-button-sm",
      icon: "ml-button-icon"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      disabled,
      onPointerDown,
      onKeyDown,
      onKeyUp,
      onBlur,
      style,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const reduced = useReducedMotion();
    const { pressed, origin, ref, bind } = usePressDepth({ disabled });
    const lean = pressed && origin && !reduced ? origin : null;

    if (asChild) {
      throw new Error("Interior buttons do not support asChild");
    }

    return (
      <button
        ref={(node) => {
          ref(node);
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        disabled={disabled}
        data-interior-button=""
        data-pressed={pressed ? "" : undefined}
        className={cn(buttonVariants({ variant, size, className }))}
        style={{
          ...style,
          touchAction: "manipulation",
          transform: pressed && !reduced
            ? `perspective(420px) translateY(2px) scale(.985) rotateX(${lean ? -lean.y * 2.5 : 0}deg) rotateY(${lean ? lean.x * 2.5 : 0}deg)`
            : "perspective(420px) translateY(0) scale(1)",
          transition: reduced ? "none" : "transform 150ms cubic-bezier(.23,1,.32,1)"
        }}
        onPointerDown={(event) => {
          bind.onPointerDown(event);
          onPointerDown?.(event);
        }}
        onKeyDown={(event) => {
          bind.onKeyDown(event);
          onKeyDown?.(event);
        }}
        onKeyUp={(event) => {
          bind.onKeyUp(event);
          onKeyUp?.(event);
        }}
        onBlur={(event) => {
          bind.onBlur();
          onBlur?.(event);
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
