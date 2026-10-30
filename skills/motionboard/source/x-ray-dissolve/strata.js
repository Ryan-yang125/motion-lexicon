// Strata phone shell: geometry, textures and materials (from light-reveal, glass etch changed to the Strata glyph)
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

/* ================= procedural geometry ================= */
// closed rounded-rectangle outline, CCW, with outward 2D normals
function rrOutline(w, h, r, arcSeg = 24) {
  const pts = [];
  const cs = [[w / 2 - r, h / 2 - r, 0], [-w / 2 + r, h / 2 - r, 0.5], [-w / 2 + r, -h / 2 + r, 1], [w / 2 - r, -h / 2 + r, 1.5]];
  for (const [cx, cy, a0] of cs) {
    for (let i = 0; i <= arcSeg; i++) {
      const a = (a0 + (i / arcSeg) * 0.5) * Math.PI;
      const nx = Math.cos(a), ny = Math.sin(a);
      pts.push({ x: cx + nx * r, y: cy + ny * r, nx, ny });
    }
  }
  return pts;
}
// slab swept along an outline: flat back cap at zb, flat front cap at zf,
// elliptical fillets (rbo x rbz) at the back edge and (rfo x rfz) at the front edge
function slab(w, h, r, zf, zb, rbo, rbz, rfo, rfz, opts = {}) {
  const out = rrOutline(w, h, r, opts.arcSeg || 28);
  const N = out.length;
  const prof = [];
  const S = opts.filletSeg || 14;
  for (let i = 0; i <= S; i++) {
    const th = (i / S) * Math.PI / 2;
    const n = [rbz * Math.sin(th), rbo * Math.cos(th)];
    const l = Math.hypot(n[0], n[1]) || 1;
    prof.push({ o: rbo * (1 - Math.sin(th)), z: zb - rbz * (1 - Math.cos(th)), nr: n[0] / l, nz: n[1] / l });
  }
  if (rfo > 0) {
    for (let i = 0; i <= S; i++) {
      const ph = (i / S) * Math.PI / 2;
      const n = [rfz * Math.cos(ph), -rfo * Math.sin(ph)];
      const l = Math.hypot(n[0], n[1]) || 1;
      prof.push({ o: rfo * (1 - Math.cos(ph)), z: zf + rfz * (1 - Math.sin(ph)), nr: n[0] / l, nz: n[1] / l });
    }
  } else {
    prof.push({ o: 0, z: zf, nr: 1, nz: 0 });
  }
  const P = prof.length;
  const pos = [], nor = [], uv = [], idx = [];
  const U = (x, y) => [x / w + 0.5, y / h + 0.5];
  for (let j = 0; j < P; j++) {
    const p = prof[j];
    for (let i = 0; i < N; i++) {
      const q = out[i];
      const x = q.x - q.nx * p.o, y = q.y - q.ny * p.o;
      pos.push(x, y, p.z);
      const nx = q.nx * p.nr, ny = q.ny * p.nr, nz = p.nz;
      const l = Math.hypot(nx, ny, nz);
      nor.push(nx / l, ny / l, nz / l);
      uv.push(...U(x, y));
    }
  }
  for (let j = 0; j < P - 1; j++) {
    for (let i = 0; i < N; i++) {
      const a = j * N + i, b = j * N + ((i + 1) % N), c = (j + 1) * N + i, d = (j + 1) * N + ((i + 1) % N);
      idx.push(a, c, b, b, c, d);
    }
  }
  // caps
  const cap = (ring, z, nz) => {
    const base = pos.length / 3;
    pos.push(0, 0, z); nor.push(0, 0, nz); uv.push(...U(0, 0));
    for (let i = 0; i < N; i++) {
      const k = (ring * N + i) * 3;
      pos.push(pos[k], pos[k + 1], z); nor.push(0, 0, nz); uv.push(...U(pos[k], pos[k + 1]));
    }
    for (let i = 0; i < N; i++) {
      const a = base + 1 + i, b = base + 1 + ((i + 1) % N);
      if (nz > 0) idx.push(base, a, b); else idx.push(base, b, a);
    }
  };
  if (opts.holes) {
    // back cap with circular holes, triangulated with ShapeUtils (earcut)
    const contour = [];
    for (let i = 0; i < N; i++) { const k = i * 3; contour.push(new THREE.Vector2(pos[k], pos[k + 1])); }
    const holes = opts.holes.map(({ x, y, r: hr }) => {
      const hp = [];
      for (let i = 0; i < 96; i++) { const a = -(i / 96) * Math.PI * 2; hp.push(new THREE.Vector2(x + hr * Math.cos(a), y + hr * Math.sin(a))); }
      return hp;
    });
    const tris = THREE.ShapeUtils.triangulateShape(contour, holes);
    const all = contour.concat(...holes);
    const base = pos.length / 3;
    for (const v of all) { pos.push(v.x, v.y, zb); nor.push(0, 0, 1); uv.push(...U(v.x, v.y)); }
    for (const [a, b, c] of tris) idx.push(base + a, base + b, base + c);
  } else {
    cap(0, zb, 1);
  }
  if (!opts.noFront) cap(P - 1, zf, -1);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

// lathe around z axis; profile = [[r, z], ...] ; arcs given as helpers
function arcPts(cx, cz, rad, a0, a1, n) {
  const p = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + (a1 - a0) * (i / n);
    p.push([cx + rad * Math.cos(a), cz + rad * Math.sin(a)]);
  }
  return p;
}
function lathe(profile, seg = 160) {
  const g = new THREE.LatheGeometry(profile.map(([r, z]) => new THREE.Vector2(r, z)), seg);
  g.rotateX(Math.PI / 2); // lathe y-axis -> z-axis
  return g;
}
function disc(r, z, seg = 160) {
  const g = new THREE.CircleGeometry(r, seg);
  g.translate(0, 0, z);
  return g;
}

