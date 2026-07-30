type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      className={className ? `brand-mark-svg ${className}` : "brand-mark-svg"}
      viewBox="0 0 88 88"
      aria-hidden="true"
      focusable="false"
    >
      <rect className="brand-mark-background" width="88" height="88" rx="23" />
      <path
        className="brand-mark-axis"
        d="M22 64V24M22 64H66"
        fill="none"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        className="brand-mark-curve"
        d="M23 62C26 35 37 27 65 25"
        fill="none"
        strokeLinecap="round"
        strokeWidth="6"
      />
      <circle className="brand-mark-origin" cx="23" cy="62" r="5" />
      <circle className="brand-mark-keyframe" cx="65" cy="25" r="6.5" />
    </svg>
  );
}
