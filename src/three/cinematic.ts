// The /cinematic/ experiment: one continuous shot through the network,
// driven by the page's own scroll. Each <section data-focus> is a beat;
// the camera sits on a beat when that section is centred in the viewport
// and swings around the core between beats.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

type Kind = 'root' | 'group' | 'leaf';
type NodeDef = { id: string; kind: Kind; parent?: string; color?: string; label: string };

type GNode = {
  id: string;
  kind: Kind;
  parent: GNode | null;
  children: GNode[];
  color: THREE.Color;
  label: string;
  labelEl: HTMLElement;
  dir: THREE.Vector3; // outward direction of its cluster
  side: THREE.Vector3;
  rest: THREE.Vector3;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  radius: number;
  phase: number;
  revealAt: number;
  reveal: number;
  emph: number;
  flash: number;
  obj: THREE.Group;
  mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  halo: THREE.Sprite;
  shells: THREE.LineSegments<THREE.EdgesGeometry, THREE.LineBasicMaterial>[];
};

type Shot = 'hero' | 'about' | 'group' | 'leaf' | 'finale';
type Beat = {
  el: HTMLElement;
  node: GNode;
  shot: Shot;
  side: 'left' | 'right';
  chapter: string;
  centre: number;
};
type Pose = { cam: THREE.Vector3; target: THREE.Vector3; shiftX: number; shiftY: number; tint: THREE.Color };

const RADIUS: Record<Kind, number> = { root: 0.55, group: 0.3, leaf: 0.16 };
const FOV = 42;
const RING = 10;