/* ================= procedural textures ================= */
function canvasTex(w, h, draw, srgb = false) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}
function rrPath(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

/* ================= phone design: STRATA ================= */
const PW = 7.2, PH = 15.0, PR = 1.12, PD = 0.8;
const ZB = PD / 2; // back plane of the aluminium body
const GW = PW - 0.24, GH = PH - 0.24, GR = PR - 0.12; // back glass
const GZ = ZB + 0.016; // glass top
const BW = 6.56, BH = 2.6, BR = 1.05; // camera bar
const BY = PH / 2 - 0.34 - BH / 2;
const BZ = GZ + 0.11; // camera bar top
const LENSES = [
  { x: -2.06, y: 0, R: 0.94 },
  { x: -0.05, y: 0, R: 0.82 },
  { x: 1.62, y: 0, R: 0.62 },
];
const FLASH = { x: 2.7, y: 0.5, R: 0.27 };
const MIC = { x: 2.7, y: -0.07, R: 0.055 };
const TOF = { x: 2.7, y: -0.6, R: 0.22 };

const VARIANTS = {
  orange: { metal: 0xf47a2c, metalRough: 0.42, glass: 0xff7a24, glassRough: 0.55 },
  silver: { metal: 0xadadab, metalRough: 0.46, glass: 0xdedcd8, glassRough: 0.55 },
  blue: { metal: 0x4c6290, metalRough: 0.4, glass: 0x34466a, glassRough: 0.55 },
};

// textures shared by all phones
const TEX = {};
function drawGlassAO(g, w, h, falloff) {
  g.fillStyle = "#fff"; g.fillRect(0, 0, w, h);
  if (falloff === "diag") {
    // line-up: soft key from the upper left, glass falls off toward the lower right
    const lg = g.createLinearGradient(0, 0, w * 0.6, h);
    lg.addColorStop(0.0, "#ffffff"); lg.addColorStop(0.35, "#ececec"); lg.addColorStop(1.0, "#8c8c8c");
    g.fillStyle = lg; g.fillRect(0, 0, w, h);
  } else if (falloff) {
    // close-up only: the key pools on the camera bar and falls off down the back
    const lg = g.createLinearGradient(0, 0, 0, h);
    lg.addColorStop(0.0, "#ffffff"); lg.addColorStop(0.2, "#f6f6f6"); lg.addColorStop(0.44, "#3c3c3c"); lg.addColorStop(1.0, "#202020");
    g.fillStyle = lg; g.fillRect(0, 0, w, h);
  }
  const sx = w / GW, sy = h / GH;
  const x = (-BW / 2 + GW / 2) * sx, y = (GH / 2 - (BY + BH / 2)) * sy;
  g.filter = "blur(10px)";
  g.fillStyle = "rgba(0,0,0,0.55)";
  rrPath(g, x - 4, y - 4, BW * sx + 8, BH * sy + 8, BR * sx + 4); g.fill();
  g.filter = "blur(3px)";
  g.fillStyle = "rgba(0,0,0,0.5)";
  rrPath(g, x, y, BW * sx, BH * sy, BR * sx); g.fill();
  g.filter = "none";
  // edge darkening where the glass meets the frame lip
  g.strokeStyle = "rgba(0,0,0,0.35)"; g.lineWidth = 3;
  rrPath(g, 1.5, 1.5, w - 3, h - 3, GR * sx); g.stroke();
}
// satin-etched glass: fine seeded noise as a normal map
TEX.frost = (() => {
  let a = 0x9e3779b9;
  const rnd = () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const t = canvasTex(1024, 1024, (g, w, h) => {
    const img = g.createImageData(w, h);
    for (let i = 0; i < w * h; i++) {
      img.data[i * 4] = 128 + (rnd() - 0.5) * 120;
      img.data[i * 4 + 1] = 128 + (rnd() - 0.5) * 120;
      img.data[i * 4 + 2] = 255; img.data[i * 4 + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
})();
TEX.glassAO = canvasTex(512, 1024, (g, w, h) => drawGlassAO(g, w, h, false));
TEX.glassFall = canvasTex(512, 1024, (g, w, h) => drawGlassAO(g, w, h, true));
TEX.glassDiag = canvasTex(512, 1024, (g, w, h) => drawGlassAO(g, w, h, "diag"));
TEX.barAO = canvasTex(1024, 512, (g, w, h) => {
  g.fillStyle = "#fff"; g.fillRect(0, 0, w, h);
  const sx = w / BW, sy = h / BH;
  const P = (o) => [(o.x + BW / 2) * sx, (BH / 2 - o.y) * sy];
  g.filter = "blur(7px)";
  for (const L of LENSES) {
    const [cx, cy] = P(L);
    g.fillStyle = "rgba(0,0,0,0.6)";
    g.beginPath(); g.arc(cx, cy, (L.R + 0.07) * sx, 0, Math.PI * 2); g.fill();
  }
  for (const o of [FLASH]) {
    const [cx, cy] = P(o);
    g.fillStyle = "rgba(0,0,0,0.45)";
    g.beginPath(); g.arc(cx, cy, (o.R + 0.08) * sx, 0, Math.PI * 2); g.fill();
  }
  g.filter = "none";
});
// etched wordmark on the frosted glass: glossy letters (roughness map, G channel)
// Strata glyph: three offset strata bars, drawn centred at (cx, cy) with total width `size`
function drawGlyph(g, cx, cy, size) {
  const bh = size * 0.2, gap = size * 0.09;
  const bars = [[0.66, -0.17], [1.0, 0.0], [0.78, 0.11]];
  bars.forEach(([bw, off], i) => {
    const w = bw * size, x = cx + off * size - w / 2, y = cy + (i - 1) * (bh + gap) - bh / 2;
    rrPath(g, x, y, w, bh, bh / 2); g.fill();
  });
}
// etched glyph on the frosted glass: glossy mark (roughness map, G channel)
// frosted glass roughness: per-texel grain (G channel) so the highlight breaks into fine sparkle, glyph etched glossy
TEX.glassRough = canvasTex(2048, 4096, (g, w, h) => {
  let a = 0x51ed27;
  const rnd = () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const img = g.createImageData(w, h);
  for (let i = 0; i < w * h; i++) {
    const v = 255 - Math.floor(rnd() * rnd() * 120);
    img.data[i * 4] = 0; img.data[i * 4 + 1] = v; img.data[i * 4 + 2] = 0; img.data[i * 4 + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  g.fillStyle = "#003a00";
  drawGlyph(g, w / 2, h * 0.6, 240);
});
TEX.flashBump = canvasTex(512, 512, (g, w, h) => {
  // fresnel diffuser: fine concentric grooves
  const img = g.createImageData(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const r = Math.hypot(x - w / 2, y - h / 2) / (w / 2);
    const v = r > 0.97 ? 128 : Math.round(128 + 110 * Math.sin(r * 2 * Math.PI * 16));
    const k = (y * w + x) * 4;
    img.data[k] = img.data[k + 1] = img.data[k + 2] = v; img.data[k + 3] = 255;
  }
  g.putImageData(img, 0, 0);
});
TEX.flashAlbedo = canvasTex(512, 512, (g, w, h) => {
  const rg = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  rg.addColorStop(0, "#f4ecd6"); rg.addColorStop(0.8, "#e6dcc2"); rg.addColorStop(1, "#b9b09a");
  g.fillStyle = rg; g.fillRect(0, 0, w, h);
  // two LED dies behind the diffuser
  for (const dx of [-26, 26]) {
    g.fillStyle = "#cdb27a"; g.fillRect(w / 2 + dx - 17, h / 2 - 17, 34, 34);
    g.fillStyle = "#e2cf98"; g.fillRect(w / 2 + dx - 11, h / 2 - 11, 22, 22);
  }
}, true);

function makeMaterials(v) {
  const M = {};
  M.metal = new THREE.MeshPhysicalMaterial({ color: v.metal, metalness: 1, roughness: v.metalRough, clearcoat: 0.35, clearcoatRoughness: 0.22 });
  M.polish = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(v.metal).lerp(new THREE.Color(0xffffff), 0.25), metalness: 1, roughness: 0.12 });
  M.glass = new THREE.MeshPhysicalMaterial({
    color: v.glass, metalness: 0, roughness: v.glassRough, roughnessMap: TEX.glassRough,
    clearcoat: 0.3, clearcoatRoughness: 0.45, ior: 1.5, specularIntensity: 0.8,
    aoMap: TEX.glassAO, aoMapIntensity: 1,
    normalMap: TEX.frost, normalScale: new THREE.Vector2(0.09, 0.09),
  });
  M.glass.normalMap = TEX.frost.clone(); M.glass.normalMap.repeat.set(6, 12); M.glass.normalMap.needsUpdate = true;
  M.bar = M.metal.clone();
  M.bar.aoMap = TEX.barAO; M.bar.aoMapIntensity = 1;
  M.front = new THREE.MeshPhysicalMaterial({ color: 0x050506, metalness: 0, roughness: 0.05, clearcoat: 1 });
  M.barrel = new THREE.MeshPhysicalMaterial({ color: 0x040405, metalness: 0.3, roughness: 0.5 });
  M.barrelDark = new THREE.MeshPhysicalMaterial({ color: 0x030303, metalness: 0, roughness: 0.75 });
  M.chrome = new THREE.MeshPhysicalMaterial({ color: 0x9a9ca0, metalness: 1, roughness: 0.16 });
  M.coverGlass = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0, roughness: 0.0, transmission: 1, thickness: 0.02, ior: 1.52,
    specularIntensity: 0.18,
    transparent: false,
  });
  M.element = new THREE.MeshPhysicalMaterial({
    color: 0x010102, metalness: 0, roughness: 0.03, specularIntensity: 0.45,
    iridescence: 1, iridescenceIOR: 1.85, iridescenceThicknessRange: [150, 350], ior: 1.8,
  });
  M.element2 = new THREE.MeshPhysicalMaterial({ color: 0x010102, metalness: 0, roughness: 0.03, clearcoat: 1, clearcoatRoughness: 0.02, iridescence: 1, iridescenceIOR: 2.0, iridescenceThicknessRange: [420, 900], ior: 1.9 });
  M.flash = new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: TEX.flashAlbedo, metalness: 0, roughness: 0.42, bumpMap: TEX.flashBump, bumpScale: 0.5 });
  M.flashCover = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.0, transmission: 1, thickness: 0.02, ior: 1.5, specularIntensity: 0.7 });
  M.tof = new THREE.MeshPhysicalMaterial({ color: 0x030305, metalness: 0, roughness: 0.04, specularIntensity: 0.3 });
  M.button = M.metal;
  return M;
}

