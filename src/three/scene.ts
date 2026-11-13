// The /3d/ experiment: the site's content as a small network you can poke.
// The graph is built from the <article data-node> elements the page renders,
// so the content stays in the DOM and the page still reads without WebGL.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

type Kind = 'root' | 'group' | 'leaf';

type GNode = {
  id: string;
  kind: Kind;
  parent: GNode | null;
  children: GNode[];
  color: THREE.Color;
  el: HTMLElement;
  labelEl: HTMLElement;
  rest: THREE.Vector3;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  acc: THREE.Vector3;
  radius: number;
  phase: number;
  flash: number;
  hover: number;
  emph: number;
  obj: THREE.Group;
  mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  halo: THREE.Sprite;
  shells: THREE.LineSegments[];
  // screen-space cache, refreshed every frame
  sx: number;
  sy: number;
  sr: number;
  depth: number;
  visible: boolean;
};

type Pulse = { from: GNode; to: GNode; t: number; depth: number };

const RADIUS: Record<Kind, number> = { root: 0.5, group: 0.3, leaf: 0.17 };
const FOV = 45;

export function start() {
  const canvas = document.getElementById('scene') as HTMLCanvasElement | null;
  const panel = document.getElementById('panel');
  const labelLayer = document.getElementById('labels');
  if (!canvas || !panel || !labelLayer) return;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch {
    return; // no WebGL: the page stays a plain document
  }
  const root = document.documentElement;
  root.classList.add('gl');

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const narrow = matchMedia('(max-width: 760px)');

  // ── Graph from the DOM ───────────────────────────────────────
  const nodes: GNode[] = [];
  const byId = new Map<string, GNode>();
  const articles = [...panel.querySelectorAll<HTMLElement>('article[data-node]')];
  for (const el of articles) {
    const kind = el.dataset.kind as Kind;
    const labelEl = document.createElement('div');
    labelEl.className = `lbl lbl-${kind}`;
    labelEl.textContent = el.dataset.label ?? '';
    labelLayer.append(labelEl);
    const node = {
      id: el.dataset.node!,
      kind,
      parent: null,
      children: [],
      color: new THREE.Color(el.dataset.color || '#ffffff'),
      el,
      labelEl,
      rest: new THREE.Vector3(),
      pos: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      acc: new THREE.Vector3(),
      radius: RADIUS[kind],
      phase: Math.random() * Math.PI * 2,
      flash: 0,
      hover: 0,
      emph: 1,
      sx: 0,
      sy: 0,
      sr: 0,
      depth: 0,
      visible: false,
    } as unknown as GNode;
    nodes.push(node);
    byId.set(node.id, node);
  }
  for (const n of nodes) {
    const p = n.el.dataset.parent ? byId.get(n.el.dataset.parent) : undefined;
    if (p) {
      n.parent = p;
      p.children.push(n);
      if (n.kind === 'leaf') n.color.copy(p.color);
    }
    n.labelEl.style.setProperty('--c', `#${n.color.getHexString()}`);
  }
  const rootNode = nodes.find((n) => n.kind === 'root')!;
  const groups = nodes.filter((n) => n.kind === 'group');
  const edges = nodes.filter((n) => n.parent).map((n) => [n.parent!, n] as const);
  const neighbours = (n: GNode) => (n.parent ? [n.parent, ...n.children] : n.children);

  // ── Layout: groups on a ring, leaves fanned outward ──────────
  const portrait = innerWidth < innerHeight;
  const R = 5.2;
  let extentX = 0;
  let extentY = 0;
  {
    const u = new THREE.Vector3();
    const v = new THREE.Vector3();
    const up = new THREE.Vector3(0, 0, 1);
    groups.forEach((g, i) => {
      const a = (i / groups.length) * Math.PI * 2 + Math.PI / 2;
      const long = Math.cos(a) * R;
      const short = Math.sin(a) * R * 0.74;
      g.rest.set(portrait ? short : long, portrait ? long : short, Math.sin(a * 2 + 1) * R * 0.3);
      const dir = g.rest.clone().normalize();
      u.crossVectors(dir, up).normalize();
      v.crossVectors(dir, u).normalize();
      const m = g.children.length;
      const spread = 1.3 + 0.2 * m;
      g.children.forEach((leaf, j) => {
        const b = (j / m) * Math.PI * 2 + i * 0.9;
        leaf.rest
          .copy(g.rest)
          .addScaledVector(dir, 1.7)
          .addScaledVector(u, Math.cos(b) * spread)
          .addScaledVector(v, Math.sin(b) * spread);
      });
    });
    for (const n of nodes) {
      extentX = Math.max(extentX, Math.abs(n.rest.x));
      extentY = Math.max(extentY, Math.abs(n.rest.y));
      if (reduce) n.pos.copy(n.rest);
    }
  }

  // ── Scene ────────────────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x08080d);
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 400);

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
  const shellGeo = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1, 0));
  const shellGeoFine = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1, 1));
  for (const n of nodes) {
    n.obj = new THREE.Group();
    n.mesh = new THREE.Mesh(sphereGeo, new THREE.MeshBasicMaterial({ color: n.color }));
    n.halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: haloTex,
        color: n.color,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    n.shells = [];
    if (n.kind !== 'leaf') {
      const count = n.kind === 'root' ? 2 : 1;
      for (let i = 0; i < count; i++) {
        const shell = new THREE.LineSegments(
          i === 0 ? shellGeo : shellGeoFine,
          new THREE.LineBasicMaterial({ color: n.color, transparent: true, opacity: i === 0 ? 0.55 : 0.22 }),
        );
        shell.scale.setScalar(n.radius * (i === 0 ? 2.3 : 3.4));
        n.shells.push(shell);
        n.obj.add(shell);
      }
    }
    n.obj.add(n.mesh, n.halo);
    scene.add(n.obj);
  }

  // edges
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

  // packets drifting along the edges, and pulses fired by interaction
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
  const PACKETS = reduce ? 0 : 36;
  const packets = Array.from({ length: PACKETS }, () => ({
    edge: Math.floor(Math.random() * edges.length),
    t: Math.random(),
    speed: 0.12 + Math.random() * 0.25,
    out: Math.random() > 0.5,
  }));
  const packetPts = makePoints(Math.max(PACKETS, 1), 0.3);
  packetPts.visible = PACKETS > 0;
  const MAX_PULSES = 64;
  const pulses: Pulse[] = [];
  const pulsePts = makePoints(MAX_PULSES, 0.75);

  // far dust, for depth
  {
    const count = 1400;
    const pos = new Float32Array(count * 3);
    const v = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      v.randomDirection().multiplyScalar(28 + Math.random() * 60);
      pos.set([v.x, v.y, v.z], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const dust = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color: 0x7f8cc4, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.55 }),
    );
    dust.name = 'dust';
    scene.add(dust);
  }
  const dust = scene.getObjectByName('dust')!;

  // post
  const composer = new EffectComposer(
    renderer,
    new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 }),
  );
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.6, 0.6, 0.15);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // ── Camera rig ───────────────────────────────────────────────
  let W = 1;
  let H = 1;
  let overview = 20;
  const cam = { yaw: 0, pitch: 0.1, dist: 40, target: new THREE.Vector3(), offX: 0, offY: 0 };
  const goal = { yaw: 0, pitch: 0.1, dist: 20 };
  const orbitVel = { x: 0, y: 0 };
  const parallax = { x: 0, y: 0, tx: 0, ty: 0 };

  const resize = () => {
    W = innerWidth;
    H = innerHeight;
    const pr = Math.min(devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pr);
    renderer.setSize(W, H, false);
    composer.setPixelRatio(pr);
    composer.setSize(W, H);
    camera.aspect = W / H;
    const t = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    overview = Math.max((extentY + 1.6) / t, (extentX + 1.8) / (t * camera.aspect));
    if (!selected) goal.dist = overview;
  };

  // ── Selection ────────────────────────────────────────────────
  let selected: GNode | null = null;
  let hovered: GNode | null = null;
  const chips = [...document.querySelectorAll<HTMLElement>('.chips [data-go]')];

  const related = (n: GNode) =>
    !selected ||
    n === selected ||
    n.parent === selected ||
    selected.parent === n ||
    (n.parent !== null && n.parent === selected.parent && n.kind === 'leaf') ||
    n === rootNode;

  function select(node: GNode | null, focus = false) {
    selected = node;
    document.body.classList.toggle('has-sel', !!node);
    document.body.classList.add('touched');
    for (const a of articles) a.classList.toggle('active', a === node?.el);
    panel!.classList.toggle('open', !!node);
    const groupId = node ? (node.kind === 'leaf' ? node.parent?.id : node.id) : '';
    for (const c of chips) {
      if (c.dataset.go === groupId) c.setAttribute('aria-current', 'true');
      else c.removeAttribute('aria-current');
    }
    if (node) {
      panel!.style.setProperty('--c', `#${node.color.getHexString()}`);
      panel!.scrollTop = 0;
      // back off on narrow screens so the neighbours stay in view
      const fit = 1 / Math.min(1, camera.aspect * 1.15);
      goal.dist = Math.min(overview, node.kind === 'root' ? overview : (node.kind === 'group' ? 11 : 8) * fit);
      if (focus) panel!.focus({ preventScroll: true });
      pulse(node);
    } else {
      goal.dist = overview;
    }
    const url = node && node.kind !== 'root' ? `#${node.id}` : location.pathname + location.search;
    history.replaceState(null, '', url);
  }

  function pulse(from: GNode) {
    from.flash = 1;
    if (reduce) return;
    for (const to of neighbours(from)) if (pulses.length < MAX_PULSES) pulses.push({ from, to, t: 0, depth: 0 });
  }

  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-go]');
    if (btn) select(byId.get(btn.dataset.go!) ?? null, true);
    else if ((e.target as HTMLElement).closest('[data-close]')) select(null);
  });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && selected) select(null);
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && selected?.parent) {
      if ((e.target as HTMLElement).closest('input, textarea, select')) return;
      const sib = selected.parent.children;
      const i = sib.indexOf(selected) + (e.key === 'ArrowRight' ? 1 : -1);
      select(sib[(i + sib.length) % sib.length]);
    }
  });

  // ── Pointer: orbit, zoom, grab-and-fling ─────────────────────
  const pointers = new Map<number, { x: number; y: number }>();
  let mode: 'none' | 'orbit' | 'node' | 'pinch' = 'none';
  let dragNode: GNode | null = null;
  let dragging = false;
  let moved = false;
  let downX = 0;
  let downY = 0;
  let pinchDist = 0;
  const dragTarget = new THREE.Vector3();
  const dragPlane = new THREE.Plane();
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const tmp = new THREE.Vector3();
  const tmp2 = new THREE.Vector3();

  function pick(x: number, y: number): GNode | null {
    let best: GNode | null = null;
    let bestScore = 1;
    for (const n of nodes) {
      if (!n.visible) continue;
      const hit = Math.max(n.sr * 1.8, coarse ? 30 : 20);
      const score = Math.hypot(n.sx - x, n.sy - y) / hit;
      if (score < bestScore) {
        bestScore = score;
        best = n;
      }
    }
    return best;
  }

  const pinchSpan = () => {
    const [a, b] = [...pointers.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    document.body.classList.add('touched');
    if (pointers.size === 2) {
      mode = 'pinch';
      pinchDist = pinchSpan();
      dragNode = null;
      dragging = false;
      moved = true;
      return;
    }
    downX = e.clientX;
    downY = e.clientY;
    moved = false;
    dragging = false;
    dragNode = pick(e.clientX, e.clientY);
    mode = dragNode ? 'node' : 'orbit';
    orbitVel.x = orbitVel.y = 0;
    canvas.style.cursor = 'grabbing';
  });

  canvas.addEventListener('pointermove', (e) => {
    parallax.tx = (e.clientX / W) * 2 - 1;
    parallax.ty = (e.clientY / H) * 2 - 1;
    const p = pointers.get(e.pointerId);
    if (!p) {
      if (e.pointerType === 'mouse') {
        hovered = pick(e.clientX, e.clientY);
        canvas.style.cursor = hovered ? 'pointer' : 'grab';
      }
      return;
    }
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    p.x = e.clientX;
    p.y = e.clientY;
    if (mode === 'pinch' && pointers.size === 2) {
      const d = pinchSpan();
      if (pinchDist > 0) goal.dist = THREE.MathUtils.clamp((goal.dist * pinchDist) / d, 4, overview * 1.5);
      pinchDist = d;
      return;
    }
    if (!moved && Math.hypot(e.clientX - downX, e.clientY - downY) > (coarse ? 10 : 5)) moved = true;
    if (!moved) return;
    if (mode === 'orbit') {
      goal.yaw -= dx * 0.005;
      goal.pitch = THREE.MathUtils.clamp(goal.pitch + dy * 0.005, -1.2, 1.2);
      orbitVel.x = -dx * 0.3;
      orbitVel.y = dy * 0.3;
    } else if (mode === 'node' && dragNode) {
      if (!dragging) {
        dragging = true;
        camera.getWorldDirection(tmp);
        dragPlane.setFromNormalAndCoplanarPoint(tmp, dragNode.pos);
      }
      ndc.set((e.clientX / W) * 2 - 1, -(e.clientY / H) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(dragPlane, tmp)) {
        // elastic: you can pull a node away, but only so far
        tmp.sub(dragNode.rest).clampLength(0, 7).add(dragNode.rest);
        dragTarget.copy(tmp);
      }
    }
  });

  const release = (e: PointerEvent) => {
    if (!pointers.delete(e.pointerId)) return;
    if (mode === 'pinch') {
      if (pointers.size === 0) mode = 'none';
      return;
    }
    if (!moved) {
      const hit = pick(e.clientX, e.clientY);
      if (hit || e.type === 'pointerup') select(hit);
    } else if (dragging && dragNode) {
      pulse(dragNode);
    }
    mode = 'none';
    dragNode = null;
    dragging = false;
    canvas.style.cursor = 'grab';
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  canvas.addEventListener('pointerleave', () => {
    hovered = null;
    parallax.tx = parallax.ty = 0;
  });
  canvas.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      goal.dist = THREE.MathUtils.clamp(goal.dist * Math.exp(e.deltaY * 0.0012), 4, overview * 1.5);
    },
    { passive: false },
  );

  // ── Frame ────────────────────────────────────────────────────
  const K = 26; // spring to rest
  const C = 3.6; // damping
  const KC = 14; // how much a node drags its neighbours along
  const restNow = new THREE.Vector3();
  const c = new THREE.Color();
  let time = 0;
  let last = performance.now();
  const focalPx = () => H / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2));

  function physics(dt: number) {
    for (const n of nodes) {
      const f = reduce ? 0 : 0.14;
      restNow.set(
        n.rest.x + Math.sin(time * 0.6 + n.phase) * f,
        n.rest.y + Math.cos(time * 0.5 + n.phase * 1.3) * f,
        n.rest.z + Math.sin(time * 0.4 + n.phase * 2) * f,
      );
      n.acc.copy(restNow).sub(n.pos).multiplyScalar(K).addScaledVector(n.vel, -C);
      tmp.copy(n.pos).sub(n.rest); // own displacement
      for (const m of neighbours(n)) {
        tmp2.copy(m.pos).sub(m.rest).sub(tmp);
        n.acc.addScaledVector(tmp2, KC);
      }
    }
    for (const n of nodes) {
      if (n === dragNode && dragging) {
        tmp.copy(n.pos);
        n.pos.lerp(dragTarget, 1 - Math.exp(-dt * 24));
        n.vel.copy(n.pos).sub(tmp).divideScalar(dt).clampLength(0, 30);
      } else if (n !== rootNode) {
        n.vel.addScaledVector(n.acc, dt);
        n.pos.addScaledVector(n.vel, dt);
      } else {
        // the centre is heavier
        n.vel.addScaledVector(n.acc, dt * 0.35);
        n.pos.addScaledVector(n.vel, dt);
      }
    }
  }

  function updateCamera(dt: number) {
    if (mode !== 'orbit') {
      goal.yaw += orbitVel.x * dt;
      goal.pitch = THREE.MathUtils.clamp(goal.pitch + orbitVel.y * dt, -1.2, 1.2);
      const decay = Math.exp(-dt * 3);
      orbitVel.x *= decay;
      orbitVel.y *= decay;
    }
    const k = 1 - Math.exp(-dt * (reduce ? 14 : 3.4));
    cam.yaw += (goal.yaw - cam.yaw) * k;
    cam.pitch += (goal.pitch - cam.pitch) * k;
    cam.dist += (goal.dist - cam.dist) * k;
    cam.target.lerp(selected ? selected.pos : rootNode.pos, k);
    parallax.x += (parallax.tx - parallax.x) * k;
    parallax.y += (parallax.ty - parallax.y) * k;

    const sway = reduce ? 0 : Math.sin(time * 0.17) * 0.3;
    const yaw = cam.yaw + sway + (reduce ? 0 : parallax.x * 0.1);
    const pitch = THREE.MathUtils.clamp(cam.pitch + (reduce ? 0 : parallax.y * 0.07), -1.3, 1.3);
    camera.position.set(
      cam.target.x + cam.dist * Math.sin(yaw) * Math.cos(pitch),
      cam.target.y + cam.dist * Math.sin(pitch),
      cam.target.z + cam.dist * Math.cos(yaw) * Math.cos(pitch),
    );
    camera.lookAt(cam.target);

    // keep the focused node clear of the panel
    // …and in the overview, clear of the headline
    let ox = narrow.matches ? 0 : -W * 0.09;
    let oy = narrow.matches ? H * 0.07 : 0;
    if (selected) {
      ox = oy = 0;
      const r = panel!.getBoundingClientRect();
      if (narrow.matches) oy = r.height / 2;
      else ox = (W - r.left) / 2;
    }
    cam.offX += (ox - cam.offX) * k;
    cam.offY += (oy - cam.offY) * k;
    camera.setViewOffset(W, H, cam.offX, cam.offY, W, H);
    camera.updateMatrixWorld();
  }

  function updateNodes(dt: number) {
    const focal = focalPx();
    const k = 1 - Math.exp(-dt * 8);
    for (const n of nodes) {
      const hot = n === hovered || n === selected || (n === dragNode && dragging);
      n.hover += ((hot ? 1 : 0) - n.hover) * k;
      n.emph += ((related(n) ? 1 : 0.28) - n.emph) * k;
      n.flash *= Math.exp(-dt * 2.6);

      n.obj.position.copy(n.pos);
      const s = n.radius * (1 + n.hover * 0.35 + n.flash * 0.5);
      n.mesh.scale.setScalar(s);
      n.mesh.material.color.copy(n.color).multiplyScalar(n.emph * (0.72 + n.hover * 0.15 + n.flash * 0.5));
      n.halo.scale.setScalar(s * (4.4 + n.hover * 1.4 + n.flash * 3.5));
      n.halo.material.opacity = (0.2 + n.hover * 0.15 + n.flash * 0.3) * n.emph;
      n.shells.forEach((shell, i) => {
        const dir = i % 2 ? -1 : 1;
        if (!reduce) {
          shell.rotation.x += dt * 0.25 * dir;
          shell.rotation.y += dt * 0.4 * dir;
        }
        (shell.material as THREE.LineBasicMaterial).opacity = (i === 0 ? 0.55 : 0.22) * n.emph;
      });

      // screen-space, for picking and labels
      tmp.copy(n.pos).project(camera);
      n.visible = tmp.z < 1 && tmp.z > -1;
      n.sx = (tmp.x * 0.5 + 0.5) * W;
      n.sy = (-tmp.y * 0.5 + 0.5) * H;
      n.depth = camera.position.distanceTo(n.pos);
      n.sr = (s / n.depth) * focal;

      const fade = THREE.MathUtils.clamp(1.15 - (n.depth - cam.dist + 4) / 14, 0.45, 1);
      let o = fade * (n.emph < 0.6 ? 0.3 : 1);
      if (n.kind === 'leaf' && !n.hover) {
        // leaf names only once they are big enough to read, or in focus
        const inFocus = selected && (n.parent === selected || n.parent === selected.parent || n === selected);
        if (!inFocus && (narrow.matches || n.sr < 4.2)) o = 0;
      }
      if (!n.visible || n === selected) o = 0; // the panel already names the selected node
      const st = n.labelEl.style;
      st.opacity = o.toFixed(2);
      st.transform = `translate3d(${n.sx.toFixed(1)}px, ${(n.sy + n.sr * (n.kind === 'root' ? 3.5 : n.kind === 'group' ? 2.4 : 1) + 8).toFixed(1)}px, 0) translateX(-50%)`;
      n.labelEl.classList.toggle('on', n.hover > 0.5);
    }
  }

  function updateEdges() {
    edges.forEach(([a, b], i) => {
      edgePos.set([a.pos.x, a.pos.y, a.pos.z, b.pos.x, b.pos.y, b.pos.z], i * 6);
      const hot = Math.max(a.hover, b.hover);
      const w = (0.16 + hot * 0.5 + Math.max(a.flash, b.flash) * 0.4) * Math.min(a.emph, b.emph);
      c.copy(b.color).multiplyScalar(w);
      edgeCol.set([c.r, c.g, c.b, c.r, c.g, c.b], i * 6);
    });
    edgeGeo.attributes.position.needsUpdate = true;
    edgeGeo.attributes.color.needsUpdate = true;
  }

  function updatePackets(dt: number) {
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
        tmp.lerpVectors(p.out ? a.pos : b.pos, p.out ? b.pos : a.pos, p.t);
        pos.setXYZ(i, tmp.x, tmp.y, tmp.z);
        const w = Math.sin(p.t * Math.PI) * 0.8 * Math.min(a.emph, b.emph);
        col.setXYZ(i, b.color.r * w, b.color.g * w, b.color.b * w);
      });
      pos.needsUpdate = true;
      col.needsUpdate = true;
    }

    const pos = pulsePts.geometry.attributes.position as THREE.BufferAttribute;
    const col = pulsePts.geometry.attributes.color as THREE.BufferAttribute;
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      p.t += dt * 1.9;
      if (p.t >= 1) {
        pulses.splice(i, 1);
        p.to.flash = Math.max(p.to.flash, 0.9 - p.depth * 0.2);
        tmp.copy(p.to.pos).sub(p.from.pos).normalize();
        p.to.vel.addScaledVector(tmp, 2.4 - p.depth * 0.5);
        if (p.depth < 3) {
          for (const next of neighbours(p.to)) {
            if (next !== p.from && pulses.length < MAX_PULSES) pulses.push({ from: p.to, to: next, t: 0, depth: p.depth + 1 });
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
      tmp.lerpVectors(p.from.pos, p.to.pos, p.t);
      pos.setXYZ(i, tmp.x, tmp.y, tmp.z);
      const leaf = p.to.kind === 'root' ? p.from : p.to;
      col.setXYZ(i, leaf.color.r, leaf.color.g, leaf.color.b);
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
  }

  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    time += dt;
    physics(dt);
    updateCamera(dt);
    updateNodes(dt);
    updateEdges();
    updatePackets(dt);
    if (!reduce) dust.rotation.y += dt * 0.006;
    composer.render();
  }

  addEventListener('resize', resize);
  resize();
  cam.dist = reduce ? overview : overview * 1.7;
  canvas.style.cursor = 'grab';

  const fromHash = () => byId.get(decodeURIComponent(location.hash.slice(1)));
  const initial = fromHash();
  if (initial) select(initial);
  addEventListener('hashchange', () => {
    const n = fromHash();
    if (n && n !== selected) select(n);
  });

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
