import type { Locale } from "../data/types";
import { MotionPacksPage } from "./MotionPacksPage";

export function LandingPage({ locale }: { locale: Locale }) {
  return <MotionPacksPage locale={locale} home />;
}