/* ---------- assemblies ---------- */
const LENS_RI = 0.86; // aperture / outer radius
function lensAssembly(L, M) {
  const g = new THREE.Group();
  const R = L.R;
  const H = 0.15; // ring height above bar top
  const ri = R * LENS_RI;
  // anodised ring body: outer wall, rounded crown, narrow flat top
  const body = [[R + 0.012, -0.004], [R, 0.004]];
  body.push(...arcPts(R - 0.03, H - 0.03, 0.03, 0, Math.PI / 2, 10));
  body.push([ri + 0.04, H]);
  g.add(new THREE.Mesh(lathe(body), M.metal));
  // polished diamond-cut chamfer facing up and inward
  const ch = [[ri + 0.04, H], [ri + 0.004, H - 0.036], [ri, H - 0.042]];
  g.add(new THREE.Mesh(lathe(ch), M.polish));
  // short dark inner wall down to the cover glass
  g.add(new THREE.Mesh(lathe([[ri, H - 0.042], [ri, -0.11]]), M.barrelDark));
  // sapphire cover glass, recessed
  g.add(new THREE.Mesh(disc(ri, H - 0.055), M.coverGlass));
  // optical stack below: matte step, chrome retaining ring, second step, two coated elements
  const z1 = -0.02, z2 = -0.06;
  const step1 = new THREE.Mesh(new THREE.RingGeometry(ri * 0.80, ri, 160, 1), M.barrel);
  step1.position.z = z1; g.add(step1);
  g.add(new THREE.Mesh(lathe([[ri * 0.80, z1], [ri * 0.785, z1 - 0.006], [ri * 0.785, z2 + 0.004], [ri * 0.76, z2]]), M.chrome));
  const step2 = new THREE.Mesh(new THREE.RingGeometry(ri * 0.62, ri * 0.76, 160, 1), M.barrel);
  step2.position.z = z2; g.add(step2);
  const dome = (rad, z0, h) => {
    const pts = [];
    for (let i = 0; i <= 32; i++) {
      const r = rad * (1 - i / 32);
      pts.push([Math.max(r, 1e-4), z0 + h * Math.sqrt(Math.max(0, 1 - (r / rad) ** 2))]);
    }
    return lathe(pts);
  };
  const em = M.element.clone(); em.iridescenceThicknessRange = [100, [560, 640, 720][LENSES.indexOf(L)]]; M['el' + LENSES.indexOf(L)] = em;
  g.add(new THREE.Mesh(dome(ri * 0.62, z2, 0.12), em));
  g.add(new THREE.Mesh(disc(ri * 0.62, z2 - 0.001), M.barrelDark));
  g.position.set(L.x, L.y, BZ);
  return g;
}

