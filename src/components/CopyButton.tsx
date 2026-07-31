import { useTranslation } from "react-i18next";
import { CopyButton as InteriorCopyButton } from "./interior/copy-button";
import { buttonVariants, type ButtonProps } from "./ui/button";

type CopyButtonProps = Pick<ButtonProps, "className" | "variant" | "size" | "disabled"> & {
  getText: () => string;
  label: string;
};

export function CopyButton({
  getText,
  label,
  className,
  variant,
  size,
  disabled
}: CopyButtonProps) {
  const { t } = useTranslation();

  return (
    <InteriorCopyButton
      value={getText}
      label={label}
      copiedLabel={t("common.copied")}
      errorLabel={t("common.copyFailed")}
      timeout={2200}
      disabled={disabled}
      className={buttonVariants({ variant, size, className })}
    />
  );
}
