import type { LocalizedText, Locale, MotionFamily } from "../data/types";
import { text } from "../data/site";

type MotionThumbnailProps = {
  locale: Locale;
  recipe: {
    id: string;
    family: MotionFamily;
    name: LocalizedText;
  };
};

function ThumbnailVisual({ family, label }: { family: MotionFamily; label: string }) {
  if (family === "entrance") {
    return (
      <div className="thumb-card thumb-actor">
        <small>{label}</small>
        <i />
        <i />
      </div>
    );
  }

  if (family === "timeline") {
    return (
      <div className="thumb-timeline">
        <span className="thumb-actor" />
        <span className="thumb-actor" />
        <span className="thumb-actor" />
        <span className="thumb-actor" />
      </div>
    );
  }

  if (family === "transform") {
    return (
      <div className="thumb-transform-grid">
        <span aria-hidden="true" />
        <strong className="thumb-actor">{label}</strong>
      </div>
    );
  }

  if (family === "state") {
    return (
      <div className="thumb-state">
        <span />
        <strong className="thumb-actor">{label}</strong>
      </div>
    );
  }

  if (family === "scroll") {
    return (
      <div className="thumb-scroll">
        <i />
        <i />
        <strong className="thumb-actor">{label}</strong>
      </div>
    );
  }

  if (family === "feedback") {
    return (
      <div className="thumb-feedback">
        <span className="thumb-feedback-control thumb-actor">
          {label}
          <i aria-hidden="true" />
        </span>
      </div>
    );
  }

  if (family === "easing") {
    return (
      <div className="thumb-easing">
        <span className="thumb-easing-curve" />
        <i className="thumb-actor" />
        <strong>{label}</strong>
      </div>
    );
  }

  if (family === "spring") {
    return (
      <div className="thumb-spring">
        <span />
        <i className="thumb-actor" />
        <strong>{label}</strong>
      </div>
    );
  }

  if (family === "loop") {
    return (
      <div className="thumb-loop">
        <span />
        <i className="thumb-actor" />
        <strong>{label}</strong>
      </div>
    );
  }

  if (family === "effect") {
    return (
      <div className="thumb-effect">
        <strong>{label}</strong>
        <span className="thumb-actor" />
      </div>
    );
  }

  if (family === "performance") {
    return (
      <div className="thumb-performance">
        <span />
        <span />
        <span className="thumb-actor" />
        <span className="thumb-actor" />
        <span className="thumb-actor" />
      </div>
    );
  }

  return (
    <div className="thumb-principle">
      <span />
      <i className="thumb-actor" />
      <strong>{label}</strong>
    </div>
  );
}

export function MotionThumbnail({ locale, recipe }: MotionThumbnailProps) {
  return (
    <div
      className={`motion-thumb library-motion-thumb family-${recipe.family} entry-${recipe.id}`}
      data-motion-family={recipe.family}
      aria-hidden="true"
    >
      <ThumbnailVisual family={recipe.family} label={text(recipe.name, locale)} />
    </div>
  );
}