function flashAssembly(M) {
  const g = new THREE.Group();
  const R = FLASH.R;
  const ring = [[R + 0.03, -0.01], [R + 0.03, 0.015], ...arcPts(R + 0.015, 0.015, 0.015, 0, Math.PI / 2, 6), [R, 0.03], [R, 0.022]];
  g.add(new THREE.Mesh(lathe(ring, 96), M.polish));
  g.add(new THREE.Mesh(lathe([[R, 0.022], [R, 0.004]], 96), M.barrelDark));
  g.add(new THREE.Mesh(disc(R, 0.004, 96), M.flash));
  g.add(new THREE.Mesh(disc(R, 0.024, 96), M.flashCover));
  g.position.set(FLASH.x, FLASH.y, BZ);
  return g;
}
function tofAssembly(M) {
  const g = new THREE.Group();
  const R = TOF.R;
  g.add(new THREE.Mesh(disc(R, 0.002, 96), M.tof));
  const ring = [[R + 0.012, -0.005], [R + 0.012, 0.003], [R, 0.003], [R, 0.0]];
  g.add(new THREE.Mesh(lathe(ring, 96), M.metal));
  g.position.set(TOF.x, TOF.y, BZ);
  const mic = new THREE.Mesh(lathe([[MIC.R, 0.001], [MIC.R, -0.03], [0.0001, -0.03]], 48), M.barrelDark);
  mic.position.set(MIC.x - TOF.x, MIC.y - TOF.y, 0);
  g.add(mic);
  return g;
}

