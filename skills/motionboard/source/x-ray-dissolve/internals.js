// Strata internals: chassis, logic board, SoC, ICs, shields, passives, flexes, coax, camera modules, battery.
// All coordinates are phone coordinates as seen from the back (+z), the same space as the shell in strata.js.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { slab, canvasTex, rrPath, drawGlyph, PW, PH, PR, LENSES, FLASH, TOF, BY } from "./strata.js";

/* ---------- seeded randomness ---------- */
function mulberry32(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const rnd = mulberry32(20261029);
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

/* ---------- layout constants ---------- */
const Z = { plate: -0.28, boardBot: -0.03, boardTop: 0.05 };
const BX0 = -3.22, BX1 = 3.22, BY0 = 0.62, BY1 = 7.06;
const BWD = BX1 - BX0, BHT = BY1 - BY0;
const STRIP_X = 2.32; // right strip of the board beside the tele/flash
const BOARD_TOP_Y = 4.72; // main board top edge (below the camera modules)
export const SOC = { x: -0.25, y: 2.72, sub: 1.74, lid: 1.5 };
SOC.zTop = Z.boardTop + 0.012 + 0.036 + 0.075;

const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';

/* ---------- small geometry helpers ---------- */
const rbox = (w, h, d, r = 0.01, seg = 3) => new RoundedBoxGeometry(w, h, d, seg, Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4, d / 2 - 1e-4));
function rrShape(w, h, r, cx = 0, cy = 0, path = new THREE.Shape()) {
  const x = cx - w / 2, y = cy - h / 2;
  path.moveTo(x + r, y);
  path.lineTo(x + w - r, y); path.quadraticCurveTo(x + w, y, x + w, y + r);
  path.lineTo(x + w, y + h - r); path.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  path.lineTo(x + r, y + h); path.quadraticCurveTo(x, y + h, x, y + h - r);
  path.lineTo(x, y + r); path.quadraticCurveTo(x, y, x + r, y);
  return path;
}
// polygon with rounded corners (points CCW)
function roundedPoly(pts, r, path = new THREE.Shape()) {
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n];
    const d0 = new THREE.Vector2(p0[0] - p1[0], p0[1] - p1[1]).normalize();
    const d2 = new THREE.Vector2(p2[0] - p1[0], p2[1] - p1[1]).normalize();
    const a = [p1[0] + d0.x * r, p1[1] + d0.y * r], b = [p1[0] + d2.x * r, p1[1] + d2.y * r];
    if (i === 0) path.moveTo(a[0], a[1]); else path.lineTo(a[0], a[1]);
    path.quadraticCurveTo(p1[0], p1[1], b[0], b[1]);
  }
  path.closePath();
  return path;
}
// dense polyline with filleted corners; pts = [[x,y,z], ...]
function filletPath(pts, r, steps = 8) {
  const V = pts.map((p) => new THREE.Vector3(...p));
  const out = [V[0].clone()];
  for (let i = 1; i < V.length - 1; i++) {
    const a = V[i - 1], b = V[i], c = V[i + 1];
    const da = a.clone().sub(b), dc = c.clone().sub(b);
    const rr = Math.min(r, da.length() * 0.45, dc.length() * 0.45);
    const p0 = b.clone().addScaledVector(da.normalize(), rr), p2 = b.clone().addScaledVector(dc.normalize(), rr);
    for (let k = 0; k <= steps; k++) {
      const t = k / steps;
      out.push(new THREE.Vector3().addScaledVector(p0, (1 - t) * (1 - t)).addScaledVector(b, 2 * (1 - t) * t).addScaledVector(p2, t * t));
    }
  }
  out.push(V[V.length - 1].clone());
  return out;
}
// flat ribbon (flex cable) along a path, lying with its face toward +z where possible
function ribbonGeo(path, width, thick = 0.012) {
  const pos = [], idx = [];
  const up = new THREE.Vector3(0, 0, 1);
  const N = path.length;
  const frames = path.map((p, i) => {
    const t = path[Math.min(i + 1, N - 1)].clone().sub(path[Math.max(i - 1, 0)]).normalize();
    const side = new THREE.Vector3().crossVectors(up, t);
    if (side.lengthSq() < 1e-6) side.set(1, 0, 0);
    side.normalize();
    const nrm = new THREE.Vector3().crossVectors(t, side).normalize();
    return { side, nrm };
  });
  // 4 corners per ring: top-left, top-right, bottom-right, bottom-left
  for (let i = 0; i < N; i++) {
    const p = path[i], { side, nrm } = frames[i];
    for (const [s, h] of [[-1, 1], [1, 1], [1, -1], [-1, -1]]) {
      const v = p.clone().addScaledVector(side, (s * width) / 2).addScaledVector(nrm, (h * thick) / 2);
      pos.push(v.x, v.y, v.z);
    }
  }
  for (let i = 0; i < N - 1; i++) {
    for (let k = 0; k < 4; k++) {
      const a = i * 4 + k, b = i * 4 + ((k + 1) % 4), c = (i + 1) * 4 + k, d = (i + 1) * 4 + ((k + 1) % 4);
      idx.push(a, b, c, b, d, c);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  const ng = g.toNonIndexed();
  ng.computeVertexNormals();
  return ng;
}

/* ---------- materials ---------- */
function noiseTex(size, amp, seed, base = 128) {
  const r = mulberry32(seed);
  const t = canvasTex(size, size, (g, w, h) => {
    const img = g.createImageData(w, h);
    for (let i = 0; i < w * h; i++) {
      img.data[i * 4] = base + (r() - 0.5) * amp; img.data[i * 4 + 1] = base + (r() - 0.5) * amp;
      img.data[i * 4 + 2] = 255; img.data[i * 4 + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
// brushed-metal roughness: horizontal streaks
function brushedTex(seed, baseRough, spread) {
  const r = mulberry32(seed);
  const t = canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = `rgb(0,${Math.round(baseRough * 255)},255)`; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 1400; i++) {
      const y = r() * h, x = r() * w, len = 40 + r() * 260, v = Math.round((baseRough + (r() - 0.5) * spread) * 255);
      g.strokeStyle = `rgba(0,${v},255,0.5)`; g.lineWidth = 0.6 + r() * 1.2;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + len, y + (r() - 0.5) * 2); g.stroke();
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
const BEAD = noiseTex(512, 90, 7);
const BRUSH = brushedTex(11, 0.36, 0.08);
const BRUSH2 = brushedTex(13, 0.46, 0.1);

const MAT = {
  chassis: new THREE.MeshPhysicalMaterial({ color: 0x8c8f95, metalness: 1, roughness: 0.42, normalMap: BEAD, normalScale: new THREE.Vector2(0.15, 0.15) }),
  plate: new THREE.MeshPhysicalMaterial({ color: 0x3a3c40, metalness: 0.9, roughness: 0.55, normalMap: BEAD, normalScale: new THREE.Vector2(0.2, 0.2) }),
  epoxy: new THREE.MeshPhysicalMaterial({ color: 0x0c0c0d, metalness: 0, roughness: 0.5, clearcoat: 0.25, clearcoatRoughness: 0.5 }),
  underfill: new THREE.MeshPhysicalMaterial({ color: 0x24190c, metalness: 0, roughness: 0.22, clearcoat: 0.7, clearcoatRoughness: 0.15 }),
  solder: new THREE.MeshPhysicalMaterial({ color: 0xa9abb0, metalness: 1, roughness: 0.3 }),
  barrelIn: new THREE.MeshPhysicalMaterial({ color: 0x020203, metalness: 0.1, roughness: 0.75, envMapIntensity: 0.25, side: THREE.DoubleSide }),
  trim: new THREE.MeshPhysicalMaterial({ color: 0x75787d, metalness: 1, roughness: 0.3 }),
  blade: new THREE.MeshPhysicalMaterial({ color: 0x040405, metalness: 0.5, roughness: 0.38, side: THREE.DoubleSide }),
  rearGlass: new THREE.MeshPhysicalMaterial({ color: 0x0a0d14, metalness: 0, roughness: 0.04, clearcoat: 1, clearcoatRoughness: 0.02, iridescence: 1, iridescenceIOR: 1.9, iridescenceThicknessRange: [380, 620], envMapIntensity: 1.6 }),
  shield: new THREE.MeshPhysicalMaterial({ color: 0xb4b8be, metalness: 1, roughness: 1, roughnessMap: BRUSH }),
  steel: new THREE.MeshPhysicalMaterial({ color: 0xa9adb3, metalness: 1, roughness: 0.3 }),
  bracket: new THREE.MeshPhysicalMaterial({ color: 0x8e9298, metalness: 1, roughness: 1, roughnessMap: BRUSH2 }),
  screw: new THREE.MeshPhysicalMaterial({ color: 0xd0d2d6, metalness: 1, roughness: 0.16 }),
  black: new THREE.MeshPhysicalMaterial({ color: 0x060606, metalness: 0, roughness: 0.6 }),
  plastic: new THREE.MeshPhysicalMaterial({ color: 0x111112, metalness: 0, roughness: 0.55 }),
  gold: new THREE.MeshPhysicalMaterial({ color: 0xd8b26e, metalness: 1, roughness: 0.28 }),
  passiveBody: new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.55 }),
  passiveEnd: new THREE.MeshPhysicalMaterial({ color: 0xc9cacc, metalness: 1, roughness: 0.3 }),
  flex: new THREE.MeshPhysicalMaterial({ color: 0x15100a, metalness: 0.2, roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.25, side: THREE.DoubleSide }),
  flexAmber: new THREE.MeshPhysicalMaterial({ color: 0x5a3212, metalness: 0.1, roughness: 0.3, clearcoat: 0.7, clearcoatRoughness: 0.2, side: THREE.DoubleSide }),
  coax: new THREE.MeshPhysicalMaterial({ color: 0x8d9095, metalness: 0.55, roughness: 0.34 }),
  camCan: new THREE.MeshPhysicalMaterial({ color: 0x9da0a6, metalness: 1, roughness: 0.34, normalMap: BEAD, normalScale: new THREE.Vector2(0.08, 0.08) }),
  lensGlass: new THREE.MeshPhysicalMaterial({ color: 0x010102, metalness: 0, roughness: 0.03, specularIntensity: 0.6, iridescence: 1, iridescenceIOR: 1.85, iridescenceThicknessRange: [150, 600], ior: 1.8 }),
};

/* ---------- part placement registry (used by the board texture and passive scatter) ---------- */
const FOOT = []; // {x, y, w, h, ao, pad}
function foot(x, y, w, h, ao = 1, pad = 0.04) { FOOT.push({ x, y, w, h, ao, pad }); }
const PASS = []; // passives: {x, y, L, W, H, rot, kind}

/* ---------- board texture ---------- */
const TS = 4096, PPU = TS / BWD;
const tx = (x) => (x - BX0) * PPU, ty = (y) => (BY1 - y) * PPU;

function inBoard(x, y, m = 0.05) {
  if (x < BX0 + m || x > BX1 - m || y < BY0 + m || y > BY1 - m) return false;
  if (y > BOARD_TOP_Y - m && x < STRIP_X + m) return false;
  return true;
}
function freeAt(x, y, hw, hh) {
  for (const f of FOOT) if (Math.abs(x - f.x) < f.w / 2 + hw + f.pad && Math.abs(y - f.y) < f.h / 2 + hh + f.pad) return false;
  for (const p of PASS) if (Math.abs(x - p.x) < p.ext + hw + 0.012 && Math.abs(y - p.y) < p.ext + hh + 0.012) return false;
  return true;
}

function drawBoard() {
  const color = document.createElement("canvas"), orm = document.createElement("canvas"), bump = document.createElement("canvas");
  for (const c of [color, orm, bump]) { c.width = TS; c.height = TS; }
  const C = color.getContext("2d"), O = orm.getContext("2d"), B = bump.getContext("2d");
  const r = mulberry32(99);
  // base solder mask
  C.fillStyle = "#0e1312"; C.fillRect(0, 0, TS, TS);
  O.fillStyle = "rgb(0,105,0)"; O.fillRect(0, 0, TS, TS);
  B.fillStyle = "#000"; B.fillRect(0, 0, TS, TS);
  // low-frequency mottling of the mask
  C.filter = "blur(60px)";
  for (let i = 0; i < 40; i++) {
    C.fillStyle = `rgba(${r() < 0.5 ? "30,40,38" : "4,6,6"},0.35)`;
    C.beginPath(); C.arc(r() * TS, r() * TS, 120 + r() * 380, 0, Math.PI * 2); C.fill();
  }
  C.filter = "none";
  // copper under the mask: trace bundles with 45-degree jogs
  const traceStroke = (pts, wpx) => {
    for (const [ctx, style] of [[C, "rgba(34,46,42,0.9)"], [B, "rgba(150,150,150,1)"], [O, "rgb(0,80,0)"]]) {
      ctx.strokeStyle = style; ctx.lineWidth = wpx; ctx.lineJoin = "round"; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      for (const p of pts.slice(1)) ctx.lineTo(p[0], p[1]);
      ctx.stroke();
    }
  };
  const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  for (let b = 0; b < 150; b++) {
    let x = r() * TS, y = r() * TS;
    let d = Math.floor(r() * 4);
    const nLines = 2 + Math.floor(r() * 7), sp = 9 + r() * 6, wpx = 3 + r() * 2.5;
    const segs = [];
    let px = x, py = y;
    segs.push([px, py]);
    for (let s = 0; s < 3 + Math.floor(r() * 3); s++) {
      const len = 80 + r() * 520;
      px += dirs[d][0] * len; py += dirs[d][1] * len; segs.push([px, py]);
      // 45 degree jog
      const turn = r() < 0.5 ? 1 : 3; const nd = (d + turn) % 4;
      const j = 40 + r() * 120;
      px += (dirs[d][0] + dirs[nd][0]) * j * 0.7071; py += (dirs[d][1] + dirs[nd][1]) * j * 0.7071; segs.push([px, py]);
      d = nd;
    }
    for (let l = 0; l < nLines; l++) {
      const off = (l - (nLines - 1) / 2) * sp;
      traceStroke(segs.map(([sx, sy], i) => {
        // offset perpendicular to the first segment direction (good enough for parallel bundles)
        const dd = dirs[(Math.floor(i / 2) + d) % 4];
        return [sx + dd[1] * off, sy - dd[0] * off];
      }), wpx);
    }
  }
  // ground pour hatch near the edges
  O.globalAlpha = 1;
  // vias
  for (let i = 0; i < 2600; i++) {
    const x = r() * TS, y = r() * TS, rad = 4 + r() * 3;
    C.fillStyle = "rgba(40,52,48,1)"; C.beginPath(); C.arc(x, y, rad + 3, 0, Math.PI * 2); C.fill();
    C.fillStyle = "#050606"; C.beginPath(); C.arc(x, y, rad * 0.45, 0, Math.PI * 2); C.fill();
    B.fillStyle = "#9a9a9a"; B.beginPath(); B.arc(x, y, rad + 3, 0, Math.PI * 2); B.fill();
    B.fillStyle = "#000"; B.beginPath(); B.arc(x, y, rad * 0.45, 0, Math.PI * 2); B.fill();
  }
  // contact shadows (ambient occlusion) under every part
  C.save();
  for (const f of FOOT) {
    C.filter = `blur(${Math.round(18 * f.ao)}px)`;
    C.fillStyle = `rgba(0,0,0,${0.75 * Math.min(1, f.ao)})`;
    const ex = 0.03 * f.ao * PPU;
    C.fillRect(tx(f.x - f.w / 2) - ex, ty(f.y + f.h / 2) - ex, f.w * PPU + 2 * ex, f.h * PPU + 2 * ex);
  }
  C.filter = "blur(3px)";
  for (const p of PASS) {
    const L = (p.rot ? p.W : p.L) * PPU, W = (p.rot ? p.L : p.W) * PPU;
    C.fillStyle = "rgba(0,0,0,0.6)";
    C.fillRect(tx(p.x) - L / 2 - 3, ty(p.y) - W / 2 - 3, L + 6, W + 6);
  }
  C.restore();
  // exposed ENIG pads under the passive ends
  const pad = (x, y, w, h) => {
    C.fillStyle = "#b99357"; C.fillRect(x, y, w, h);
    O.fillStyle = "rgb(0,70,255)"; O.fillRect(x, y, w, h);
    B.fillStyle = "#c8c8c8"; B.fillRect(x, y, w, h);
  };
  for (const p of PASS) {
    const L = p.L * PPU, W = p.W * PPU * 1.15, e = p.L * 0.34 * PPU;
    for (const s of [-1, 1]) {
      const cx = tx(p.x) + (p.rot ? 0 : s * (L / 2 - e / 2 + 2)), cy = ty(p.y) - (p.rot ? s * (L / 2 - e / 2 + 2) : 0);
      const pw = p.rot ? W : e + 6, ph = p.rot ? e + 6 : W;
      pad(cx - pw / 2, cy - ph / 2, pw, ph);
    }
  }
  // empty pads, test points and fiducials
  for (let i = 0; i < 700; i++) {
    const x = BX0 + r() * BWD, y = BY0 + r() * BHT;
    if (!inBoard(x, y, 0.08) || !freeAt(x, y, 0.05, 0.05)) continue;
    if (r() < 0.55) {
      const rad = (0.018 + r() * 0.02) * PPU;
      C.fillStyle = "#b99357"; C.beginPath(); C.arc(tx(x), ty(y), rad, 0, Math.PI * 2); C.fill();
      O.fillStyle = "rgb(0,70,255)"; O.beginPath(); O.arc(tx(x), ty(y), rad, 0, Math.PI * 2); O.fill();
    } else {
      const w = 0.03 * PPU, h = 0.03 * PPU, gap = 0.05 * PPU;
      for (const s of [-1, 1]) pad(tx(x) + s * gap / 2 - w / 2, ty(y) - h / 2, w, h);
    }
  }
  // silkscreen designators: sparse, small, with uneven ink density, size and orientation
  const pre = ["C", "R", "L", "U", "J", "FL", "TP"];
  for (let i = 0; i < 150; i++) {
    const x = BX0 + r() * BWD, y = BY0 + r() * BHT;
    if (!inBoard(x, y, 0.15) || !freeAt(x, y, 0.1, 0.04)) continue;
    const s = `${pick(pre)}${1000 + Math.floor(r() * 8999)}`;
    const size = Math.round((0.034 + r() * 0.014) * PPU), a = 0.4 + r() * 0.4, tone = 140 + Math.floor(r() * 30);
    C.font = `500 ${size}px ${FONT}`; C.fillStyle = `rgba(${tone},${tone + 6 + Math.floor(r() * 6)},${tone + 2},${a})`;
    O.font = C.font; O.fillStyle = "rgb(0,170,0)";
    for (const ctx of [C, O]) {
      ctx.save(); ctx.translate(tx(x), ty(y)); if (r() < 0.3) ctx.rotate(-Math.PI / 2);
      ctx.fillText(s, 0, 0); ctx.restore();
    }
  }
  // handling marks: a few fine scratches and dust specks (seeded, restrained)
  for (let i = 0; i < 26; i++) {
    const x0 = r() * TS, y0 = r() * TS, len = 120 + r() * 520, ang = r() * Math.PI;
    const bend = (r() - 0.5) * 80;
    C.strokeStyle = `rgba(150,160,158,${0.06 + r() * 0.1})`; C.lineWidth = 0.8 + r() * 1.2;
    C.beginPath(); C.moveTo(x0, y0);
    C.quadraticCurveTo(x0 + Math.cos(ang) * len / 2 - Math.sin(ang) * bend, y0 + Math.sin(ang) * len / 2 + Math.cos(ang) * bend, x0 + Math.cos(ang) * len, y0 + Math.sin(ang) * len);
    C.stroke();
    O.strokeStyle = "rgba(0,60,0,0.5)"; O.lineWidth = C.lineWidth; O.stroke();
  }
  for (let i = 0; i < 160; i++) {
    const x = r() * TS, y = r() * TS, rad = 1 + r() * r() * 5;
    C.fillStyle = `rgba(${190 + Math.floor(r() * 40)},${190 + Math.floor(r() * 30)},${180 + Math.floor(r() * 30)},${0.18 + r() * 0.35})`;
    C.beginPath(); C.arc(x, y, rad, 0, Math.PI * 2); C.fill();
    O.fillStyle = "rgb(0,230,0)"; O.beginPath(); O.arc(x, y, rad, 0, Math.PI * 2); O.fill();
  }
  for (let i = 0; i < 9; i++) {
    let x = r() * TS, y = r() * TS;
    C.strokeStyle = `rgba(200,200,195,${0.12 + r() * 0.12})`; C.lineWidth = 1.2;
    C.beginPath(); C.moveTo(x, y);
    for (let k = 0; k < 6; k++) { x += (r() - 0.5) * 40; y += (r() - 0.5) * 40; C.lineTo(x, y); }
    C.stroke();
  }
  // board outline darkening
  const strip = (x0, y0, x1, y1) => { C.strokeStyle = "rgba(0,0,0,0.6)"; C.lineWidth = 14; C.strokeRect(tx(x0), ty(y1), (x1 - x0) * PPU, (y1 - y0) * PPU); };
  strip(BX0, BY0, BX1, BOARD_TOP_Y);
  const mk = (cv, srgb) => { const t = new THREE.CanvasTexture(cv); t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; t.anisotropy = 16; return t; };
  return { map: mk(color, true), orm: mk(orm, false), bump: mk(bump, false) };
}

/* ---------- IC marking textures ---------- */
function icTex(lines, w, h, seed) {
  const asp = w / h, H = 256, W = Math.round(256 * asp);
  const rr = mulberry32(seed);
  return canvasTex(W * 2, H * 2, (g, cw, ch) => {
    const tone = 13 + Math.floor(rr() * 7);
    g.fillStyle = `rgb(${tone},${tone},${tone + Math.floor(rr() * 3)})`; g.fillRect(0, 0, cw, ch);
    // fine mould texture
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(255,255,255,${rr() * 0.03})`; g.fillRect(rr() * cw, rr() * ch, 2, 2); }
    g.fillStyle = "#38393c";
    const fs = Math.min(ch / (lines.length + 6), cw / 14);
    g.font = `500 ${fs}px ${FONT}`; g.textBaseline = "middle"; g.textAlign = "left";
    lines.forEach((l, i) => g.fillText(l, cw * 0.1, ch * 0.5 + (i - (lines.length - 1) / 2) * fs * 1.25));
    g.beginPath(); g.arc(cw * 0.1 + fs * 0.25, ch * 0.12 + fs * 0.25, fs * 0.22, 0, Math.PI * 2); g.fill();
  }, true);
}

/* ---------- shield can top: perforation patch, stamped border, laser mark ---------- */
// height field -> tangent-space normal map
function heightToNormal(hc, strength) {
  const w = hc.width, h = hc.height;
  const src = hc.getContext("2d").getImageData(0, 0, w, h).data;
  const out = document.createElement("canvas"); out.width = w; out.height = h;
  const og = out.getContext("2d"), img = og.createImageData(w, h);
  const H = (x, y) => src[((Math.min(h - 1, Math.max(0, y))) * w + Math.min(w - 1, Math.max(0, x))) * 4] / 255;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const dx = (H(x + 1, y) - H(x - 1, y)) * strength, dy = (H(x, y + 1) - H(x, y - 1)) * strength;
    const l = Math.hypot(dx, dy, 1), k = (y * w + x) * 4;
    img.data[k] = 128 + (-dx / l) * 127; img.data[k + 1] = 128 + (dy / l) * 127; img.data[k + 2] = 128 + (1 / l) * 127; img.data[k + 3] = 255;
  }
  og.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(out); t.colorSpace = THREE.NoColorSpace; t.anisotropy = 8;
  return t;
}
function shieldNormal(w, h, seed) {
  const ppu = 260, W = Math.round(w * ppu), H = Math.round(h * ppu);
  const rr = mulberry32(seed + 7);
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d");
  g.fillStyle = "rgb(128,128,128)"; g.fillRect(0, 0, W, H);
  // oil-can unevenness of thin stamped steel
  g.filter = `blur(${Math.round(0.18 * ppu)}px)`;
  for (let i = 0; i < 10; i++) {
    const v = 128 + (rr() - 0.5) * 70;
    g.fillStyle = `rgb(${v},${v},${v})`;
    g.beginPath(); g.ellipse(rr() * W, rr() * H, (0.15 + rr() * 0.3) * ppu, (0.15 + rr() * 0.3) * ppu, rr() * 3, 0, Math.PI * 2); g.fill();
  }
  // stamped step: inner panel pressed down
  g.filter = "blur(3px)";
  g.fillStyle = "rgba(90,90,90,0.55)";
  rrPath(g, 0.07 * ppu, 0.07 * ppu, W - 0.14 * ppu, H - 0.14 * ppu, 0.05 * ppu); g.fill();
  g.filter = "none";
  return heightToNormal(c, 6);
}
function shieldTex(w, h, seed) {
  const ppu = 340, W = Math.round(w * ppu), H = Math.round(h * ppu);
  const rr = mulberry32(seed);
  return canvasTex(W, H, (g, cw, ch) => {
    g.fillStyle = "#ffffff"; g.fillRect(0, 0, cw, ch);
    // stamped border step
    g.strokeStyle = "rgba(0,0,0,0.22)"; g.lineWidth = 3;
    rrPath(g, 0.07 * ppu, 0.07 * ppu, cw - 0.14 * ppu, ch - 0.14 * ppu, 0.05 * ppu); g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.5)"; g.lineWidth = 2;
    rrPath(g, 0.07 * ppu + 3, 0.07 * ppu + 3, cw - 0.14 * ppu - 6, ch - 0.14 * ppu - 6, 0.05 * ppu); g.stroke();
    // perforation patch
    if (w * h > 0.6) {
      const px = cw * (0.15 + rr() * 0.3), py = ch * (0.15 + rr() * 0.25), pw = cw * 0.35, ph = ch * 0.3;
      g.fillStyle = "rgba(10,10,12,0.9)";
      for (let y = py; y < py + ph; y += 0.05 * ppu) for (let x = px; x < px + pw; x += 0.05 * ppu) {
        g.beginPath(); g.arc(x + ((y - py) / (0.05 * ppu)) % 2 * 0.025 * ppu, y, 0.012 * ppu, 0, Math.PI * 2); g.fill();
      }
    }
    // laser mark: data matrix + lot code
    const cell = 0.016 * ppu, mx = cw - 0.5 * ppu, my = ch - 0.5 * ppu;
    g.fillStyle = "rgba(40,40,44,0.55)";
    for (let i = 0; i < 14; i++) for (let j = 0; j < 14; j++) if (i === 0 || j === 13 || rr() < 0.5) g.fillRect(mx + i * cell, my + j * cell, cell, cell);
    g.font = `500 ${0.05 * ppu}px ${FONT}`; g.textBaseline = "top";
    g.fillText(`SH${100 + Math.floor(rr() * 899)}-${String.fromCharCode(65 + Math.floor(rr() * 26))}${Math.floor(rr() * 9)}`, 0.14 * ppu, ch - 0.24 * ppu);
    // light handling scratches and a couple of specks
    for (let i = 0; i < 7; i++) {
      const x0 = rr() * cw, y0 = rr() * ch, len = (0.1 + rr() * 0.4) * ppu, a = rr() * Math.PI;
      g.strokeStyle = `rgba(${rr() < 0.5 ? "255,255,255" : "40,40,44"},${0.12 + rr() * 0.12})`; g.lineWidth = 0.7;
      g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0 + Math.cos(a) * len, y0 + Math.sin(a) * len); g.stroke();
    }
    for (let i = 0; i < 5; i++) { g.fillStyle = `rgba(230,228,220,${0.3 + rr() * 0.3})`; g.beginPath(); g.arc(rr() * cw, rr() * ch, 1 + rr() * 1.5, 0, Math.PI * 2); g.fill(); }
  }, true);
}

/* ---------- SoC lid texture ---------- */
function lidTextures() {
  const S = 1024;
  const map = canvasTex(S, S, (g, w, h) => {
    const rg = g.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.5, w * 0.75);
    rg.addColorStop(0, "#8f9297"); rg.addColorStop(1, "#7b7e83");
    g.fillStyle = rg; g.fillRect(0, 0, w, h);
    g.fillStyle = "#a9acb1";
    drawGlyph(g, w * 0.27, h * 0.42, w * 0.2);
    g.font = `600 ${w * 0.25}px ${FONT}`; g.textBaseline = "middle"; g.textAlign = "left";
    g.fillText("S1", w * 0.42, h * 0.43);
    g.font = `600 ${w * 0.115}px ${FONT}`; g.textAlign = "center";
    g.fillText("PRO", w * 0.5, h * 0.66);
    const rr = mulberry32(515);
    for (let i = 0; i < 5; i++) {
      const x0 = rr() * w, y0 = rr() * h, len = 60 + rr() * 220, a = rr() * Math.PI;
      g.strokeStyle = `rgba(200,203,208,${0.1 + rr() * 0.1})`; g.lineWidth = 0.8;
      g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0 + Math.cos(a) * len, y0 + Math.sin(a) * len); g.stroke();
    }
    for (let i = 0; i < 9; i++) { g.fillStyle = `rgba(235,232,225,${0.35 + rr() * 0.35})`; g.beginPath(); g.arc(rr() * w, rr() * h, 0.8 + rr() * 2.2, 0, Math.PI * 2); g.fill(); }
  }, true);
  const orm = canvasTex(S, S, (g, w, h) => {
    g.fillStyle = "rgb(0,105,255)"; g.fillRect(0, 0, w, h);
    g.fillStyle = "rgb(0,165,255)";
    drawGlyph(g, w * 0.27, h * 0.42, w * 0.2);
    g.font = `600 ${w * 0.25}px ${FONT}`; g.textBaseline = "middle"; g.textAlign = "left";
    g.fillText("S1", w * 0.42, h * 0.43);
    g.font = `600 ${w * 0.115}px ${FONT}`; g.textAlign = "center";
    g.fillText("PRO", w * 0.5, h * 0.66);
  });
  return { map, orm };
}

/* ---------- battery print ---------- */
function batteryTex(w, h) {
  const S = 2048, H = Math.round((S * h) / w);
  const rr = mulberry32(4242);
  return canvasTex(S, H, (g, cw, ch) => {
    g.fillStyle = "#1a1b1e"; g.fillRect(0, 0, cw, ch);
    // foil wrinkles
    g.filter = "blur(30px)";
    for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(${rr() < 0.5 ? "60,62,66" : "6,6,8"},0.25)`; g.fillRect(rr() * cw, rr() * ch, 40 + rr() * 300, 6 + rr() * 30); }
    g.filter = "none";
    const ppu = cw / w;
    g.fillStyle = "#c9cbcf"; g.textBaseline = "top"; g.textAlign = "left";
    const x0 = 0.45 * ppu; let y = 0.55 * ppu;
    const line = (s, size, wt = 500, gap = 1.45) => { g.font = `${wt} ${size * ppu}px ${FONT}`; g.fillText(s, x0, y); y += size * ppu * gap; };
    line("Li-ion Polymer Battery", 0.2, 600);
    line("Model S2241  ·  3.87 V ⎓ 4,685 mAh  ·  18.13 Wh", 0.12);
    line("Designed by Strata Devices, Inc.  Assembled in Vietnam", 0.1);
    y += 0.08 * ppu;
    line("Do not disassemble, puncture, crush or heat above 60 °C.", 0.085, 400);
    line("Use only Strata replacement cells. Recycle properly.", 0.085, 400);
    // data matrix
    const mx = cw - 1.5 * ppu, my = 0.55 * ppu, cell = 0.05 * ppu;
    for (let i = 0; i < 18; i++) for (let j = 0; j < 18; j++) {
      const edge = i === 0 || j === 17 || (j === 0 && i % 2 === 0) || (i === 17 && j % 2 === 1);
      if (edge || rr() < 0.5) g.fillRect(mx + i * cell, my + j * cell, cell, cell);
    }
    g.font = `500 ${0.08 * ppu}px ${FONT}`;
    g.fillText("F7Q4 1832 KXQ", mx, my + 18 * cell + 0.06 * ppu);
    // recycling glyph-ish marks
    g.strokeStyle = "#c9cbcf"; g.lineWidth = 0.012 * ppu;
    for (let k = 0; k < 3; k++) { g.strokeRect(x0 + k * 0.42 * ppu, y + 0.12 * ppu, 0.3 * ppu, 0.3 * ppu); }
  }, true);
}

/* ================= build ================= */
export function buildInternals() {
  const G = new THREE.Group();
  const add = (geo, mat, x = 0, y = 0, z = 0, rz = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z); m.rotation.z = rz;
    m.castShadow = true; m.receiveShadow = true;
    G.add(m);
    return m;
  };
  const bt = Z.boardTop;

  /* chassis ring and mid-plate */
  {
    const outer = rrShape(PW, PH, PR);
    outer.holes.push(rrShape(PW - 0.44, PH - 0.44, PR - 0.22, 0, 0, new THREE.Path()));
    const g = new THREE.ExtrudeGeometry(outer, { depth: 0.74, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3, curveSegments: 24 });
    add(g, MAT.chassis, 0, 0, -0.4);
    const pg = new THREE.ShapeGeometry(rrShape(PW - 0.42, PH - 0.42, PR - 0.21), 24);
    add(pg, MAT.plate, 0, 0, Z.plate);
  }

  /* SoC */
  const lidT = lidTextures();
  {
    const { x, y, sub, lid } = SOC;
    foot(x, y, sub, sub, 1.3, 0.06);
    {
      const skirt = new THREE.ExtrudeGeometry(rrShape(sub - 0.02, sub - 0.02, 0.03), { depth: 0.004, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.05, bevelSegments: 6, curveSegments: 6 });
      add(skirt, MAT.underfill, x, y, bt - 0.004);
    }
    const subMat = new THREE.MeshPhysicalMaterial({ color: 0x2c2a1f, metalness: 0.1, roughness: 0.45, clearcoat: 0.4, clearcoatRoughness: 0.3 });
    add(rbox(sub, sub, 0.036, 0.008), subMat, x, y, bt + 0.012 + 0.018);
    const lidMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: lidT.map, metalness: 1, roughness: 1, roughnessMap: lidT.orm, metalnessMap: lidT.orm, normalMap: BEAD, normalScale: new THREE.Vector2(0.06, 0.06) });
    MAT.lid = lidMat;
    add(rbox(lid, lid, 0.075, 0.02, 4), lidMat, x, y, bt + 0.048 + 0.0375);
    // land-side caps on the substrate ring
    const ringZ = bt + 0.048;
    for (let s = 0; s < 4; s++) {
      for (let k = 0; k < 14; k++) {
        if (rnd() < 0.3) continue;
        const u = -0.66 + (k / 13) * 1.32, v = (lid / 2 + sub / 2) / 2;
        const [px, py] = s === 0 ? [u, v] : s === 1 ? [u, -v] : s === 2 ? [v, u] : [-v, u];
        PASS.push({ x: x + px, y: y + py, L: 0.06, W: 0.03, H: 0.025, rot: s < 2 ? 0 : 1, kind: "c", z: ringZ, onSub: true, ext: 0.03 });
      }
    }
  }

  /* other packages */
  const ICS = [
    { x: -2.2, y: 1.72, w: 1.08, h: 1.28, ht: 0.09, lines: ["S2N4T", "256GB", "2441 KR"] },
    { x: -2.25, y: 3.55, w: 0.95, h: 0.95, ht: 0.07, lines: ["SPM", "338S01024", "U2700"] },
    { x: -1.08, y: 4.22, w: 0.55, h: 0.55, ht: 0.05, lines: ["AC12", "4F2"] },
    { x: 0.95, y: 4.3, w: 0.48, h: 0.4, ht: 0.045, lines: ["U53", "Q2"] },
    { x: 1.08, y: 1.05, w: 0.42, h: 0.42, ht: 0.045, lines: ["TPS", "E31"] },
    { x: 2.78, y: 6.3, w: 0.55, h: 0.55, ht: 0.05, lines: ["LM3", "6K"] },
    { x: 0.95, y: 3.55, w: 0.36, h: 0.62, ht: 0.045, lines: ["NX", "92A"] },
  ];
  ICS.forEach((c, i) => {
    foot(c.x, c.y, c.w, c.h, 0.8);
    const m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: icTex(c.lines, c.w, c.h, 300 + i), metalness: 0, roughness: 0.52, clearcoat: 0.2, clearcoatRoughness: 0.5 });
    // only the top face shows the marking: material array per RoundedBox group is not available, so map the whole box
    add(rbox(c.w, c.h, c.ht, 0.01), m, c.x, c.y, bt + 0.006 + c.ht / 2);
  });

  /* shield cans */
  const SHIELDS = [
    { x: 2.0, y: 2.08, w: 1.86, h: 2.36 },
    { x: 2.25, y: 3.98, w: 1.42, h: 1.0 },
    { x: -2.3, y: 2.7, w: 1.2, h: 0.38 },
  ];
  for (const s of SHIELDS) {
    foot(s.x, s.y, s.w, s.h, 1.0, 0.06);
    const sm = MAT.shield.clone(); sm.map = shieldTex(s.w, s.h, Math.round(s.x * 100 + s.y * 7));
    sm.normalMap = shieldNormal(s.w, s.h, Math.round(s.x * 100 + s.y * 7)); sm.normalScale = new THREE.Vector2(0.6, 0.6);
    add(rbox(s.w, s.h, 0.11, 0.034, 5), sm, s.x, s.y, bt + 0.055);
    // stamped stiffening rib
    add(rbox(s.w - 0.24, 0.05, 0.02, 0.008), MAT.shield, s.x, s.y + s.h * 0.18, bt + 0.11);
  }

  /* board-to-board connectors with stainless plugs and flex tails */
  const CONN = [
    { id: "batt", x: -0.55, y: 1.0, w: 0.95, h: 0.32, rot: 0 },
    { id: "disp", x: 0.4, y: 1.0, w: 0.75, h: 0.3, rot: 0 },
    { id: "cam1", x: -2.15, y: 4.42, w: 0.7, h: 0.28, rot: 0 },
    { id: "cam2", x: -0.12, y: 4.42, w: 0.62, h: 0.26, rot: 0 },
    { id: "cam3", x: 2.78, y: 5.05, w: 0.6, h: 0.26, rot: Math.PI / 2 },
  ];
  const CON = {};
  for (const c of CONN) {
    const vertical = c.rot !== 0;
    const fw = vertical ? c.h : c.w, fh = vertical ? c.w : c.h;
    foot(c.x, c.y, fw, fh, 0.9, 0.05);
    add(rbox(c.w, c.h, 0.05, 0.008), MAT.plastic, c.x, c.y, bt + 0.025, c.rot);
    // pin rows
    const n = Math.round(c.w / 0.05);
    for (const side of [-1, 1]) {
      const pins = new THREE.InstancedMesh(new THREE.BoxGeometry(0.022, 0.05, 0.018), MAT.gold, n);
      const m4 = new THREE.Matrix4();
      for (let i = 0; i < n; i++) {
        const u = -c.w / 2 + 0.03 + (i / (n - 1)) * (c.w - 0.06);
        const v = side * (c.h / 2 + 0.02);
        const px = vertical ? c.x - v : c.x + u, py = vertical ? c.y + u : c.y + v;
        m4.makeRotationZ(c.rot).setPosition(px, py, bt + 0.009);
        pins.setMatrixAt(i, m4);
      }
      pins.castShadow = pins.receiveShadow = true;
      G.add(pins);
    }
    // stainless plug stiffener on top
    add(rbox(c.w + 0.06, c.h + 0.06, 0.022, 0.008), MAT.steel, c.x, c.y, bt + 0.061, c.rot);
    CON[c.id] = { ...c, zTop: bt + 0.072 };
  }

  /* stamped stainless brackets with cut-outs */
  const bracketGeo = (w, h, holes) => {
    const sh = rrShape(w, h, 0.05);
    for (const [hx, hy, hw, hh] of holes) sh.holes.push(rrShape(hw, hh, Math.min(hw, hh) * 0.3, hx, hy, new THREE.Path()));
    for (const sx of [-1, 1]) { const p = new THREE.Path(); p.absarc(sx * (w / 2 - 0.12), 0, 0.045, 0, Math.PI * 2, true); sh.holes.push(p); }
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.014, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 2, curveSegments: 16 });
    return g;
  };
  /* brackets with screws over the battery/display connectors */
  const screwGeo = (() => {
    const pts = [[0.0001, 0.026], [0.04, 0.026], [0.058, 0.02], [0.068, 0.008], [0.07, 0.0]].map(([r, z]) => new THREE.Vector2(r, z));
    const g = new THREE.LatheGeometry(pts, 48); g.rotateX(Math.PI / 2); return g;
  })();
  const screw = (x, y, z) => {
    foot(x, y, 0.16, 0.16, 0.6, 0.03);
    add(screwGeo, MAT.screw, x, y, z);
    const slotA = add(new THREE.BoxGeometry(0.07, 0.014, 0.01), MAT.black, x, y, z + 0.024);
    const slotB = add(new THREE.BoxGeometry(0.014, 0.07, 0.01), MAT.black, x, y, z + 0.024);
    slotA.castShadow = slotB.castShadow = false;
  };
  {
    const bx = -0.07, by = 1.0, bw = 2.25, bh = 0.5;
    foot(bx, by, bw, bh, 0.9, 0.04);
    add(bracketGeo(bw, bh, [[-0.48, 0, 0.6, 0.2], [0.47, 0, 0.5, 0.18]]), MAT.bracket, bx, by, bt + 0.075);
    screw(bx - bw / 2 + 0.12, by, bt + 0.089);
    screw(bx + bw / 2 - 0.12, by, bt + 0.089);
  }
  {
    const bx = -1.15, by = 4.42, bw = 2.65, bh = 0.42;
    foot(bx, by, bw, bh, 0.9, 0.04);
    add(bracketGeo(bw, bh, [[-1.0, 0, 0.45, 0.16], [1.03, 0, 0.4, 0.15], [0.0, 0.06, 0.9, 0.08]]), MAT.bracket, bx, by, bt + 0.075);
    screw(bx - bw / 2 + 0.12, by, bt + 0.089);
    screw(bx + bw / 2 - 0.12, by, bt + 0.089);
  }
  // board mounting screws
  for (const [x, y] of [[-3.0, 0.85], [3.0, 0.85], [3.0, 4.55], [-3.0, 4.5], [2.55, 6.85]]) screw(x, y, bt);

  /* coax antenna cable with clips */
  {
    const pts = [[-1.32, 4.05, bt + 0.05], [-1.32, 3.7, bt + 0.035], [-1.32, 1.85, bt + 0.035], [-1.6, 1.5, bt + 0.035], [-1.6, 0.66, bt + 0.035], [-1.6, 0.4, bt + 0.0], [-1.6, 0.2, -0.05], [-2.95, 0.2, -0.05]];
    const path = filletPath(pts, 0.22, 10);
    const curve = new THREE.CatmullRomCurve3(path, false, "catmullrom", 0.1);
    add(new THREE.TubeGeometry(curve, 400, 0.03, 16, false), MAT.coax);
    // U.FL connector at the top end
    const uf = new THREE.LatheGeometry([[0.0001, 0.05], [0.075, 0.05], [0.085, 0.03], [0.085, 0.0]].map(([r, z]) => new THREE.Vector2(r, z)), 32);
    uf.rotateX(Math.PI / 2);
    add(uf, MAT.steel, -1.32, 4.08, bt);
    foot(-1.32, 4.08, 0.18, 0.18, 0.7, 0.03);
    // clips
    for (const y of [3.0, 2.25]) { add(rbox(0.13, 0.06, 0.03, 0.01), MAT.black, -1.32, y, bt + 0.07); }
    // keep passives off the cable
    FOOT.push({ x: -1.32, y: 2.8, w: 0.1, h: 2.4, ao: 0, pad: 0.04 });
    FOOT.push({ x: -1.6, y: 1.05, w: 0.1, h: 0.9, ao: 0, pad: 0.04 });
    FOOT.push({ x: -1.46, y: 1.68, w: 0.4, h: 0.4, ao: 0, pad: 0.02 });
  }

  /* camera modules (lens faces toward the back glass, aligned with the shell lenses) */
  const camY = BY;
  const MODS = [
    { L: LENSES[0], w: 2.02, h: 2.02, lens: 0.74, conn: "cam1" },
    { L: LENSES[1], w: 1.72, h: 1.72, lens: 0.64, conn: "cam2" },
    { L: LENSES[2], w: 1.22, h: 2.05, lens: 0.5, conn: "cam3", dy: -0.08 },
  ];
  // thin glass is drawn as an additive reflection layer, so the barrel steps, blades and rear element stay visible through it
  const glassLayer = (range, ior, env, tint = 0xffffff) => new THREE.MeshPhysicalMaterial({
    color: 0x000000, metalness: 0, roughness: 0.015, specularIntensity: 1, specularColor: new THREE.Color(tint), ior: 1.77,
    iridescence: range ? 1 : 0, iridescenceIOR: ior || 1.3, iridescenceThicknessRange: range || [100, 400],
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, envMapIntensity: env,
  });
  const SAPPHIRE = glassLayer(null, 1.3, 0.45);
  const COAT_A = glassLayer([300, 360], 1.9, 1.5, 0x3cf0c8); // cyan-green coating
  const COAT_B = glassLayer([470, 520], 1.9, 0.9, 0x8a4cff); // violet coating
  Object.assign(MAT, { sapphire: SAPPHIRE, coatA: COAT_A, coatB: COAT_B });
  const latheZ = (pts, seg = 128) => { const g = new THREE.LatheGeometry(pts.map(([r, z]) => new THREE.Vector2(r, z)), seg); g.rotateX(Math.PI / 2); return g; };
  const domeGeo = (rad, h, seg = 128) => { const pts = []; for (let i = 0; i <= 28; i++) { const rr = rad * (1 - i / 28); pts.push([Math.max(rr, 1e-4), h * Math.sqrt(Math.max(0, 1 - (rr / rad) ** 2))]); } return latheZ(pts, seg); };
  function lensStack(x, y, R, zBase) {
    const zt = 0.345; // top of the decorative ring
    const at = (geo, mat, z) => add(geo, mat, x, y, zt + z);
    // housing tube rising out of the module
    at(latheZ([[R + 0.1, zBase - zt], [R + 0.1, -0.05]]), MAT.plate, 0);
    // polished decorative ring with a diamond-cut chamfer
    at(latheZ([[R + 0.1, -0.05], [R + 0.1, -0.012], [R + 0.086, 0.0], [R + 0.02, 0.0], [R + 0.004, -0.012]]), MAT.trim, 0);
    // sapphire cover glass
    at(new THREE.CircleGeometry(R + 0.006, 128), SAPPHIRE, -0.013);
    // stepped inner barrel wall
    const s1 = R * 0.86, s2 = R * 0.72, s3 = R * 0.6;
    at(latheZ([[R + 0.004, -0.012], [R, -0.036], [s1, -0.036], [s1, -0.07], [s2, -0.07], [s2, -0.105], [s3, -0.105], [s3, -0.13]]), MAT.barrelIn, 0);
    // bright retaining rings on the step lips
    at(latheZ([[s1 + 0.014, -0.0355], [s1 + 0.002, -0.0355], [s1, -0.042]]), MAT.trim, 0);
    at(latheZ([[s2 + 0.01, -0.0695], [s2 + 0.001, -0.0695], [s2, -0.075]]), MAT.trim, 0);
    // front element, coated
    at(domeGeo(s1, 0.026), COAT_A, -0.042);
    // aperture: seven overlapping blades leaving a heptagon opening
    const nB = 7, rin = R * 0.3, rout = s2;
    for (let b = 0; b < nB; b++) {
      const a0 = (b / nB) * Math.PI * 2, a1 = ((b + 1) / nB) * Math.PI * 2, tw = 0.5;
      const sh = new THREE.Shape();
      sh.moveTo(Math.cos(a0) * rin, Math.sin(a0) * rin);
      sh.lineTo(Math.cos(a1) * rin, Math.sin(a1) * rin);
      for (let k = 0; k <= 12; k++) { const a = a1 + tw - (k / 12) * (a1 - a0 + 0.35); sh.lineTo(Math.cos(a) * rout, Math.sin(a) * rout); }
      sh.closePath();
      at(new THREE.ShapeGeometry(sh, 4), MAT.blade, -0.098 - b * 0.0012);
    }
    // middle element (coated) above the blades, rear element below
    at(domeGeo(s2 * 0.98, 0.018), COAT_B, -0.07);
    at(domeGeo(rin * 1.25, 0.012), MAT.rearGlass, -0.12);
    at(new THREE.CircleGeometry(rin * 1.3, 64), MAT.black, -0.125);
  }
  for (const m of MODS) {
    const x = m.L.x, y = camY + m.L.y + (m.dy || 0);
    const z0 = Z.plate, z1 = 0.17;
    add(rbox(m.w, m.h, z1 - z0, 0.06, 4), MAT.camCan, x, y, (z0 + z1) / 2);
    // top cover plate (darker anodised)
    add(rbox(m.w - 0.1, m.h - 0.1, 0.02, 0.05), MAT.plate, x, y, z1 + 0.005);
    lensStack(x, camY + m.L.y, m.lens, z1 + 0.012);
  }
  // flash / ToF board on the strip
  add(rbox(0.7, 0.62, 0.08, 0.02), MAT.camCan, FLASH.x, camY + FLASH.y, 0.18);
  add(rbox(0.5, 0.5, 0.12, 0.02), MAT.black, TOF.x, camY + TOF.y, 0.2);

  /* flexes from camera modules to their connectors */
  const flex = (pts, width, mat = MAT.flex, r = 0.25) => add(ribbonGeo(filletPath(pts, r, 10), width), mat);
  {
    const c1 = CON.cam1, c2 = CON.cam2, c3 = CON.cam3;
    flex([[c1.x, camY - 1.02, 0.1], [c1.x, camY - 1.15, CON.cam1.zTop + 0.012], [c1.x, c1.y, c1.zTop + 0.012]], 0.5, MAT.flex, 0.1);
    flex([[c2.x, camY - 0.87, 0.1], [c2.x, camY - 0.98, c2.zTop + 0.012], [c2.x, c2.y, c2.zTop + 0.012]], 0.45, MAT.flex, 0.1);
    flex([[LENSES[2].x + 0.62, camY - 0.6, 0.1], [2.2, camY - 0.6, 0.11], [c3.x, c3.y - 0.15, c3.zTop + 0.012], [c3.x, c3.y, c3.zTop + 0.012]], 0.4, MAT.flex, 0.2);
  }

  /* battery */
  {
    const w = 5.9, h = 6.9, cy = 0.42 - h / 2;
    const g = slab(w, h, 0.4, Z.plate + 0.01, 0.2, 0.06, 0.05, 0.04, 0.03, { arcSeg: 16, filletSeg: 6 });
    const bm = new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: batteryTex(w, h), metalness: 0.45, roughness: 0.42, normalMap: BEAD, normalScale: new THREE.Vector2(0.05, 0.05) });
    // slab maps uv from (-w/2..w/2) so flip v for a top-down print
    bm.map.flipY = true;
    const m = add(g, bm, 0, cy, 0);
    // battery flex up to the board connector
    const c = CON.batt;
    flex([[c.x, 0.3, 0.19], [c.x, 0.5, 0.2], [c.x, 0.62, c.zTop + 0.03], [c.x, c.y, c.zTop + 0.012]], 0.62, MAT.flexAmber, 0.1);
    // display flex dives down past the board edge
    const d = CON.disp;
    flex([[d.x, d.y, d.zTop + 0.012], [d.x, 0.66, d.zTop + 0.02], [d.x, 0.5, -0.05], [d.x + 0.4, 0.5, -0.12]], 0.5, MAT.flex, 0.08);
  }

  /* passives: decoupling field around the SoC, then scatter */
  const KINDS = {
    c0201: { L: 0.06, W: 0.03, H: 0.03, kind: "c" },
    c0402: { L: 0.1, W: 0.05, H: 0.05, kind: "c" },
    c0603: { L: 0.16, W: 0.08, H: 0.08, kind: "c" },
    r0201: { L: 0.06, W: 0.03, H: 0.025, kind: "r" },
    r0402: { L: 0.1, W: 0.05, H: 0.035, kind: "r" },
    l0805: { L: 0.2, W: 0.125, H: 0.1, kind: "l" },
  };
  const place = (x, y, k, rot) => {
    const K = KINDS[k];
    const hw = (rot ? K.W : K.L) / 2, hh = (rot ? K.L : K.W) / 2;
    if (!inBoard(x, y, 0.04) || !freeAt(x, y, hw, hh)) return false;
    PASS.push({ x, y, L: K.L, W: K.W, H: K.H, rot, kind: K.kind, z: bt, ext: Math.max(hw, hh) });
    return true;
  };
  // rows hugging the SoC
  {
    const { x, y, sub } = SOC;
    for (let ring = 0; ring < 3; ring++) {
      const off = sub / 2 + 0.08 + ring * 0.085;
      for (let k = -9; k <= 9; k++) {
        const u = k * 0.085;
        if (rnd() < 0.25) continue;
        const kind = ring === 0 ? "c0201" : pick(["c0201", "c0402", "r0201"]);
        place(x + u, y + off, kind, 0);
        place(x + u, y - off, kind, 0);
        place(x + off, y + u, kind, 1);
        place(x - off, y + u, kind, 1);
      }
    }
  }
  // grid clusters (look like routed arrays)
  for (let cl = 0; cl < 40; cl++) {
    const cx = BX0 + rnd() * BWD, cy = BY0 + rnd() * BHT;
    const kind = pick(["c0201", "c0201", "c0402", "c0402", "r0201", "r0402", "c0603", "l0805"]);
    const rot = rnd() < 0.5 ? 1 : 0;
    const nx = 2 + Math.floor(rnd() * 6), ny = 1 + Math.floor(rnd() * 4);
    const K = KINDS[kind], sx = (rot ? K.W : K.L) + 0.05, sy = (rot ? K.L : K.W) + 0.05;
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) if (rnd() > 0.15) place(cx + i * sx, cy + j * sy, kind, rot);
  }
  // loose scatter
  for (let i = 0; i < 2600; i++) {
    const x = BX0 + rnd() * BWD, y = BY0 + rnd() * BHT;
    place(x, y, pick(["c0201", "c0201", "c0402", "c0402", "r0201", "c0603", "r0402", "l0805"]), rnd() < 0.5 ? 1 : 0);
  }
  // a few small inductors / crystals as larger parts
  for (let i = 0; i < 18; i++) {
    const x = BX0 + rnd() * BWD, y = BY0 + rnd() * BHT, w = 0.22 + rnd() * 0.12, h = 0.18 + rnd() * 0.1;
    if (!inBoard(x, y, 0.15) || !freeAt(x, y, w / 2, h / 2)) continue;
    foot(x, y, w, h, 0.5, 0.03);
    add(rbox(w, h, 0.07, 0.012), rnd() < 0.5 ? MAT.plastic : MAT.passiveEnd, x, y, bt + 0.035);
  }
  // instanced passives
  {
    const n = PASS.length;
    const body = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), MAT.passiveBody, n);
    const ends = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), MAT.passiveEnd, n * 2);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
    const col = new THREE.Color();
    PASS.forEach((P, i) => {
      const rz = P.rot ? Math.PI / 2 : 0;
      q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), rz);
      const z = P.z;
      const bodyL = P.kind === "l" ? P.L : P.L * 0.66;
      s.set(bodyL, P.W, P.H); p.set(P.x, P.y, z + P.H / 2 + 0.003);
      body.setMatrixAt(i, m4.compose(p, q, s));
      if (P.kind === "c") col.setHSL(0.08 + rnd() * 0.03, 0.35 + rnd() * 0.15, 0.3 + rnd() * 0.12);
      else if (P.kind === "r") { const v = 0.015 + rnd() * 0.015; col.setRGB(v, v, v * 1.08); }
      else { const v = 0.14 + rnd() * 0.1; col.setRGB(v, v, v * 1.04); }
      body.setColorAt(i, col.convertSRGBToLinear());
      for (const sd of [-1, 1]) {
        const eL = P.kind === "l" ? 1e-4 : P.L * 0.17;
        s.set(eL, P.W * 1.02, P.H * 1.02);
        const off = sd * (P.L / 2 - eL / 2);
        p.set(P.x + (P.rot ? 0 : off), P.y + (P.rot ? off : 0), z + P.H / 2 + 0.003);
        ends.setMatrixAt(i * 2 + (sd > 0 ? 1 : 0), m4.compose(p, q, s));
      }
    });
    // solder fillets: concave meniscus from each end cap down onto its pad
    const fillet = (() => {
      const sh = new THREE.Shape();
      sh.moveTo(0, 0); sh.lineTo(1, 0);
      for (let k = 1; k <= 8; k++) { const th = (k / 8) * Math.PI / 2; sh.lineTo(1 - Math.sin(th), 1 - Math.cos(th)); }
      sh.closePath();
      const g = new THREE.ExtrudeGeometry(sh, { depth: 1, bevelEnabled: false, curveSegments: 8 });
      g.translate(0, 0, -0.5); g.rotateX(Math.PI / 2); // profile x outward, y -> z up, width along y
      return g;
    })();
    const fl = new THREE.InstancedMesh(fillet, MAT.solder, n * 2);
    const qz = new THREE.Quaternion(), zAxis = new THREE.Vector3(0, 0, 1);
    PASS.forEach((P, i) => {
      for (const sd of [-1, 1]) {
        const rz = (P.rot ? Math.PI / 2 : 0) + (sd < 0 ? Math.PI : 0);
        qz.setFromAxisAngle(zAxis, rz);
        const lenOut = P.kind === "l" ? P.L * 0.12 : P.L * 0.22, hgt = P.H * (0.45 + rnd() * 0.2);
        s.set(lenOut, P.W * 0.96, hgt);
        const off = sd * (P.L / 2);
        p.set(P.x + (P.rot ? 0 : off), P.y + (P.rot ? off : 0), P.z + 0.003);
        fl.setMatrixAt(i * 2 + (sd > 0 ? 1 : 0), m4.compose(p, qz, s));
      }
    });
    fl.castShadow = false; fl.receiveShadow = true;
    G.add(fl);
    // tin end caps are not all the same grey
    for (let i = 0; i < n * 2; i++) { const v = 0.62 + rnd() * 0.3; ends.setColorAt(i, col.setRGB(v, v, v * (0.97 + rnd() * 0.04))); }
    ends.instanceColor.needsUpdate = true;
    body.instanceColor.needsUpdate = true;
    body.castShadow = body.receiveShadow = true;
    ends.castShadow = ends.receiveShadow = true;
    G.add(body, ends);
  }

  /* logic board (after all parts so the texture knows every footprint) */
  {
    const r = 0.14;
    const shape = roundedPoly([[BX0, BY0], [BX1, BY0], [BX1, BY1], [STRIP_X, BY1], [STRIP_X, BOARD_TOP_Y], [BX0, BOARD_TOP_Y]], r);
    const g = new THREE.ExtrudeGeometry(shape, { depth: Z.boardTop - Z.boardBot, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 1, curveSegments: 8 });
    const pos = g.attributes.position, uv = g.attributes.uv;
    for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) - BX0) / BWD, (pos.getY(i) - BY0) / BHT);
    uv.needsUpdate = true;
    const T = drawBoard();
    const bm = new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: T.map, roughness: 1, metalness: 1, roughnessMap: T.orm, metalnessMap: T.orm, bumpMap: T.bump, bumpScale: 0.6, clearcoat: 0.1, clearcoatRoughness: 0.45 });
    MAT.board = bm;
    const m = add(g, bm, 0, 0, Z.boardBot - 0.004);
    m.castShadow = false;
  }

  return { group: G, MAT, SOC, Z };
}
