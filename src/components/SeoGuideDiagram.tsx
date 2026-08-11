import type { SeoGuideArticleDiagram } from "../data/seo-guide-article-types";
import type { Locale } from "../data/types";

function textLength(value: string, locale: Locale) {
  if (locale === "en") return value.length;
  return Array.from(value).reduce((total, character) => total + (/^[A-Za-z0-9._-]$/.test(character) ? 0.6 : 1), 0);
}

function splitLongToken(token: string, limit: number, locale: Locale) {
  if (textLength(token, locale) <= limit) return [token];

  const chunks: string[] = [];
  let current = "";
  for (const character of Array.from(token)) {
    if (current && textLength(`${current}${character}`, locale) > limit) {
      chunks.push(current);
      current = character;
    } else {
      current += character;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function nodeTextLines(value: string, locale: Locale) {
  const limit = locale === "zh" ? 8 : 13;
  const tokens = locale === "zh"
    ? value.match(/[A-Za-z0-9][A-Za-z0-9._-]*|[^\s]/g) ?? []
    : value.split(/\s+/).filter(Boolean);
  const words = tokens.flatMap((token) => splitLongToken(token, limit, locale));
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = locale === "zh" ? `${current}${word}` : `${current}${current ? " " : ""}${word}`;
    if (current && textLength(next, locale) > limit) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function connectionPoint(
  source: SeoGuideArticleDiagram["nodes"][number],
  target: SeoGuideArticleDiagram["nodes"][number]
) {
  const sourceCenterX = source.x + source.width / 2;
  const sourceCenterY = source.y + source.height / 2;
  const targetCenterX = target.x + target.width / 2;
  const targetCenterY = target.y + target.height / 2;
  const horizontal = Math.abs(targetCenterX - sourceCenterX) >= Math.abs(targetCenterY - sourceCenterY);

  if (horizontal) {
    return {
      x1: targetCenterX > sourceCenterX ? source.x + source.width : source.x,
      y1: sourceCenterY,
      x2: targetCenterX > sourceCenterX ? target.x : target.x + target.width,
      y2: targetCenterY
    };
  }

  return {
    x1: sourceCenterX,
    y1: targetCenterY > sourceCenterY ? source.y + source.height : source.y,
    x2: targetCenterX,
    y2: targetCenterY > sourceCenterY ? target.y : target.y + target.height
  };
}

export function SeoGuideDiagram({ diagram, locale }: { diagram: SeoGuideArticleDiagram; locale: Locale }) {
  const diagramId = `guide-diagram-${diagram.id}-${locale}`;
  const nodesById = new Map(diagram.nodes.map((node) => [node.id, node]));

  return (
    <figure className="seo-guide-diagram">
      <svg viewBox={diagram.viewBox} role="img" aria-labelledby={diagramId}>
        <title id={diagramId}>{diagram.alt[locale]}</title>
        <defs>
          <marker id={`${diagramId}-arrow`} markerWidth="12" markerHeight="12" refX="9" refY="4.5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,9 L10,4.5 z" className="seo-guide-diagram-arrow" />
          </marker>
        </defs>
        {diagram.connectors.map((connector) => {
          const source = nodesById.get(connector.from);
          const target = nodesById.get(connector.to);
          if (!source || !target) return null;
          const line = connectionPoint(source, target);
          const labelX = (line.x1 + line.x2) / 2;
          const labelY = (line.y1 + line.y2) / 2;

          return (
            <g key={`${connector.from}-${connector.to}`}>
              <path
                className="seo-guide-diagram-connector"
                d={`M ${line.x1} ${line.y1} L ${line.x2} ${line.y2}`}
                markerEnd={`url(#${diagramId}-arrow)`}
              />
              {connector.label ? (
                <text className="seo-guide-diagram-connector-label" x={labelX} y={labelY - 12} textAnchor="middle">
                  {connector.label[locale]}
                </text>
              ) : null}
            </g>
          );
        })}
        {diagram.nodes.map((node) => {
          const labelLines = nodeTextLines(node.label[locale], locale);
          const detailLines = nodeTextLines(node.detail[locale], locale);
          const availableHeight = Math.max(node.height - 22, 48);
          const labelLineHeight = Math.max(
            14,
            Math.min(22, Math.floor(availableHeight / (labelLines.length + detailLines.length * 0.8)))
          );
          const detailLineHeight = Math.max(11, Math.round(labelLineHeight * 0.8));
          const labelFontSize = Math.max(14, Math.round(labelLineHeight * 0.9));
          const detailFontSize = Math.max(11, Math.round(detailLineHeight * 0.9));
          const labelStart = 12 + labelFontSize;
          const detailStart = labelStart + (labelLines.length - 1) * labelLineHeight + 6 + detailFontSize;

          return (
            <g className={`seo-guide-diagram-node is-${node.tone}`} key={node.id} transform={`translate(${node.x} ${node.y})`}>
              <rect width={node.width} height={node.height} rx="18" />
              <text className="seo-guide-diagram-node-label" x="24" y={labelStart} style={{ fontSize: `${labelFontSize}px` }} aria-label={node.label[locale]}>
                {labelLines.map((line, index) => <tspan key={`${line}-${index}`} x="24" dy={index === 0 ? 0 : labelLineHeight}>{line}</tspan>)}
              </text>
              <text className="seo-guide-diagram-node-detail" x="24" y={detailStart} style={{ fontSize: `${detailFontSize}px` }} aria-label={node.detail[locale]}>
                {detailLines.map((line, index) => <tspan key={`${line}-${index}`} x="24" dy={index === 0 ? 0 : detailLineHeight}>{line}</tspan>)}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="seo-guide-diagram-mobile" aria-hidden="true">
        <div className="seo-guide-diagram-mobile-nodes">
          {diagram.nodes.map((node) => (
            <div className={`seo-guide-diagram-mobile-node is-${node.tone}`} key={node.id}>
              <strong>{node.label[locale]}</strong>
              <span>{node.detail[locale]}</span>
            </div>
          ))}
        </div>
        {diagram.connectors.length > 0 ? (
          <div className="seo-guide-diagram-mobile-flow">
            {diagram.connectors.map((connector) => {
              const source = nodesById.get(connector.from);
              const target = nodesById.get(connector.to);
              if (!source || !target) return null;
              return (
                <span key={`${connector.from}-${connector.to}`}>
                  {source.label[locale]}
                  <i aria-hidden="true">→</i>
                  {target.label[locale]}
                  {connector.label ? <small>{connector.label[locale]}</small> : null}
                </span>
              );
            })}
          </div>
        ) : null}
      </div>
      <figcaption>
        <strong>{diagram.title[locale]}</strong>
        <span>{diagram.alt[locale]}</span>
      </figcaption>
    </figure>
  );
}