function buildPhone(variantKey) {
  const M = makeMaterials(VARIANTS[variantKey]);
  const phone = new THREE.Group();
  // aluminium body
  const body = new THREE.Mesh(slab(PW, PH, PR, -PD / 2, ZB, 0.18, 0.2, 0.18, 0.2, { arcSeg: 36 }), M.metal);
  phone.add(body);
  // front glass (barely visible from behind)
  const front = new THREE.Mesh(slab(PW - 0.2, PH - 0.2, PR - 0.1, -PD / 2 - 0.012, -PD / 2 + 0.02, 0.02, 0.02, 0.02, 0.012), M.front);
  phone.add(front);
  // frosted back glass
  const glass = new THREE.Mesh(slab(GW, GH, GR, ZB - 0.05, GZ, 0.028, 0.022, 0, 0, { arcSeg: 36, noFront: true }), M.glass);
  phone.add(glass);
  // camera bar
  const bar = new THREE.Mesh(slab(BW, BH, BR, GZ - 0.02, BZ, 0.11, 0.1, 0, 0, { arcSeg: 36, noFront: true, holes: [...LENSES.map((L) => ({ x: L.x, y: L.y, r: L.R * LENS_RI + 0.004 })), { x: MIC.x, y: MIC.y, r: MIC.R }] }), M.bar);
  bar.position.y = BY;
  phone.add(bar);
  const cam = new THREE.Group();
  cam.position.y = BY;
  cam.position.z = 0;
  for (const L of LENSES) cam.add(lensAssembly(L, M));
  cam.add(flashAssembly(M));
  cam.add(tofAssembly(M));
  phone.add(cam);
  // side keys
  const keyGeo = (len) => new RoundedBoxGeometry(0.12, len, 0.34, 5, 0.05);
  const power = new THREE.Mesh(keyGeo(1.9), M.metal);
  power.position.set(PW / 2 + 0.005, 2.6, 0);
  phone.add(power);
  const ctl = new THREE.Mesh(keyGeo(1.25), M.metal);
  ctl.position.set(PW / 2 + 0.005, -1.6, 0);
  phone.add(ctl);
  for (const [y, len] of [[4.3, 0.7], [2.9, 1.2], [1.4, 1.2]]) {
    const k = new THREE.Mesh(keyGeo(len), M.metal);
    k.position.set(-PW / 2 - 0.005, y, 0);
    phone.add(k);
  }
  // antenna bands: thin dark inserts across the frame sides
  const bandMat = new THREE.MeshPhysicalMaterial({ color: 0x2a2a2a, roughness: 0.55, metalness: 0 });
  M.band = bandMat;
  for (const y of [PH / 2 - 1.6, -PH / 2 + 1.6]) {
    for (const sx of [-1, 1]) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.07, PD - 0.42), bandMat);
      b.position.set(sx * (PW / 2 + 0.0005), y, 0);
      phone.add(b);
    }
  }
  phone.userData.M = M;
  return phone;
}

export { drawGlyph, rrOutline, slab, arcPts, lathe, disc, canvasTex, rrPath, buildPhone, TEX, PW, PH, PR, PD, ZB, GW, GH, GR, GZ, BW, BH, BR, BY, BZ, LENSES, FLASH, MIC, TOF, LENS_RI };