export function start() {
  const canvas = document.getElementById('scene') as HTMLCanvasElement | null;
  const labelLayer = document.getElementById('labels');
  const data = document.getElementById('graph-data');
  if (!canvas || !labelLayer || !data) return;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch {
    return; // no WebGL: the page stays a plain, scrollable document
  }
  document.documentElement.classList.add('gl');

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const narrow = matchMedia('(max-width: 760px)');

  // ── Graph ────────────────────────────────────────────────────
  const defs = JSON.parse(data.textContent || '[]') as NodeDef[];
  const nodes: GNode[] = [];
  const byId = new Map<string, GNode>();
  for (const d of defs) {
    const labelEl = document.createElement('div');
    labelEl.className = `lbl lbl-${d.kind}`;
    labelEl.textContent = d.label;
    labelLayer.append(labelEl);
    const n = {
      id: d.id,
      kind: d.kind,
      parent: null,
      children: [],
      color: new THREE.Color(d.color || '#ffffff'),
      label: d.label,
      labelEl,
      dir: new THREE.Vector3(),
      side: new THREE.Vector3(),
      rest: new THREE.Vector3(),
      pos: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      radius: RADIUS[d.kind],
      phase: Math.random() * Math.PI * 2,
      revealAt: 0,
      reveal: 0,
      emph: 1,
      flash: 0,
    } as unknown as GNode;
    nodes.push(n);
    byId.set(n.id, n);
  }
  for (const d of defs) {
    const n = byId.get(d.id)!;
    const p = d.parent ? byId.get(d.parent) : undefined;
    if (p) {
      n.parent = p;
      p.children.push(n);
      if (n.kind === 'leaf') n.color.copy(p.color);
    }
  }
  const rootNode = nodes.find((n) => n.kind === 'root')!;
  const groups = nodes.filter((n) => n.kind === 'group');
  const edges = nodes.filter((n) => n.parent).map((n) => [n.parent!, n] as const);
  const neighbours = (n: GNode) => (n.parent ? [n.parent, ...n.children] : n.children);
  const clusterOf = (n: GNode) => (n.kind === 'leaf' ? n.parent! : n);

  // Groups on a horizontal ring around the core, in chapter order, so the
  // camera only ever travels a short arc to the next chapter.
  const up = new THREE.Vector3(0, 1, 0);
  groups.forEach((g, i) => {
    const a = Math.PI / 2 - 0.9 - (i / groups.length) * Math.PI * 2;
    g.dir.set(Math.cos(a), 0, Math.sin(a));
    g.side.crossVectors(g.dir, up).normalize();
    g.rest.copy(g.dir).multiplyScalar(RING).setY(Math.sin(i * 2.1) * 1.6);
    const m = g.children.length;
    const spread = 1.1 + 0.18 * m;
    g.children.forEach((leaf, j) => {
      const b = (j / m) * Math.PI * 2 + 0.4;
      leaf.dir.copy(g.dir);
      leaf.side.copy(g.side);
      leaf.rest
        .copy(g.rest)
        .addScaledVector(g.dir, 2.4)
        .addScaledVector(up, Math.cos(b) * spread * 0.8)
        .addScaledVector(g.side, Math.sin(b) * spread);
    });
  });
  for (const n of nodes) n.pos.copy(n.rest);

  // ── Beats from the DOM ───────────────────────────────────────
  const beats: Beat[] = [...document.querySelectorAll<HTMLElement>('section[data-focus]')].map((el) => ({
    el,
    node: byId.get(el.dataset.focus!)!,
    shot: el.dataset.shot as Shot,
    side: (el.dataset.side as 'left' | 'right') || 'left',
    chapter: el.dataset.chapter || '',
    centre: 0,
  }));
  // a node appears when the story first reaches its cluster
  for (const n of nodes) n.revealAt = n === rootNode ? -9 : Infinity;
  beats.forEach((b, i) => {
    const c = clusterOf(b.node);
    if (c === rootNode) return;
    for (const n of [c, ...c.children]) n.revealAt = Math.min(n.revealAt, i);
  });
  const finaleIndex = beats.findIndex((b) => b.shot === 'finale');

  // ── Scene ────────────────────────────────────────────────────
  const scene = new THREE.Scene();
  const BASE = new THREE.Color(0x07070c);
  const bg = BASE.clone();
  scene.background = bg;
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 500);

  const haloTex = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d')!;
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.25, 'rgba(255,255,255,0.35)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();

  const sphereGeo = new THREE.SphereGeometry(1, 28, 18);
  const shellGeos = [
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1, 0)),
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1, 1)),
  ];
  for (const n of nodes) {
    n.obj = new THREE.Group();
    n.mesh = new THREE.Mesh(sphereGeo, new THREE.MeshBasicMaterial({ color: n.color }));
    n.halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: haloTex,
        color: n.color,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    n.shells = [];
    const shellCount = n.kind === 'root' ? 2 : n.kind === 'group' ? 1 : 0;
    for (let i = 0; i < shellCount; i++) {
      const shell = new THREE.LineSegments(
        shellGeos[i],
        new THREE.LineBasicMaterial({ color: n.color, transparent: true }),
      );
      shell.scale.setScalar(n.radius * (i === 0 ? 2.3 : 3.4));
      n.shells.push(shell);
      n.obj.add(shell);
    }
    n.obj.add(n.mesh, n.halo);
    scene.add(n.obj);
  }

  const edgePos = new Float32Array(edges.length * 6);
  const edgeCol = new Float32Array(edges.length * 6);
  const edgeGeo = new THREE.BufferGeometry();
  edgeGeo.setAttribute('position', new THREE.BufferAttribute(edgePos, 3));
  edgeGeo.setAttribute('color', new THREE.BufferAttribute(edgeCol, 3));
  const edgeLines = new THREE.LineSegments(
    edgeGeo,
    new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  edgeLines.frustumCulled = false;
  scene.add(edgeLines);

  const makePoints = (count: number, size: number) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    const pts = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size,
        map: haloTex,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    pts.frustumCulled = false;
    scene.add(pts);
    return pts;
  };
  const PACKETS = reduce ? 0 : 48;
  const packets = Array.from({ length: PACKETS }, () => ({
    edge: Math.floor(Math.random() * edges.length),
    t: Math.random(),
    speed: 0.1 + Math.random() * 0.22,
    out: Math.random() > 0.5,
  }));
  const packetPts = makePoints(Math.max(PACKETS, 1), 0.28);
  type Pulse = { from: GNode; to: GNode; t: number; depth: number };
  const MAX_PULSES = 64;
  const pulses: Pulse[] = [];
  const pulsePts = makePoints(MAX_PULSES, 0.7);

  // dust: a far shell for depth, and a near field the camera flies through
  const dust = new THREE.Group();
  {
    const v = new THREE.Vector3();
    const layer = (count: number, rMin: number, rMax: number, size: number, opacity: number, attenuate: boolean) => {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        v.randomDirection().multiplyScalar(rMin + Math.random() * (rMax - rMin));
        if (!attenuate) v.y *= 0.8;
        else v.y *= 0.45;
        pos.set([v.x, v.y, v.z], i * 3);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      dust.add(
        new THREE.Points(
          geo,
          new THREE.PointsMaterial({
            color: 0x8a96cc,
            size,
            sizeAttenuation: attenuate,
            map: attenuate ? haloTex : null,
            transparent: true,
            opacity,
            depthWrite: false,
            blending: attenuate ? THREE.AdditiveBlending : THREE.NormalBlending,
          }),
        ),
      );
    };
    layer(1600, 45, 120, 1.5, 0.55, false);
    layer(reduce ? 0 : 700, 2, 26, 0.09, 0.5, true);
  }
  scene.add(dust);

  const composer = new EffectComposer(
    renderer,
    new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 }),
  );
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.65, 0.6, 0.14);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // ── Shots ────────────────────────────────────────────────────
  let W = 1;
  let H = 1;
  const tmp = new THREE.Vector3();
  const tmp2 = new THREE.Vector3();

  function poseFor(b: Beat, out: Pose) {
    const n = b.node;
    const mobile = narrow.matches;
    // keep the subject clear of the text column
    const dirX = b.side === 'left' ? -1 : 1; // text on the left → subject to the right
    out.shiftX = mobile ? 0 : dirX * -0.2;
    out.shiftY = mobile ? 0.24 : 0;
    out.tint.copy(n === rootNode ? BASE : n.color);
    const far = mobile ? 1.35 : 1;
    switch (b.shot) {
      case 'hero':
        out.target.copy(rootNode.rest);
        out.cam.set(0, 0.9, 11 * far).applyAxisAngle(up, 0.25);
        out.tint.copy(BASE);
        break;
      case 'about':
        out.target.copy(rootNode.rest);
        out.cam.set(-2, 4.5, 14 * far).applyAxisAngle(up, -0.7);
        break;
      case 'group': {
        // along the ring, so the core stays out of frame (on the subject's side)
        const centre = tmp.copy(n.rest).addScaledVector(n.dir, 1.4);
        out.target.copy(centre);
        out.cam
          .copy(centre)
          .addScaledVector(n.side, 7.5 * dirX * far)
          .addScaledVector(n.dir, 3.5 * far)
          .addScaledVector(up, 2.4);
        break;
      }
      case 'leaf':
        out.target.copy(n.rest);
        out.cam
          .copy(n.rest)
          .addScaledVector(n.side, 3.3 * dirX * far)
          .addScaledVector(n.dir, 1.5 * far)
          .addScaledVector(up, 0.6);
        break;
      case 'finale':
        out.target.copy(rootNode.rest).setY(-0.5);
        out.cam.set(0, 15, 25 * far).applyAxisAngle(up, 0.6);
        out.shiftX = 0;
        out.shiftY = mobile ? 0.2 : 0.1;
        out.tint.copy(BASE);
        break;
    }
  }

  const poses: Pose[] = beats.map(() => ({
    cam: new THREE.Vector3(),
    target: new THREE.Vector3(),
    shiftX: 0,
    shiftY: 0,
    tint: new THREE.Color(),
  }));
  const computePoses = () => beats.forEach((b, i) => poseFor(b, poses[i]));

  // cylindrical interpolation around the core, so moves between chapters
  // swing around the network instead of cutting through it
  const cyl = (v: THREE.Vector3) => ({ a: Math.atan2(v.z, v.x), r: Math.hypot(v.x, v.z), y: v.y });
  const smooth = (t: number) => t * t * (3 - 2 * t);
  const goal = { cam: new THREE.Vector3(), target: new THREE.Vector3(), shiftX: 0, shiftY: 0, tint: new THREE.Color() };

  function blend(s: number) {
    const i = Math.max(0, Math.min(beats.length - 1, Math.floor(s)));
    const j = Math.min(beats.length - 1, i + 1);
    const f = smooth(THREE.MathUtils.clamp(s - i, 0, 1));
    const A = poses[i];
    const B = poses[j];
    const ca = cyl(A.cam);
    const cb = cyl(B.cam);
    let da = cb.a - ca.a;
    da = Math.atan2(Math.sin(da), Math.cos(da));
    const a = ca.a + da * f;
    const r = THREE.MathUtils.lerp(ca.r, cb.r, f);
    // lift and pull back mid-move when changing cluster: a crane shot
    const travel = clusterOf(beats[i].node) !== clusterOf(beats[j].node) ? Math.sin(f * Math.PI) : 0;
    const y = THREE.MathUtils.lerp(ca.y, cb.y, f) + travel * (reduce ? 0 : 2.5);
    goal.cam.set(Math.cos(a) * (r + travel * 3), y, Math.sin(a) * (r + travel * 3));
    goal.target.lerpVectors(A.target, B.target, f);
    goal.shiftX = THREE.MathUtils.lerp(A.shiftX, B.shiftX, f);
    goal.shiftY = THREE.MathUtils.lerp(A.shiftY, B.shiftY, f);
    goal.tint.lerpColors(A.tint, B.tint, f);
  }

  // ── Scroll → story position ──────────────────────────────────
  const measure = () => {
    for (const b of beats) {
      const r = b.el.getBoundingClientRect();
      b.centre = r.top + scrollY + r.height / 2;
    }
  };
  const storyAt = (y: number) => {
    const mid = y + H / 2;
    if (mid <= beats[0].centre) return 0;
    for (let i = 0; i < beats.length - 1; i++) {
      if (mid < beats[i + 1].centre) return i + (mid - beats[i].centre) / (beats[i + 1].centre - beats[i].centre);
    }
    return beats.length - 1;
  };

  // chapter nav + progress
  const navLinks = [...document.querySelectorAll<HTMLAnchorElement>('.chapters a')];
  const progressEl = document.querySelector<HTMLElement>('.progress');
  const chapterNow = document.querySelector<HTMLElement>('.chapter-now');
  let activeBeat = -1;

  function onBeat(i: number) {
    activeBeat = i;
    const b = beats[i];
    for (const el of document.querySelectorAll('section.in-view')) el.classList.remove('in-view');
    b.el.classList.add('in-view');
    for (const a of navLinks) {
      if (a.dataset.chapter === b.chapter) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
    if (chapterNow)
      chapterNow.textContent =
        navLinks.find((a) => a.dataset.chapter === b.chapter)?.querySelector('.name')?.textContent ?? '';
    document.body.dataset.side = b.shot === 'finale' || b.shot === 'hero' ? 'low' : b.side;
    document.body.style.setProperty('--c', `#${clusterOf(b.node).color.getHexString()}`);
    firePulse(b.node);
  }

  function firePulse(from: GNode) {
    from.flash = 1;
    if (reduce) return;
    for (const to of neighbours(from)) if (pulses.length < MAX_PULSES) pulses.push({ from, to, t: 0, depth: 0 });
  }

  // ── Frame ────────────────────────────────────────────────────
  const cam = { pos: new THREE.Vector3(), target: new THREE.Vector3(), shiftX: 0, shiftY: 0 };
  const parallax = { x: 0, y: 0, tx: 0, ty: 0 };
  const tint = new THREE.Color();
  const c = new THREE.Color();
  let story = 0;
  let time = 0;
  let last = performance.now();
  let first = true;

  addEventListener('pointermove', (e) => {
    parallax.tx = (e.clientX / W) * 2 - 1;
    parallax.ty = (e.clientY / H) * 2 - 1;
  });

  function frame(now: number) {
    const raw = Math.min((now - last) / 1000, 0.25);
    const dt = Math.min(raw, 1 / 30); // physics step
    last = now;
    time += dt;

    const target = storyAt(scrollY);
    const ks = first ? 1 : 1 - Math.exp(-raw * (reduce ? 20 : 6));
    story += (target - story) * ks;
    const nearest = Math.round(target);
    if (nearest !== activeBeat) onBeat(nearest);
    if (progressEl) progressEl.style.transform = `scaleX(${(target / (beats.length - 1)).toFixed(4)})`;

    blend(story);
    const kc = first ? 1 : 1 - Math.exp(-raw * (reduce ? 20 : 4.5));
    cam.pos.lerp(goal.cam, kc);
    cam.target.lerp(goal.target, kc);
    cam.shiftX += (goal.shiftX - cam.shiftX) * kc;
    cam.shiftY += (goal.shiftY - cam.shiftY) * kc;
    tint.lerp(goal.tint, kc);
    first = false;

    parallax.x += (parallax.tx - parallax.x) * (1 - Math.exp(-dt * 3));
    parallax.y += (parallax.ty - parallax.y) * (1 - Math.exp(-dt * 3));
    camera.position.copy(cam.pos);
    if (!reduce) {
      tmp.subVectors(cam.pos, cam.target);
      const d = tmp.length();
      tmp.applyAxisAngle(up, -parallax.x * 0.06 + Math.sin(time * 0.21) * 0.02);
      tmp.y += (parallax.y * 0.05 + Math.sin(time * 0.33) * 0.01) * d;
      camera.position.copy(cam.target).add(tmp);
    }
    camera.lookAt(cam.target);
    camera.setViewOffset(W, H, -cam.shiftX * W, cam.shiftY * H, W, H); // shiftY > 0 lifts the subject
    camera.updateMatrixWorld();

    // background picks up a trace of the current chapter's colour
    bg.copy(BASE).add(c.copy(tint).multiplyScalar(0.03));

    const focus = beats[Math.min(beats.length - 1, Math.max(0, Math.round(story)))];
    const focusCluster = clusterOf(focus.node);
    const finale = finaleIndex >= 0 && story > finaleIndex - 0.5;

    // nodes
    const kf = 1 - Math.exp(-raw * 5);
    for (const n of nodes) {
      n.reveal = THREE.MathUtils.smoothstep(story, n.revealAt - 1.1, n.revealAt - 0.15);
      const inCluster = clusterOf(n) === focusCluster || n === rootNode || finale;
      n.emph += ((inCluster ? 1 : 0.45) - n.emph) * kf;
      n.flash *= Math.exp(-dt * 2.4);
      const f = reduce ? 0 : n.kind === 'leaf' ? 0.12 : 0.08;
      tmp.set(
        Math.sin(time * 0.6 + n.phase) * f,
        Math.cos(time * 0.5 + n.phase * 1.3) * f,
        Math.sin(time * 0.4 + n.phase * 2) * f,
      ).add(n.rest);
      n.vel.addScaledVector(tmp.sub(n.pos), 22 * dt).multiplyScalar(Math.exp(-dt * 3.4));
      n.pos.addScaledVector(n.vel, dt);
      // grow out of the parent as it is revealed
      const shown = n.parent ? tmp2.lerpVectors(n.parent.pos, n.pos, smooth(n.reveal)) : tmp2.copy(n.pos);
      n.obj.position.copy(shown);
      const isFocus = n === focus.node;
      const s = n.radius * Math.max(n.reveal, 0.001) * (1 + n.flash * 0.45 + (isFocus ? 0.25 : 0));
      n.obj.visible = n.reveal > 0.001;
      n.mesh.scale.setScalar(s);
      n.mesh.material.color.copy(n.color).multiplyScalar(n.emph * (0.72 + n.flash * 0.5 + (isFocus ? 0.12 : 0)));
      n.halo.scale.setScalar(s * (4.4 + n.flash * 3.5));
      n.halo.material.opacity = (0.22 + n.flash * 0.3) * n.emph;
      n.shells.forEach((shell, i) => {
        if (!reduce) {
          shell.rotation.x += dt * 0.22 * (i ? -1 : 1);
          shell.rotation.y += dt * 0.35 * (i ? -1 : 1);
        }
        shell.scale.setScalar(n.radius * (i === 0 ? 2.3 : 3.4) * n.reveal);
        shell.material.opacity = (i === 0 ? 0.55 : 0.22) * n.emph;
      });

      // labels: name the neighbours, not the subject (the text already does)
      let o = 0;
      if (n.reveal > 0.9 && n !== focus.node && n !== rootNode) {
        if (finale) o = n.kind === 'group' ? 0.9 : 0;
        else if (n.kind === 'leaf' && n.parent === focusCluster) o = narrow.matches ? 0 : 0.75;
        else if (n.kind === 'group' && n !== focusCluster) o = 0.45;
      }
      tmp.copy(shown).project(camera);
      if (tmp.z > 1 || tmp.z < -1) o = 0;
      const sx = (tmp.x * 0.5 + 0.5) * W;
      const sy = (-tmp.y * 0.5 + 0.5) * H;
      const st = n.labelEl.style;
      st.opacity = o.toFixed(2);
      if (o > 0) st.transform = `translate3d(${sx.toFixed(1)}px, ${(sy + 14).toFixed(1)}px, 0) translateX(-50%)`;
    }

    // edges
    edges.forEach(([a, b], i) => {
      const pa = a.obj.position;
      const pb = b.obj.position;
      edgePos.set([pa.x, pa.y, pa.z, pb.x, pb.y, pb.z], i * 6);
      const w = (0.2 + Math.max(a.flash, b.flash) * 0.4) * Math.min(a.emph, b.emph) * b.reveal;
      c.copy(b.color).multiplyScalar(w);
      edgeCol.set([c.r, c.g, c.b, c.r, c.g, c.b], i * 6);
    });
    edgeGeo.attributes.position.needsUpdate = true;
    edgeGeo.attributes.color.needsUpdate = true;

    // packets
    if (PACKETS) {
      const pos = packetPts.geometry.attributes.position as THREE.BufferAttribute;
      const col = packetPts.geometry.attributes.color as THREE.BufferAttribute;
      packets.forEach((p, i) => {
        p.t += p.speed * dt;
        if (p.t > 1) {
          p.t = 0;
          p.edge = Math.floor(Math.random() * edges.length);
          p.out = Math.random() > 0.5;
        }
        const [a, b] = edges[p.edge];
        tmp.lerpVectors(p.out ? a.obj.position : b.obj.position, p.out ? b.obj.position : a.obj.position, p.t);
        pos.setXYZ(i, tmp.x, tmp.y, tmp.z);
        const w = Math.sin(p.t * Math.PI) * 0.8 * Math.min(a.emph, b.emph) * b.reveal;
        col.setXYZ(i, b.color.r * w, b.color.g * w, b.color.b * w);
      });
      pos.needsUpdate = true;
      col.needsUpdate = true;
    }
    {
      const pos = pulsePts.geometry.attributes.position as THREE.BufferAttribute;
      const col = pulsePts.geometry.attributes.color as THREE.BufferAttribute;
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += dt * 1.6;
        if (p.t >= 1) {
          pulses.splice(i, 1);
          p.to.flash = Math.max(p.to.flash, 0.9 - p.depth * 0.25);
          tmp.subVectors(p.to.pos, p.from.pos).normalize();
          p.to.vel.addScaledVector(tmp, 1.6 - p.depth * 0.4);
          if (p.depth < 2) {
            for (const next of neighbours(p.to)) {
              if (next !== p.from && next.reveal > 0.5 && pulses.length < MAX_PULSES)
                pulses.push({ from: p.to, to: next, t: 0, depth: p.depth + 1 });
            }
          }
        }
      }
      for (let i = 0; i < MAX_PULSES; i++) {
        const p = pulses[i];
        if (!p) {
          col.setXYZ(i, 0, 0, 0);
          continue;
        }
        tmp.lerpVectors(p.from.obj.position, p.to.obj.position, p.t);
        pos.setXYZ(i, tmp.x, tmp.y, tmp.z);
        const k = p.to.reveal;
        const lc = p.to.kind === 'root' ? p.from.color : p.to.color;
        col.setXYZ(i, lc.r * k, lc.g * k, lc.b * k);
      }
      pos.needsUpdate = true;
      col.needsUpdate = true;
    }

    if (!reduce) dust.rotation.y += dt * 0.004;
    composer.render();
  }

  const resize = () => {
    W = innerWidth;
    H = innerHeight;
    const pr = Math.min(devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pr);
    renderer.setSize(W, H, false);
    composer.setPixelRatio(pr);
    composer.setSize(W, H);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    computePoses();
    measure();
  };
  addEventListener('resize', resize);
  // fonts and images shift the layout after first paint
  document.fonts?.ready.then(measure);
  addEventListener('load', measure);
  new ResizeObserver(measure).observe(document.body);
  resize();

  const run = () => {
    last = performance.now();
    renderer.setAnimationLoop(frame);
  };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) renderer.setAnimationLoop(null);
    else run();
  });
  run();
}
