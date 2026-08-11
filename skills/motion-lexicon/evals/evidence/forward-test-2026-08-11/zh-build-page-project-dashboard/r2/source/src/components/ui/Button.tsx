import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className = "", ...props },
  ref,
) {
  return <button ref={ref} className={`button ${className}`.trim()} {...props} />;
});
