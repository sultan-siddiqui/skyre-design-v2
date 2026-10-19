/* Adapted directly from the user-supplied brand-story scripts.
   Motion geometry, durations, easing and drawing routines are retained.
   This lifecycle wrapper scopes queries and cleans up on corporate-page changes. */
window.SkyBenchmark=(()=>{
 let current=null,introShown=false;
 const nativeDoc=window.document;
 function render(key){
   const showIntro=key==='home'&&!introShown&&window.SkyMotion.enabled(); if(showIntro)introShown=true;
   return '<div class="benchmark '+(showIntro?'is-loading':'ready')+'" data-lang="en" data-theme="dark" dir="ltr" data-benchmark-page="'+key+'">'+(showIntro?SKY_BENCHMARK_CONTENT.loader:'')+'<div class="benchmark-content">'+(SKY_BENCHMARK_CONTENT[key]||'')+'</div></div>';
 }
 function clean(){current?.dispose();current=null;nativeDoc.body.classList.remove('benchmark-loading');}
 function init(){
   clean(); const host=nativeDoc.querySelector('.benchmark'); if(!host)return;
   const disposers=[],frames=new Map(),timeouts=new Set(),intervals=new Set();
   let disposed=false,paused=false,serial=0,pauseStart=0,pausedTime=0;
   const performance={now:()=>window.performance.now()-pausedTime-(paused?window.performance.now()-pauseStart:0)};
   function listen(target,type,fn,opts){target.addEventListener(type,fn,opts);disposers.push(()=>target.removeEventListener(type,fn,opts));}
   const addEventListener=(type,fn,opts)=>listen(window,type,fn,opts);
   const document={documentElement:host,body:host,querySelector:s=>host.querySelector(s),querySelectorAll:s=>host.querySelectorAll(s),createElementNS:(...a)=>nativeDoc.createElementNS(...a),createElement:(...a)=>nativeDoc.createElement(...a),get hidden(){return nativeDoc.hidden},get readyState(){return nativeDoc.readyState},addEventListener:(type,fn,opts)=>listen(nativeDoc,type,fn,opts)};
   const matchMedia=q=>{const mq=window.matchMedia(q);return {get matches(){return mq.matches},addEventListener:(type,fn)=>listen(mq,type,fn),addListener:fn=>listen(mq,'change',fn)}};
   function observerClass(Base){return class extends Base{constructor(...args){super(...args);disposers.push(()=>this.disconnect());}};}
   const IntersectionObserver=observerClass(window.IntersectionObserver),MutationObserver=observerClass(window.MutationObserver),ResizeObserver=observerClass(window.ResizeObserver);
   function schedule(id,fn){const entry={fn,native:0};frames.set(id,entry);if(!paused&&!disposed)entry.native=window.requestAnimationFrame(()=>{if(disposed)return;if(paused){entry.native=0;return;}frames.delete(id);fn(performance.now());});}
   function requestAnimationFrame(fn){if(disposed)return 0;const id=++serial;schedule(id,fn);return id;}
   function cancelAnimationFrame(id){const entry=frames.get(id);if(entry)window.cancelAnimationFrame(entry.native);frames.delete(id);}
   function setTimeout(fn,delay){const id=window.setTimeout(()=>{timeouts.delete(id);if(!disposed)fn();},delay);timeouts.add(id);return id;}
   function clearTimeout(id){window.clearTimeout(id);timeouts.delete(id);}
   function setInterval(fn,delay){const id=window.setInterval(()=>{if(!disposed&&!paused)fn();},delay);intervals.add(id);return id;}
   function clearInterval(id){window.clearInterval(id);intervals.delete(id);}
   function setMotion(enabled){
     if(paused===!enabled)return;
     if(!enabled){paused=true;pauseStart=window.performance.now();for(const e of frames.values()){window.cancelAnimationFrame(e.native);e.native=0;}host.classList.add('benchmark-paused');}
     else{pausedTime+=window.performance.now()-pauseStart;paused=false;host.classList.remove('benchmark-paused');for(const [id,e] of [...frames])schedule(id,e.fn);}
   }
   current={setMotion,dispose(){disposed=true;for(const e of frames.values())window.cancelAnimationFrame(e.native);frames.clear();timeouts.forEach(window.clearTimeout);intervals.forEach(window.clearInterval);disposers.forEach(fn=>fn());host.getAnimations({subtree:true}).forEach(a=>a.cancel());}};
   const html=host,body=host,$=s=>host.querySelector(s),$$=s=>[...host.querySelectorAll(s)];
   const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const TAU=6.2832; let smx=-9999,smy=-9999; addEventListener('pointermove',e=>{smx=e.clientX;smy=e.clientY;},{passive:true});

if ($('#loader')) {
/* ---------- Loader ---------- */
      const pct = $('#ldPct'), bar = $('#ldBar'), loader = $('#loader');
      const MIN = reduce ? 600 : 4300; const t0 = performance.now(); let loaded = document.readyState === 'complete', finished = false;
      addEventListener('load', () => loaded = true);
      function tick(now) {
        if (finished) return;
        let p = Math.min((now - t0) / MIN, 1); if (!loaded) p = Math.min(p, .94);
        const e = 1 - Math.pow(1 - p, 2.2); pct.textContent = String(Math.round(e * 100)).padStart(3, '0'); bar.style.transform = 'scaleX(' + e + ')';
        if (p >= 1 && loaded) finish(); else requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      function finish() {
        if (finished) return; finished = true; pct.textContent = '100'; bar.style.transform = 'scaleX(1)';
        setTimeout(() => {
          loader.classList.add('out');
          const b = $('#ldBurst'); b.classList.add('burst-go');
          setTimeout(() => {body.classList.remove('is-loading'); body.classList.add('ready'); loader.classList.add('gone')}, 450);
          setTimeout(() => {loader.remove(); b.remove()}, 2200);
        }, reduce ? 0 : 350);
      }
      $('#ldSkip').addEventListener('click', () => {loaded = true; finish()});
      setTimeout(() => {loaded = true}, 9000);

      
} else {body.classList.add('ready');}
/* ---------- Reveal ---------- */
      const io = new IntersectionObserver(es => es.forEach(e => {if (e.isIntersecting) {e.target.classList.add('in'); io.unobserve(e.target)} }), {threshold: .14, rootMargin: '0px 0px -6% 0px'});
      $$('.rv,#geoArt,#cMark').forEach(el => io.observe(el));

      /* ---------- Count-up ---------- */
      const co = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return; co.unobserve(e.target); const el = e.target, to = +el.dataset.to; if (reduce) {el.textContent = to; return;} const from = to - 30, d = 1800, s = performance.now();
        (function f(n) {const p = Math.min((n - s) / d, 1), v = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))); el.textContent = v; if (p < 1) requestAnimationFrame(f)})(s)
      }), {threshold: .6});
      $$('.count').forEach(el => co.observe(el));

      /* ---------- Story steps ---------- */
      if ($('#stage')) { const stage = $('#stage');
      const so = new IntersectionObserver(es => es.forEach(e => {if (e.isIntersecting) {$$('.step').forEach(s => s.classList.toggle('on', s === e.target)); stage.dataset.step = e.target.dataset.step} }), {rootMargin: '-45% 0px -45% 0px'});
      $$('.step').forEach(s => so.observe(s));

      }
/* ---------- Foundations ---------- */
if ($('#fArt')) {
      const fArt = $('#fArt'), fItems = $$('.f-item'); let fIdx = 0, fAuto = true, fTimer;
      function fSet(i) {fIdx = i; fItems.forEach((b, j) => b.classList.toggle('on', j === i)); fArt.dataset.hl = fItems[i].dataset.hl}
      fItems.forEach((b, i) => {b.addEventListener('click', () => {fAuto = false; fSet(i)}); b.addEventListener('mouseenter', () => {fAuto = false; fSet(i)})});
      const fo = new IntersectionObserver(es => es.forEach(e => {clearInterval(fTimer); if (e.isIntersecting) fTimer = setInterval(() => {if (fAuto) fSet((fIdx + 1) % fItems.length)}, 3800)}), {threshold: .3});
      fo.observe(fArt);

      
}
/* ============ MOTION ENHANCEMENTS ============ */
      const NS = 'http://www.w3.org/2000/svg';
      const mk = (tag, attrs, parent) => {const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e};
      const wrapG = list => {list = [].concat(list); const g = document.createElementNS(NS, 'g'); list[0].parentNode.insertBefore(g, list[0]); list.forEach(e => g.appendChild(e)); return g};
      const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
      const easeIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const bz = (t, a, b, c, d) => {const u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d};

      /* ---------- 05 · The Emergent Star — born from the Downward Crescent ---------- */
      if ($('#stage')) { const stg = $('#stage'), stSvg = stg.querySelector('svg'), labS = stg.querySelector('.labS');
      labS.classList.add('star-label');
      (() => {
        const defs = mk('defs', {}, null); stSvg.insertBefore(defs, stSvg.firstChild);
        const lg = mk('linearGradient', {id: 'emFlare'}, defs);
        [['0', '#fff', '0'], ['.5', '#fff', '.95'], ['1', '#fff', '0']].forEach(s => mk('stop', {offset: s[0], 'stop-color': s[1], 'stop-opacity': s[2]}, lg));
      })();
      let emState = 0, emRAF = 0, emNodes = [], emTimers = [];
      function emClean() {
        cancelAnimationFrame(emRAF); emTimers.forEach(clearTimeout); emTimers = []; emNodes.forEach(n => n.remove()); emNodes = [];
        stg.classList.remove('emerging', 'lab-wait', 'handoff')
      }

      /* The star emerges from the heart of gB (the Downward Crescent = Sky Re) */
      function emStart() {
        emClean(); emState = 1; stg.classList.add('emerging', 'lab-wait'); labS.classList.remove('revealed');

        const C = {x: 271.06, y: 275.36};                   /* symbol centre */
        const gBheart = {x: 420, y: 420};                    /* deep inside gB's inner gold */
        const GLOW = 900, HOLD = 200, TR = 2400;              /* timing */
        const t0 = performance.now();

        /* --- cursor influence: constrain birth along gB's diagonal axis --- */
        let birthX = gBheart.x, birthY = gBheart.y;
        if (smx > 0 && smy > 0) {
          const m = stSvg.getScreenCTM(); if (m) {
            const p = stSvg.createSVGPoint(); p.x = smx; p.y = smy; const cs = p.matrixTransform(m.inverse());
            const ax = C.x - gBheart.x, ay = C.y - gBheart.y, al = Math.hypot(ax, ay) || 1;
            const nx = ax / al, ny = ay / al, dx = cs.x - gBheart.x, dy = cs.y - gBheart.y;
            const proj = clamp(dx * nx + dy * ny, -30, 30);
            birthX += nx * proj * .25; birthY += ny * proj * .25;
          }
        }

        /* --- set up SVG elements --- */
        const trailG = mk('g', {style: 'pointer-events:none'}, stSvg);
        const segs = Array.from({length: 12}, (_, i) => mk('line', {stroke: i < 4 ? '#ffffff' : '#c2a56f', 'stroke-linecap': 'round', opacity: 0}, trailG));
        const trav = mk('use', {href: '#star', fill: '#fff', filter: 'url(#glow)', opacity: 0}, stSvg);
        const innerGlow = mk('circle', {cx: birthX, cy: birthY, r: 18, fill: 'url(#haloG)', opacity: 0, style: 'pointer-events:none;transform-box:view-box;transform-origin:' + birthX.toFixed(1) + 'px ' + birthY.toFixed(1) + 'px'}, stSvg);
        emNodes.push(trailG, trav, innerGlow);

        /* --- bezier path from birth inside gB toward centre --- */
        const dx = C.x - birthX, dy = C.y - birthY, L = Math.hypot(dx, dy) || 1;
        let nx = -dy / L, ny = dx / L; if (nx < 0) {nx = -nx; ny = -ny} /* curve bows away from the diagonal toward upper area */
        const P1 = {x: birthX + dx * .28 + nx * L * .18, y: birthY + dy * .28 + ny * L * .18};
        const P2 = {x: birthX + dx * .72 + nx * L * .06, y: birthY + dy * .72 + ny * L * .06};
        const PIERCE_T = 0.30; /* ~30% along path — the star crosses gB's visible edge */
        let pierceFired = false;
        const hist = [];

        function frame(now) {
          const t = now - t0;

          /* Phase 1: golden energy gathers inside gB */
          if (t < GLOW + HOLD) {
            const g = easeIO(clamp(t / GLOW, 0, 1));
            innerGlow.setAttribute('opacity', (g * .65).toFixed(3));
            innerGlow.setAttribute('r', (14 + g * 24).toFixed(1));
            trav.setAttribute('opacity', (g * .35).toFixed(3));
            trav.setAttribute('transform', 'translate(' + birthX + ' ' + birthY + ') scale(' + (0.02 + g * 0.05).toFixed(4) + ') translate(-271.06 -275.36)');
            emRAF = requestAnimationFrame(frame); return;
          }

          /* Phase 2: star travels from gB to centre */
          const u = clamp((t - GLOW - HOLD) / TR, 0, 1), e = easeIO(u);
          const x = bz(e, birthX, P1.x, P2.x, C.x), y = bz(e, birthY, P1.y, P2.y, C.y);
          const sc = 0.05 + (.82 - .05) * Math.pow(e, 1.8);
          const rot = -40 * (1 - e);

          trav.setAttribute('transform', 'translate(' + x + ' ' + y + ') rotate(' + rot.toFixed(1) + ') scale(' + sc.toFixed(4) + ') translate(-271.06 -275.36)');
          trav.setAttribute('opacity', Math.min(1, .45 + u * .65).toFixed(3));

          /* fade inner glow as star departs */
          innerGlow.setAttribute('opacity', Math.max(0, .65 * (1 - u * 2.5)).toFixed(3));

          /* --- piercing moment: golden flash as star crosses gB's edge --- */
          if (!pierceFired && u >= PIERCE_T) {
            pierceFired = true;
            const px = bz(PIERCE_T, birthX, P1.x, P2.x, C.x), py = bz(PIERCE_T, birthY, P1.y, P2.y, C.y);
            /* burst at pierce point */
            const pFlash = mk('circle', {cx: px.toFixed(1), cy: py.toFixed(1), r: 10, fill: '#c2a56f', opacity: 0, style: 'pointer-events:none;transform-box:view-box;transform-origin:' + px.toFixed(1) + 'px ' + py.toFixed(1) + 'px'}, stSvg);
            emNodes.push(pFlash);
            pFlash.animate([{transform: 'scale(.4)', opacity: 0}, {transform: 'scale(1)', opacity: .65, offset: .2}, {transform: 'scale(3.5)', opacity: 0}], {duration: 1000, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards'});
            /* gold shimmer on gB's inner crescent */
            const gBi = stg.querySelector('.gB .i');
            if (gBi) gBi.animate([{filter: 'drop-shadow(0 0 0 rgba(194,165,111,0))'}, {filter: 'drop-shadow(0 0 22px rgba(194,165,111,.7))', offset: .25}, {filter: 'drop-shadow(0 0 0 rgba(194,165,111,0))'}], {duration: 1400, easing: 'ease-out'});
          }

          /* trail */
          hist.unshift([x, y]); if (hist.length > 13) hist.pop();
          const fade = 1 - Math.pow(u, 3.2);
          segs.forEach((l, i) => {
            const a = hist[i], b = hist[i + 1]; if (!b) {l.setAttribute('opacity', 0); return }
            l.setAttribute('x1', a[0]); l.setAttribute('y1', a[1]); l.setAttribute('x2', b[0]); l.setAttribute('y2', b[1]);
            l.setAttribute('stroke-width', (2.2 * (1 - i / 12)).toFixed(2)); l.setAttribute('opacity', (.4 * (1 - i / 12) * fade).toFixed(3))
          });

          if (u < 1) emRAF = requestAnimationFrame(frame); else emArrive(trav, trailG);
        }
        emRAF = requestAnimationFrame(frame);
      }
      function emArrive(trav, trailG) {
        /* hand off to the real SVG star — no visual jump */
        stg.classList.add('handoff'); stg.classList.remove('emerging'); trav.remove();
        requestAnimationFrame(() => requestAnimationFrame(() => stg.classList.remove('handoff')));
        trailG.animate([{opacity: 1}, {opacity: 0}], {duration: 600, fill: 'forwards'});
        const o = {'pointer-events': 'none'}, fx = [
          [mk('circle', Object.assign({cx: 271.06, cy: 275.36, r: 60, fill: 'url(#haloG)'}, o), stSvg), [{transform: 'scale(.2)', opacity: 0}, {transform: 'scale(1.5)', opacity: .85, offset: .25}, {transform: 'scale(2.6)', opacity: 0}], 2300],
          [mk('circle', Object.assign({cx: 271.06, cy: 275.36, r: 40, fill: 'none', stroke: '#c2a56f', 'stroke-width': 1.2}, o), stSvg), [{transform: 'scale(.6)', opacity: 0}, {opacity: .7, offset: .15}, {transform: 'scale(4.2)', opacity: 0}], 2700],
          [mk('ellipse', Object.assign({cx: 271.06, cy: 275.36, rx: 250, ry: 1.4, fill: 'url(#emFlare)'}, o), stSvg), [{transform: 'scaleX(0)', opacity: 0}, {transform: 'scaleX(1)', opacity: .7, offset: .3}, {transform: 'scaleX(1.12)', opacity: 0}], 2000]];
        fx.forEach(([n, k, d]) => {n.style.transformBox = 'view-box'; n.style.transformOrigin = '271.06px 275.36px'; emNodes.push(n); n.animate(k, {duration: d, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards'})});
        emTimers.push(setTimeout(() => {stg.classList.remove('lab-wait'); labS.classList.add('revealed')}, 750));
        emTimers.push(setTimeout(() => {emNodes.forEach(n => n.remove()); emNodes = []; emState = 2}, 3200));
      }
      new MutationObserver(() => {
        const s = +stg.dataset.step;
        if (reduce) {labS.classList.toggle('revealed', s >= 4); return }
        if (s === 4 && emState === 0) emStart();
        else if (s === 5 && emState === 0) {labS.classList.add('revealed'); emState = 2}
        else if (s < 4 && emState !== 0) {emClean(); emState = 0; labS.classList.remove('revealed')}
      }).observe(stg, {attributes: true, attributeFilter: ['data-step']});

      }
/* ---------- 04 · Deeper Dimensions — meaningful pointer interaction ---------- */
      if (!reduce) {
        const dims = []; let dRAF = 0, dLast = 0;
        function dTick(now) {
          const dt = Math.min(50, dLast ? now - dLast : 16); dLast = now; let busy = false;
          for (const d of dims) if (d.step(dt)) busy = true;
          if (busy) dRAF = requestAnimationFrame(dTick); else {dRAF = 0; dLast = 0}
        }
        const kick = () => {if (!dRAF) dRAF = requestAnimationFrame(dTick)};
        function addDim(svg, cfg) {
          const card = svg.closest('.dim'), d = {on: false, p: {x: 0, y: 0}, cur: Object.assign({}, cfg.rest), tgt: Object.assign({}, cfg.rest)};
          const loc = e => {const m = svg.getScreenCTM(); if (!m) return; const q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; const r = q.matrixTransform(m.inverse()); d.p.x = r.x; d.p.y = r.y};
          card.addEventListener('pointermove', e => {loc(e); if (!d.on) {d.on = true; cfg.enter && cfg.enter(d)} kick()});
          const off = () => {d.on = false; kick()};
          card.addEventListener('pointerleave', off); card.addEventListener('pointercancel', off);
          d.step = dt => {
            cfg.target(d); const f = 1 - Math.pow(1 - (cfg.ease || .07), dt / 16.7); let moving = false;
            for (const k in d.tgt) {const v = d.tgt[k] - d.cur[k]; if (Math.abs(v) > .0015) {d.cur[k] += v * f; moving = true} else d.cur[k] = d.tgt[k]}
            const extra = cfg.tick ? cfg.tick(d, dt) : false; cfg.apply(d.cur, d); return moving || d.on || extra;
          };
          dims.push(d); return d;
        }

        /* 01 — Joining: the crescents are drawn together as the cursor nears the joining point */
        const mJ = $('.m-join');
        if (mJ) {
          const a = mJ.querySelector('.a'), b = mJ.querySelector('.b'), wa = wrapG(a), wb = wrapG(b), ws = wrapG(mJ.querySelector('.st'));
          const jg = mk('circle', {cx: 271.06, cy: 275.36, r: 70, fill: 'url(#haloG)', opacity: 0, style: 'pointer-events:none'}); mJ.insertBefore(jg, ws);
          const tx = el => {const m = getComputedStyle(el).transform; if (!m || m === 'none') return 0; const v = m.match(/matrix\(([^)]+)\)/); return v ? parseFloat(v[1].split(',')[4]) || 0 : 0};
          addDim(mJ, {
            rest: {pull: 0, gap: 0},
            target(d) {if (!d.on) {d.tgt.pull = 0; d.tgt.gap = 0; return } const dist = Math.hypot(d.p.x - 271.06, d.p.y - 275.36) / 400, p = clamp(1 - dist, 0, 1); d.tgt.pull = p * p; d.tgt.gap = (1 - p) * 10},
            apply(c) {
              const sa = tx(a), k = -sa * c.pull * .88 - c.gap;           /* cancel most of the idle separation, or open a quiet gap */
              wa.setAttribute('transform', 'translate(' + k + ' ' + k + ')'); wb.setAttribute('transform', 'translate(' + (-k) + ' ' + (-k) + ')');
              jg.setAttribute('opacity', (c.pull * .9).toFixed(3));
              ws.setAttribute('transform', 'translate(271.06 275.36) scale(' + (1 + c.pull * .22) + ') translate(-271.06 -275.36)')
            },
            tick(d) {return d.cur.pull > .001}
          });
        }

        /* 02 — Canopy + Elevation: growth rises toward the cursor, the canopy stays protective and stable */
        const mC = $('.m-canopy');
        if (mC) {
          const wr = wrapG([...mC.querySelectorAll('.rise')]), wd = wrapG(mC.querySelector('.dome'));
          addDim(mC, {
            rest: {lx: 0, ly: 0, rot: 0},
            target(d) {
              if (!d.on) {d.tgt.lx = 0; d.tgt.ly = 0; d.tgt.rot = 0; return } const lift = clamp((128 - d.p.y) / 70, -.3, 1), hx = clamp((d.p.x - 100) / 80, -1, 1);
              d.tgt.ly = -lift * 15; d.tgt.lx = hx * 6; d.tgt.rot = hx * 4
            },
            apply(c) {
              wr.setAttribute('transform', 'translate(' + c.lx + ' ' + c.ly + ')');
              wd.setAttribute('transform', 'translate(0 ' + (c.ly * .18) + ') rotate(' + c.rot + ' 100 128)')
            }
          });
        }

        /* 03 — Sharing risks & rewards: weight shifts toward the side the cursor approaches */
        const mS = $('.m-share');
        if (mS) {
          const beam = mS.querySelector('.beam'), wb = wrapG(beam); let ang = 0, vel = 0, idle = true;
          addDim(mS, {
            rest: {},
            enter() {
              if (!idle) return; const m = getComputedStyle(beam).transform, v = m && m.match(/matrix\(([^)]+)\)/);
              if (v) {const q = v[1].split(',').map(parseFloat); ang = Math.atan2(q[1], q[0]) * 180 / Math.PI}
              beam.style.animation = 'none'; vel = 0; idle = false
            },
            target() { },
            tick(d, dt) {
              if (idle) return false; let tg = 0;
              if (d.on) {let s = clamp((d.p.x - 100) / 66, -1, 1); s = Math.abs(s) < .15 ? 0 : Math.sign(s) * (Math.abs(s) - .15) / .85; tg = s * 11} /* + = gold side down */
              const f = dt / 16.7; vel += (tg - ang) * .035 * f; vel *= Math.pow(.77, f); ang += vel * f;
              const settled = !d.on && Math.abs(ang) < .03 && Math.abs(vel) < .003;
              if (settled) {ang = 0; vel = 0; idle = true; beam.style.animation = 'beam 5s ease-in-out -2.9s infinite'} /* resume idle at its level point */
              return !settled
            },
            apply() {wb.setAttribute('transform', 'rotate(' + ang.toFixed(3) + ' 100 100)')}
          });
        }

        /* 04 — Emergent guidance: the light activates as you approach; rays lean toward you */
        const mG = $('.m-guide');
        if (mG) {
          const rays = mG.querySelector('.rays'), wr = wrapG(rays), starG = mG.querySelector('.gs').parentNode, ws = wrapG(starG);
          const halo = mk('circle', {cx: 100, cy: 100, r: 34, fill: 'url(#haloG)', opacity: 0, style: 'pointer-events:none'}); mG.insertBefore(halo, ws);
          const lines = [...rays.querySelectorAll('line')].map(l => {const x = (+l.getAttribute('x1') + +l.getAttribute('x2')) / 2 - 100, y = (+l.getAttribute('y1') + +l.getAttribute('y2')) / 2 - 100; return {l, a: Math.atan2(y, x), w: 1.6}});
          const rest = {px: 0, py: 0, pr: 0}; lines.forEach((_, i) => rest['w' + i] = 0);
          addDim(mG, {
            rest,
            target(d) {
              const T = d.tgt; if (!d.on) {for (const k in T) T[k] = 0; return }
              const dx = d.p.x - 100, dy = d.p.y - 100, dist = Math.hypot(dx, dy) || 1, pr = clamp(1 - dist / 110, 0, 1), ca = Math.atan2(dy, dx), reach = Math.min(1, dist / 60);
              T.pr = pr; T.px = dx / dist * 6 * reach; T.py = dy / dist * 6 * reach;
              lines.forEach((o, i) => {T['w' + i] = Math.pow(Math.max(0, Math.cos(o.a - ca)), 4) * reach})
            },
            apply(c) {
              wr.setAttribute('transform', 'translate(' + c.px + ' ' + c.py + ') translate(100 100) scale(' + (1 + c.pr * .12) + ') translate(-100 -100)');
              ws.setAttribute('transform', 'translate(100 100) scale(' + (1 + c.pr * .18) + ') translate(-100 -100)');
              ws.style.filter = c.pr > .01 ? 'drop-shadow(0 0 ' + (c.pr * 9).toFixed(1) + 'px rgba(255,255,255,' + (c.pr * .75).toFixed(2) + '))' : '';
              halo.setAttribute('opacity', (c.pr * .75).toFixed(3));
              lines.forEach((o, i) => o.l.style.strokeWidth = (1.6 + c['w' + i] * 1.4).toFixed(2))
            }
          });
        }

        /* 05 — Optical pathway: a point of light enters from the nearest edge, meets the centre, flows outward */
        const mP = $('.m-path');
        if (mP) {
          const corners = [[20, 20], [180, 20], [180, 180], [20, 180]], dot = mP.querySelector('circle[r="5"]'), wdot = wrapG(dot);
          const trailG = mk('g', {style: 'pointer-events:none'}, mP), segs = Array.from({length: 8}, () => mk('line', {stroke: '#e9dcc0', 'stroke-linecap': 'round', opacity: 0}, trailG));
          const pt = mk('circle', {r: 2.8, fill: '#fff', opacity: 0, style: 'filter:drop-shadow(0 0 4px rgba(255,255,255,.9)) drop-shadow(0 0 8px rgba(194,165,111,.8));pointer-events:none'}, mP);
          let trip = null, wait = 0; const hist = [];
          const pulse = () => {
            const r = mk('circle', {cx: 100, cy: 100, r: 6, fill: 'none', stroke: '#c2a56f', 'stroke-width': 1.2, style: 'pointer-events:none;transform-box:view-box;transform-origin:100px 100px'}, mP);
            r.animate([{transform: 'scale(1)', opacity: .9}, {transform: 'scale(5)', opacity: 0}], {duration: 1300, easing: 'cubic-bezier(.16,1,.3,1)'}).onfinish = () => r.remove();
            wdot.animate([{transform: 'scale(1)'}, {transform: 'scale(1.9)'}, {transform: 'scale(1)'}], {duration: 900, easing: 'cubic-bezier(.16,1,.3,1)'})
          };
          wdot.style.transformBox = 'view-box'; wdot.style.transformOrigin = '100px 100px';
          addDim(mP, {
            rest: {glow: 0},
            target(d) {if (!d.on) {d.tgt.glow = 0; return } d.tgt.glow = clamp(1 - Math.hypot(d.p.x - 100, d.p.y - 100) / 90, 0, 1)},
            tick(d, dt) {
              if (!trip && d.on) {wait -= dt; if (wait <= 0) {let bi = 0, bd = 1e9; corners.forEach((c, i) => {const q = Math.hypot(d.p.x - c[0], d.p.y - c[1]); if (q < bd) {bd = q; bi = i} }); trip = {from: corners[bi], to: corners[(bi + 2) % 4], t: 0, pulsed: false}; hist.length = 0} }
              if (trip) {
                trip.t += dt; const IN = 1050, OUT = 1150; let x, y, op;
                if (trip.t < IN) {const e = trip.t / IN, k = e * e * (3 - 2 * e); x = trip.from[0] + (100 - trip.from[0]) * k; y = trip.from[1] + (100 - trip.from[1]) * k; op = Math.min(1, e * 4)}
                else {if (!trip.pulsed) {trip.pulsed = true; pulse()} const e = Math.min(1, (trip.t - IN) / OUT), k = 1 - Math.pow(1 - e, 3); x = 100 + (trip.to[0] - 100) * k; y = 100 + (trip.to[1] - 100) * k; op = 1 - e * e}
                pt.setAttribute('cx', x); pt.setAttribute('cy', y); pt.setAttribute('opacity', op.toFixed(3));
                hist.unshift([x, y]); if (hist.length > 9) hist.pop();
                segs.forEach((l, i) => {const a = hist[i], b = hist[i + 1]; if (!b) {l.setAttribute('opacity', 0); return } l.setAttribute('x1', a[0]); l.setAttribute('y1', a[1]); l.setAttribute('x2', b[0]); l.setAttribute('y2', b[1]); l.setAttribute('stroke-width', (2.2 * (1 - i / 8)).toFixed(2)); l.setAttribute('opacity', (.6 * (1 - i / 8) * op).toFixed(3))});
                if (trip.t >= IN + OUT) {trip = null; wait = 350; pt.setAttribute('opacity', 0); segs.forEach(l => l.setAttribute('opacity', 0))}
              }
              return !!trip
            },
            apply(c) {wdot.style.filter = c.glow > .01 ? 'drop-shadow(0 0 ' + (3 + c.glow * 7).toFixed(1) + 'px rgba(194,165,111,' + (.4 + c.glow * .5).toFixed(2) + '))' : ''}
          });
        }

        /* 06 — Pattern of restraint: it moves — but never past its boundary */
        const mR = $('.m-restraint');
        if (mR) {
          const arc = mR.querySelector('.arc'), wa = wrapG(arc), rect = mR.querySelector('rect'), wl = wrapG([...mR.querySelectorAll('line')]);
          addDim(mR, {
            rest: {rot: 0, sx: 0, sy: 0, s: 1, edge: 0}, ease: .06,
            target(d) {
              const T = d.tgt; if (!d.on) {T.rot = 0; T.sx = 0; T.sy = 0; T.s = 1; T.edge = 0; return }
              const dx = d.p.x - 100, dy = d.p.y - 100, hx = Math.tanh(dx / 55), hy = Math.tanh(dy / 55);   /* tanh = soft, bounded response */
              T.rot = hx * 22; T.sx = hx * 4; T.sy = hy * 4; T.s = 1 + .04 * Math.tanh((Math.hypot(dx, dy) - 62) / 40); T.edge = Math.pow(Math.max(Math.abs(hx), Math.abs(hy)), 3)
            },
            apply(c) {
              wa.setAttribute('transform', 'rotate(' + c.rot + ' 100 100) translate(100 100) scale(' + c.s + ') translate(-100 -100)');
              wl.setAttribute('transform', 'translate(' + c.sx + ' ' + c.sy + ')');
              rect.style.opacity = (.25 + c.edge * .35).toFixed(3)
            }
          });
        }
      }


    

    /* WR:BEGIN — 01 · Who We Are & Our Role · interaction engine */
    (function () {
      'use strict';
      var root = document.documentElement;
      var stage = document.querySelector('.who-stage');
      var tiles = [].slice.call(document.querySelectorAll('.role[data-k]'));
      if (!stage && !tiles.length) return;
      if (!window.requestAnimationFrame || !window.IntersectionObserver) return;

      var mqR = matchMedia('(prefers-reduced-motion: reduce)'), mqF = matchMedia('(hover:hover) and (pointer:fine)');
      var reduce = mqR.matches, fine = mqF.matches;
      function onMq(mq, fn) {if (mq.addEventListener) mq.addEventListener('change', fn); else if (mq.addListener) mq.addListener(fn);}
      onMq(mqR, function (e) {reduce = e.matches; kick();});
      onMq(mqF, function (e) {fine = e.matches;});

      var TAU = Math.PI * 2;
      function cl(v, a, b) {return v < a ? a : v > b ? b : v;}
      function lerp(a, b, u) {return a + (b - a) * u;}
      function sm(u) {u = cl(u, 0, 1); return u * u * (3 - 2 * u);}
      function wrap(a) {while (a > Math.PI) a -= TAU; while (a < -Math.PI) a += TAU; return a;}
      function rng(seed) {var s = seed % 2147483647; if (s <= 0) s += 2147483646; return function () {s = s * 16807 % 2147483647; return (s - 1) / 2147483646;};}

      /* ---------- palette (follows the site theme live) ---------- */
      var P = {}, themeKey = '';
      function pal() {
        var L = root.getAttribute('data-theme') === 'light', k = L ? 'l' : 'd';
        if (k === themeKey) return false; themeKey = k;
        P = L ? {L: 1, ink: '9,29,60', gold: '148,123,76', gl: '138,112,64', sky: '90,127,160', star: '9,29,60', add: 'source-over'}
          : {L: 0, ink: '243,234,217', gold: '148,123,76', gl: '194,165,111', sky: '135,167,198', star: '255,255,255', add: 'lighter'};
        return true;
      }
      function c(k, a) {return 'rgba(' + P[k] + ',' + (a < 0 ? 0 : a > 1 ? 1 : a).toFixed(3) + ')';}
      function isRTL() {return (root.getAttribute('dir') || '').toLowerCase() === 'rtl';}

      /* ---------- small drawing helpers ---------- */
      function dot(x, X, Y, r, col) {x.beginPath(); x.arc(X, Y, r, 0, TAU); x.fillStyle = col; x.fill();}
      function ring(x, X, Y, r, col, lw) {x.beginPath(); x.arc(X, Y, r, 0, TAU); x.strokeStyle = col; x.lineWidth = lw || 1; x.stroke();}
      function line(x, a, b, cc, dd, col, lw) {x.beginPath(); x.moveTo(a, b); x.lineTo(cc, dd); x.strokeStyle = col; x.lineWidth = lw || 1; x.stroke();}
      function star4(x, X, Y, r) {x.beginPath(); x.moveTo(X, Y - r); x.quadraticCurveTo(X, Y, X + r, Y); x.quadraticCurveTo(X, Y, X, Y + r); x.quadraticCurveTo(X, Y, X - r, Y); x.quadraticCurveTo(X, Y, X, Y - r); x.closePath();}
      function glow(x, X, Y, r, k, a) {if (a <= .004) return; var g = x.createRadialGradient(X, Y, 0, X, Y, r); g.addColorStop(0, c(k, a)); g.addColorStop(1, c(k, 0)); x.fillStyle = g; x.fillRect(X - r, Y - r, r * 2, r * 2);}
      function prox(it, X, Y, rad) {var dx = it.px - X, dy = it.py - Y; return it.on * Math.exp(-(dx * dx + dy * dy) / (2 * rad * rad));}
      function shieldPath(x, cx, cy, s) {
        x.beginPath();
        x.moveTo(cx - s * .78, cy - s * .86);
        x.quadraticCurveTo(cx, cy - s * 1.04, cx + s * .78, cy - s * .86);
        x.lineTo(cx + s * .78, cy - s * .12);
        x.quadraticCurveTo(cx + s * .74, cy + s * .66, cx, cy + s * 1.06);
        x.quadraticCurveTo(cx - s * .74, cy + s * .66, cx - s * .78, cy - s * .12);
        x.closePath();
      }
      /* quadratic curve between two points with perpendicular bend */
      function qpt(p0, p1, bend, u, o) {
        var dx = p1.x - p0.x, dy = p1.y - p0.y, cx = (p0.x + p1.x) / 2 - dy * bend, cy = (p0.y + p1.y) / 2 + dx * bend, iu = 1 - u;
        o.x = iu * iu * p0.x + 2 * iu * u * cx + u * u * p1.x; o.y = iu * iu * p0.y + 2 * iu * u * cy + u * u * p1.y; return o;
      }
      function qcurve(x, p0, p1, bend) {
        var dx = p1.x - p0.x, dy = p1.y - p0.y;
        x.moveTo(p0.x, p0.y); x.quadraticCurveTo((p0.x + p1.x) / 2 - dy * bend, (p0.y + p1.y) / 2 + dx * bend, p1.x, p1.y);
      }

      /* ======================================================================
         ENGINE — one RAF loop, two motion layers:
         Layer 1 ambient time T (always advancing unless reduced-motion)
         Layer 2 eased interaction state it.on / it.px / it.py
         ====================================================================== */
      var items = [], raf = 0, last = 0, T = 0;
      function kick() {if (!raf && !document.hidden) raf = requestAnimationFrame(frame);}
      document.addEventListener('visibilitychange', function () {if (!document.hidden) {last = 0; kick();} });

      function size(it) {
        var r = it.cv.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1);
        if (r.width < 2 || r.height < 2) return;
        it.w = r.width; it.h = r.height; it.dpr = d;
        it.cv.width = Math.round(r.width * d); it.cv.height = Math.round(r.height * d);
        it.ctx.setTransform(d, 0, 0, d, 0, 0); it.d.lay = 0; it.fresh = 1; kick();
      }
      var ro = window.ResizeObserver ? new ResizeObserver(function (es) {es.forEach(function (en) {if (en.target.__wr) size(en.target.__wr);});}) : null;
      var io = new IntersectionObserver(function (es) {es.forEach(function (en) {if (en.target.__wr) en.target.__wr.vis = en.isIntersecting;}); kick();}, {rootMargin: '120px 0px'});

      function add(el, cv, draw, opt) {
        var it = {
          el: el, cv: cv, ctx: cv.getContext('2d'), draw: draw, opt: opt || {}, w: 0, h: 0, dpr: 1, vis: false,
          on: 0, px: 0, py: 0, tx: 0, ty: 0, ptr: 0, foc: 0, fresh: 1, act: -1, seed: items.length + 3, d: {lay: 0}, dt: 16.7, dtA: 16.7, tm: 0
        };
        cv.__wr = it; el.__wr = it;
        function loc(e) {var r = cv.getBoundingClientRect(); it.tx = e.clientX - r.left; it.ty = e.clientY - r.top;}
        function release() {clearTimeout(it.tm); it.tm = setTimeout(function () {it.ptr = 0; kick();}, 1500);}
        el.addEventListener('pointerenter', function (e) {if (e.pointerType === 'mouse') {loc(e); it.ptr = 1; kick();} });
        el.addEventListener('pointermove', function (e) {loc(e); it.ptr = 1; if (e.pointerType !== 'mouse') clearTimeout(it.tm); kick();});
        el.addEventListener('pointerdown', function (e) {loc(e); it.ptr = 1; clearTimeout(it.tm); kick();});
        el.addEventListener('pointerleave', function (e) {if (e.pointerType === 'mouse') {it.ptr = 0; kick();} else release();});
        el.addEventListener('pointerup', function (e) {if (e.pointerType !== 'mouse') release();});
        el.addEventListener('pointercancel', release);
        el.addEventListener('focus', function () {var fv = true; try {fv = el.matches(':focus-visible');} catch (_) { } if (fv) {it.foc = 1; kick();} });
        el.addEventListener('blur', function () {it.foc = 0; kick();});
        if (ro) ro.observe(cv); else window.addEventListener('resize', function () {size(it);});
        io.observe(cv);
        items.push(it); size(it);
        return it;
      }

      function frame(now) {
        raf = 0; if (document.hidden) return;
        var dt = last ? Math.min(64, now - last) : 16.7; last = now;
        var themeChanged = pal();
        if (!reduce) T += dt;
        var vh = window.innerHeight || 800, any = false, busy = false;
        for (var i = 0; i < items.length; i++) {
          var it = items[i];
          if (!it.vis || !it.w) continue;
          any = true;
          /* --- target interaction: pointer > keyboard focus > touch/scroll auto --- */
          var aut = 0, vx, vy;
          if (it.ptr) {vx = it.tx; vy = it.ty;}
          else {
            vx = it.w * (.5 + .34 * Math.sin(T * .00058 + it.seed * 1.7));
            vy = it.h * (.5 + .3 * Math.sin(T * .00087 + it.seed * 2.3));
            if (!reduce) {
              if (it.foc) aut = 1;
              else if (!fine) {
                if (it.opt.auto) {var o = it.opt.auto(it, vh); aut = o.a; vx = o.x; vy = o.y;}
                else {var r = it.el.getBoundingClientRect(), cy = r.top + r.height / 2; aut = sm((1 - Math.abs(cy - vh / 2) / (vh * .36)) * 1.3);}
              }
            }
          }
          var tgt = Math.max(it.ptr, aut);
          var f = 1 - Math.pow(1 - .065, dt / 16.7), g = 1 - Math.pow(1 - .13, dt / 16.7);
          if (it.fresh) {it.px = vx; it.py = vy; it.fresh = 0;}
          it.on += (tgt - it.on) * f; it.px += (vx - it.px) * g; it.py += (vy - it.py) * g;
          if (Math.abs(tgt - it.on) > .003 || Math.abs(vx - it.px) > .4 || Math.abs(vy - it.py) > .4) busy = true;
          it.dt = dt; it.dtA = reduce ? 0 : dt;
          var x = it.ctx;
          x.setTransform(it.dpr, 0, 0, it.dpr, 0, 0);
          x.globalCompositeOperation = 'source-over';
          x.clearRect(0, 0, it.w, it.h);
          it.draw(it, x, it.w, it.h, T, themeChanged);
          if (it.opt.act) {var a = Math.round(it.on * 100) / 100; if (a !== it.act) {it.act = a; it.el.style.setProperty('--act', a);} }
        }
        if (any && (!reduce || busy)) kick();
      }

      /* ======================================================================
         WHO WE ARE — global capacity ⟷ SKY RE ⟷ local expertise
         ====================================================================== */
      if (stage) {
        var cvW = stage.querySelector('.who-cv'), sym = stage.querySelector('.who-sym');
        var gA_el = sym && sym.querySelector('.wA'), gB_el = sym && sym.querySelector('.wB');
        var tmp = {x: 0, y: 0}, tmp2 = {x: 0, y: 0};

        var whoLayout = function (it) {
          var w = it.w, h = it.h, d = it.d, por = w / h < 1, r = rng(11), i;
          d.por = por; stage.classList.toggle('portrait', por);
          if (por) {d.C = {x: w * .5, y: h * .5}; d.G = {x: w * .3, y: h * .21}; d.Lc = {x: w * .7, y: h * .79}; d.R = Math.min(w * .22, h * .115);}
          else {d.C = {x: w * .5, y: h * .46}; d.G = {x: w * .2, y: h * .42}; d.Lc = {x: w * .8, y: h * .42}; d.R = Math.min(w * .12, h * .2);}
          d.symR = sym ? sym.getBoundingClientRect().width / 2 : 90;
          d.stars = []; for (i = 0; i < (w < 600 ? 44 : 80); i++)d.stars.push({x: r() * w, y: r() * h, s: r() * 1 + .3, p: r() * TAU, v: .0006 + r() * .0012});
          d.gn = []; for (i = 0; i < 12; i++)d.gn.push({lon: r() * TAU, lat: (r() - .5) * 2.1, s: 1.5 + r() * 1.5, x: 0, y: 0, z: 0});
          var a = d.R * .6, lat = [[0, 0], [1, 0], [-1, 0], [0, 1], [-1, 1], [0, -1], [1, -1], [1, 1], [-1, -1]];
          d.ln = []; for (i = 0; i < lat.length; i++) {var q = lat[i]; d.ln.push({bx: d.Lc.x + a * (q[0] + q[1] * .5) + (r() - .5) * a * .25, by: d.Lc.y + a * q[1] * .866 + (r() - .5) * a * .25, s: 1.6 + r() * 1.3, p: r() * TAU, x: 0, y: 0});}
          d.a = a;
          var nCap = w < 600 ? 30 : 48, nRisk = w < 600 ? 20 : 32;
          d.parts = [];
          for (i = 0; i < nCap + nRisk; i++)d.parts.push({t: i < nCap ? 0 : 1, a: Math.floor(r() * d.gn.length), b: Math.floor(r() * d.ln.length), s: r(), v: .000085 + r() * .00007});
          d.rng = r; d.rot = d.rot || 0; d.lay = 1;
        };

        var drawWho = function (it, x, w, h, T) {
          var d = it.d; if (!d.lay) whoLayout(it);
          var C = d.C, G = d.G, Lc = d.Lc, R = d.R, on = it.on, i, n, p;
          var b = d.por ? (it.py / h - .5) * 2 : (it.px / w - .5) * 2;
          var gA = on * sm((-b - .1) / .55), lA = on * sm((b - .1) / .55), cz = on * (1 - sm(Math.abs(b) / .3));
          d.gA = gA; d.lA = lA; d.cz = cz;
          var add = P.add;

          /* starfield */
          for (i = 0; i < d.stars.length; i++) {var st = d.stars[i]; dot(x, st.x, st.y, st.s, c('ink', .1 + .16 * (.5 + .5 * Math.sin(T * st.v + st.p))));}

          /* halos */
          x.globalCompositeOperation = add;
          glow(x, G.x, G.y, R * 2.3, 'gl', .05 + gA * .2);
          glow(x, Lc.x, Lc.y, R * 2.1, 'gl', .04 + lA * .2);
          glow(x, C.x, C.y, d.symR * 2.6, 'gl', .07 + cz * .26 + (gA + lA) * .05);
          x.globalCompositeOperation = 'source-over';

          /* GLOBAL — rotating globe of international reinsurers + orbit (superior network) */
          d.rot += it.dtA * (.00011 + gA * .00035) + (reduce ? 0 : 0);
          var ga = .13 + gA * .32 - lA * .05;
          ring(x, G.x, G.y, R, c('ink', ga), 1);
          for (i = 0; i < 6; i++) {var lo = i * Math.PI / 6 + d.rot, rx = Math.abs(Math.sin(lo)) * R; x.beginPath(); x.ellipse(G.x, G.y, Math.max(.1, rx), R, 0, 0, TAU); x.strokeStyle = c('ink', ga * .55); x.lineWidth = .8; x.stroke();}
          for (i = -1; i <= 1; i++) {var la = i * .62, yy = G.y - R * Math.sin(la), rr = R * Math.cos(la); x.beginPath(); x.ellipse(G.x, yy, rr, rr * .17, 0, 0, TAU); x.strokeStyle = c('ink', ga * .5); x.stroke();}
          x.beginPath(); x.ellipse(G.x, G.y, R * 1.42, R * .44, -.32, 0, TAU); x.strokeStyle = c('gl', .16 + gA * .4); x.lineWidth = 1; x.stroke();
          var oa = T * .00035 + d.rot * 2, ox = Math.cos(oa) * R * 1.42, oy = Math.sin(oa) * R * .44, cs = Math.cos(-.32), sn = Math.sin(-.32);
          dot(x, G.x + ox * cs - oy * sn, G.y + ox * sn + oy * cs, 2.4, c('gl', .6 + gA * .4));
          for (i = 0; i < d.gn.length; i++) {
            n = d.gn[i]; var l2 = n.lon + d.rot;
            n.z = Math.cos(n.lat) * Math.cos(l2);
            n.x = G.x + R * Math.cos(n.lat) * Math.sin(l2);
            n.y = G.y - R * Math.sin(n.lat) + n.z * R * .06;
            var pk = prox(it, n.x, n.y, R * 1.1) * 10, dx = it.px - n.x, dy = it.py - n.y, dl = Math.sqrt(dx * dx + dy * dy) || 1;
            n.x += dx / dl * pk; n.y += dy / dl * pk;
          }
          /* LOCAL — Saudi-geometric lattice + eight-point star */
          var la2 = .07 + lA * .18 - gA * .02;
          x.save(); x.beginPath(); x.arc(Lc.x, Lc.y, R * 1.2, 0, TAU); x.clip();
          x.strokeStyle = c('ink', la2); x.lineWidth = .8; x.beginPath();
          var sp = d.a * .5; for (var k = -8; k <= 8; k++) {var o2 = k * sp * 1.414; x.moveTo(Lc.x + o2 - R * 1.3, Lc.y - R * 1.3); x.lineTo(Lc.x + o2 + R * 1.3, Lc.y + R * 1.3); x.moveTo(Lc.x + o2 + R * 1.3, Lc.y - R * 1.3); x.lineTo(Lc.x + o2 - R * 1.3, Lc.y + R * 1.3);}
          x.stroke(); x.restore();
          var oc = R * 1.02, br = 1 + .02 * Math.sin(T * .0009);
          x.save(); x.translate(Lc.x, Lc.y); x.strokeStyle = c('gl', .13 + lA * .38); x.lineWidth = 1;
          x.strokeRect(-oc * .7 * br, -oc * .7 * br, oc * 1.4 * br, oc * 1.4 * br); x.rotate(Math.PI / 4); x.strokeRect(-oc * .7 * br, -oc * .7 * br, oc * 1.4 * br, oc * 1.4 * br); x.restore();
          for (i = 0; i < d.ln.length; i++) {
            n = d.ln[i]; n.x = n.bx + Math.sin(T * .0007 + n.p) * 2; n.y = n.by + Math.cos(T * .0006 + n.p) * 2;
            var pk2 = prox(it, n.x, n.y, R) * 8, ex = it.px - n.x, ey = it.py - n.y, el = Math.sqrt(ex * ex + ey * ey) || 1; n.x += ex / el * pk2; n.y += ey / el * pk2;
          }
          x.beginPath();
          for (i = 0; i < d.ln.length; i++)for (var j = i + 1; j < d.ln.length; j++) {var A = d.ln[i], B = d.ln[j], dd = Math.hypot(A.x - B.x, A.y - B.y); if (dd < d.a * 1.18) {x.moveTo(A.x, A.y); x.lineTo(B.x, B.y);} }
          x.strokeStyle = c('ink', .12 + lA * .3); x.lineWidth = .9; x.stroke();

          /* links — capacity (gold) and risk (sky) through SKY RE */
          x.lineWidth = .8;
          x.beginPath(); for (i = 0; i < d.gn.length; i++)qcurve(x, d.gn[i], C, .16);
          x.strokeStyle = c('gl', .06 + gA * .2 + cz * .14); x.stroke();
          x.beginPath(); for (i = 0; i < d.ln.length; i++)qcurve(x, C, d.ln[i], .16);
          x.strokeStyle = c('gl', .05 + lA * .16 + cz * .14); x.stroke();
          x.beginPath(); for (i = 0; i < d.ln.length; i++)qcurve(x, d.ln[i], C, .16);
          x.strokeStyle = c('sky', .04 + lA * .14 + cz * .1); x.stroke();
          x.beginPath(); for (i = 0; i < d.gn.length; i++)qcurve(x, C, d.gn[i], .16);
          x.strokeStyle = c('sky', .035 + gA * .12 + cz * .1); x.stroke();

          /* nodes */
          for (i = 0; i < d.gn.length; i++) {
            n = d.gn[i]; var fz = .35 + .65 * (n.z * .5 + .5), na = (.35 + gA * .6) * fz;
            if (gA > .05 && n.z > 0) ring(x, n.x, n.y, n.s + 4 + 2 * Math.sin(T * .003 + i), c('gl', gA * .35 * fz), .8);
            dot(x, n.x, n.y, n.s * (.8 + .3 * fz), c(n.z > 0 ? 'gl' : 'ink', na));
          }
          for (i = 0; i < d.ln.length; i++) {
            n = d.ln[i]; var ph = (T * .0005 + n.p / TAU) % 1;
            ring(x, n.x, n.y, n.s + ph * 9, c('gl', (1 - ph) * (.12 + lA * .4)), .8);
            dot(x, n.x, n.y, n.s, c('ink', .5 + lA * .45));
          }

          /* particles */
          var vC = 1 + 2.2 * gA + 2.6 * cz + .5 * lA, vR = 1 + 2.2 * lA + 2.6 * cz + .5 * gA;
          x.globalCompositeOperation = add;
          for (i = 0; i < d.parts.length; i++) {
            p = d.parts[i]; p.s += it.dtA * p.v * (p.t ? vR : vC);
            if (p.s >= 1) {p.s -= 1; p.a = Math.floor(d.rng() * d.gn.length); p.b = Math.floor(d.rng() * d.ln.length);}
            var s0 = p.s, s1 = Math.max(0, p.s - .035), src = p.t ? d.ln[p.b] : d.gn[p.a], dst = p.t ? d.gn[p.a] : d.ln[p.b];
            if (s0 < .5) qpt(src, C, .16, s0 * 2, tmp); else qpt(C, dst, .16, (s0 - .5) * 2, tmp);
            if (s1 < .5) qpt(src, C, .16, s1 * 2, tmp2); else qpt(C, dst, .16, (s1 - .5) * 2, tmp2);
            var fade = Math.min(1, s0 * 8, (1 - s0) * 8), emph = p.t ? (lA * .5 + cz * .4) : (gA * .5 + cz * .4), pa = (.4 + emph) * fade;
            var k2 = p.t ? 'sky' : 'gl';
            line(x, tmp2.x, tmp2.y, tmp.x, tmp.y, c(k2, pa * .55), 1.1);
            dot(x, tmp.x, tmp.y, p.t ? 1.3 : 1.6, c(k2, pa));
          }
          x.globalCompositeOperation = 'source-over';

          /* centre — the joining point */
          var ph2 = (T * .0005) % 1;
          ring(x, C.x, C.y, d.symR * (.95 + ph2 * .7), c('gl', (1 - ph2) * (.06 + cz * .4)), 1);
          if (cz > .02) {var ph3 = (T * .0005 + .5) % 1; ring(x, C.x, C.y, d.symR * (.95 + ph3 * .7), c('gl', (1 - ph3) * cz * .35), 1);}
          ring(x, C.x, C.y, d.symR * 1.18, c('ink', .06 + cz * .12), .8);

          /* symbol — subtle translation of the two crescents only (logo never rotated or altered) */
          var amb = reduce ? 0 : Math.sin(T * .0007) * 2.2;
          var ax = (-gA * 10 + cz * 4 - amb).toFixed(2), bx = (lA * 10 - cz * 4 + amb).toFixed(2);
          var sg = (.25 + cz * .75 + (gA + lA) * .15).toFixed(2);
          if (gA_el && d.tA !== ax) {d.tA = ax; gA_el.style.transform = 'translate(' + ax + 'px,' + ax + 'px)';}
          if (gB_el && d.tB !== bx) {d.tB = bx; gB_el.style.transform = 'translate(' + bx + 'px,' + bx + 'px)';}
          if (sym && d.sg !== sg) {d.sg = sg; sym.style.setProperty('--sg', sg);}
          /* zone → labels */
          var z = on < .22 ? '' : (cz > gA && cz > lA ? 'c' : (gA > lA ? 'g' : 'l'));
          if (d.z !== z) {d.z = z; if (z) stage.setAttribute('data-zone', z); else stage.removeAttribute('data-zone');}
        };

        add(stage, cvW, drawWho, {
          auto: function (it, vh) {
            /* touch / no-hover: scroll sweeps Global → SKY RE → Local */
            var r = stage.getBoundingClientRect(), p = cl((vh - r.top) / (vh + r.height), 0, 1), u = cl((p - .18) / .64, 0, 1);
            var a = sm(Math.min(p, 1 - p) * 6);
            return it.d.por ? {a: a * .9, x: it.w * .5, y: it.h * u} : {a: a * .9, x: it.w * u, y: it.h * .46};
          }
        });
      }

      /* ======================================================================
         OUR ROLE — eight living illustrations
         ====================================================================== */
      var R8 = {
        /* 01 Specialized Underwriting — layered shields that part toward the cursor; scan reads the risk */
        shield: function (it, x, w, h, T) {
          var cx = w / 2, cy = h * .53, S = Math.min(w * .25, h * .4), on = it.on, nx = (it.px - cx) / w, ny = (it.py - cy) / h, i, ic = {x: cx, y: cy, s: S};
          for (i = 0; i < 4; i++) {
            var br = 1 + .02 * Math.sin(T * .0011 + i * .9), sz = S * (1 - i * .19) * br;
            var ox = nx * on * (i + 1) * 8, oy = ny * on * (i + 1) * 6 + Math.sin(T * .0009 + i) * 1.3;
            shieldPath(x, cx + ox, cy + oy, sz);
            if (i === 3) {x.fillStyle = c('gl', .07 + .26 * on); x.fill(); ic = {x: cx + ox, y: cy + oy, s: sz};}
            x.strokeStyle = i === 3 ? c('gl', .5 + .45 * on) : c('ink', .13 + .07 * i + .1 * on); x.lineWidth = i === 0 ? 1.2 : 1; x.stroke();
          }
          x.save(); shieldPath(x, cx, cy, S); x.clip();
          var amb = cy - S * 1.05 + ((T * .00026) % 1) * S * 2.2, sy = lerp(amb, cl(it.py, cy - S, cy + S), on);
          var gr = x.createLinearGradient(0, sy - 22, 0, sy); gr.addColorStop(0, c('gl', 0)); gr.addColorStop(1, c('gl', .16 + .2 * on));
          x.fillStyle = gr; x.fillRect(cx - S, sy - 22, S * 2, 22);
          line(x, cx - S, sy, cx + S, sy, c('gl', .35 + .45 * on), 1);
          x.restore();
          x.globalCompositeOperation = P.add; glow(x, ic.x, ic.y, ic.s * 1.2, 'gl', .06 + .22 * on); x.globalCompositeOperation = 'source-over';
          star4(x, ic.x, ic.y - ic.s * .08, 3 + 4 * on); x.fillStyle = c('star', .45 + .55 * on); x.fill();
        },
        /* 02 Tailored Solutions — loose modules assemble into one tailored structure */
        modules: function (it, x, w, h, T) {
          var d = it.d, i;
          if (!d.lay) {
            var r = rng(it.seed * 7); d.t = []; for (i = 0; i < 6; i++)d.t.push({lx: (r() - .5) * 2, ly: (r() - .5) * 2, r: (r() - .5) * 1.1, p: r() * TAU});
            d.t[0].lx = -.9; d.t[5].lx = .9; d.lay = 1;
          }
          var cx = w / 2, cy = h / 2, u = Math.min(w * .13, h * .25), g = 4, gw = 3 * u + 2 * g, gh = 2 * u + g, ox = cx - gw / 2, oy = cy - gh / 2, on = it.on, ms = 0;
          for (i = 0; i < 6; i++) {
            var t = d.t[i], tx = ox + (i % 3) * (u + g) + u / 2, ty = oy + Math.floor(i / 3) * (u + g) + u / 2;
            var lx = cx + t.lx * w * .33 + Math.sin(T * .0006 + t.p) * 6, ly = cy + t.ly * h * .27 + Math.cos(T * .0005 + t.p) * 5, lr = t.r + Math.sin(T * .0004 + t.p) * .14;
            var m = Math.min(1, sm(on * 1.3 - i * .06) + prox(it, lx, ly, u * 1.4) * .45); ms += m;
            var X = lerp(lx, tx, m), Y = lerp(ly, ty, m), Rr = lerp(lr, 0, m), s = u * lerp(.8, 1, m);
            x.save(); x.translate(X, Y); x.rotate(Rr);
            if (i === 1 || i === 5) {x.fillStyle = c('gl', .08 + .24 * m); x.fillRect(-s / 2, -s / 2, s, s);}
            x.strokeStyle = c(i === 1 || i === 5 ? 'gl' : 'ink', .3 + .35 * m); x.lineWidth = 1; x.strokeRect(-s / 2, -s / 2, s, s);
            x.strokeStyle = c('gl', .35 + .45 * m); x.beginPath();
            var q = s * .22;
            if (i === 0) {x.arc(0, 0, q, 0, TAU);}
            else if (i === 2) {x.moveTo(-q, q); x.lineTo(q, -q);}
            else if (i === 3) {x.moveTo(0, -q); x.lineTo(q, 0); x.lineTo(0, q); x.lineTo(-q, 0); x.closePath();}
            else if (i === 4) {x.arc(0, q * .4, q, Math.PI * 1.1, Math.PI * 1.9);}
            else if (i === 1) {x.moveTo(-q, 0); x.lineTo(q, 0); x.moveTo(0, -q); x.lineTo(0, q);}
            else {x.arc(0, 0, q * .5, 0, TAU);}
            x.stroke(); x.restore();
          }
          var mm = ms / 6;
          if (mm > .3) {
            var a = sm((mm - .3) / .6), e = 7, k = 8; x.strokeStyle = c('gl', .55 * a); x.lineWidth = 1; x.beginPath();
            var L = ox - e, Tt = oy - e, Rr2 = ox + gw + e, B = oy + gh + e;
            x.moveTo(L, Tt + k); x.lineTo(L, Tt); x.lineTo(L + k, Tt); x.moveTo(Rr2 - k, Tt); x.lineTo(Rr2, Tt); x.lineTo(Rr2, Tt + k);
            x.moveTo(Rr2, B - k); x.lineTo(Rr2, B); x.lineTo(Rr2 - k, B); x.moveTo(L + k, B); x.lineTo(L, B); x.lineTo(L, B - k); x.stroke();
            for (i = 0; i < 2; i++) {dot(x, ox + u + g / 2, oy + u / 2 + i * (u + g), 1.6, c('gl', a)); dot(x, ox + 2 * u + g * 1.5, oy + u / 2 + i * (u + g), 1.6, c('gl', a));}
            for (i = 0; i < 3; i++)dot(x, ox + u / 2 + i * (u + g), oy + u + g / 2, 1.6, c('gl', a));
          }
        },
        /* 03 Risk Assessment — analytical radar; the sweep follows the cursor and reads each risk */
        radar: function (it, x, w, h, T) {
          var d = it.d, i, cx = w / 2, cy = h * .52, R = Math.min(w * .4, h * .45), on = it.on;
          if (!d.lay) {var r = rng(it.seed * 13); d.pts = []; for (i = 0; i < 10; i++)d.pts.push({r: .25 + r() * .68, a: i / 10 * TAU + (r() - .5) * .5, v: [r(), r(), r()]}); d.ang = 0; d.lay = 1;}
          for (i = 1; i <= 3; i++)ring(x, cx, cy, R * i / 3, c('ink', .09 + (i === 3 ? .05 : 0)), .8);
          x.beginPath(); for (i = 0; i < 12; i++) {var a = i / 12 * TAU; x.moveTo(cx, cy); x.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);} x.strokeStyle = c('ink', .05); x.stroke();
          x.beginPath(); for (i = 0; i < 60; i++) {var b = i / 60 * TAU, l = i % 5 ? 3 : 6; x.moveTo(cx + Math.cos(b) * R, cy + Math.sin(b) * R); x.lineTo(cx + Math.cos(b) * (R + l), cy + Math.sin(b) * (R + l));} x.strokeStyle = c('ink', .15); x.stroke();
          var ha = Math.atan2(it.py - cy, it.px - cx);
          d.ang += it.dtA * .0011 * (1 - on) + wrap(ha - d.ang) * cl(on * .14 * it.dt / 16.7, 0, 1);
          var A = d.ang;
          x.globalCompositeOperation = P.add;
          for (i = 0; i < 18; i++) {x.beginPath(); x.moveTo(cx, cy); x.arc(cx, cy, R, A - (i + 1) * .045, A - i * .045); x.closePath(); x.fillStyle = c('gl', (1 - i / 18) * (.1 + .1 * on)); x.fill();}
          x.globalCompositeOperation = 'source-over';
          line(x, cx, cy, cx + Math.cos(A) * R, cy + Math.sin(A) * R, c('gl', .6 + .35 * on), 1.1);
          var P2 = d.pts.map(function (p) {return {x: cx + Math.cos(p.a) * p.r * R, y: cy + Math.sin(p.a) * p.r * R, p: p};});
          x.beginPath(); P2.forEach(function (q, k) {if (k) x.lineTo(q.x, q.y); else x.moveTo(q.x, q.y);}); x.closePath();
          x.fillStyle = c('gl', .03 + .07 * on); x.fill(); x.strokeStyle = c('gl', .12 + .25 * on); x.lineWidth = .9; x.stroke();
          var best = null, bd = 1e9;
          P2.forEach(function (q) {
            var db = ((A - q.p.a) % TAU + TAU) % TAU, bri = Math.exp(-db * 1.5);
            dot(x, q.x, q.y, 1.5 + bri * 2.2, c(bri > .25 ? 'gl' : 'ink', .3 + bri * .7));
            var dd = Math.hypot(q.x - it.px, q.y - it.py); if (dd < bd) {bd = dd; best = q;}
          });
          if (best && on > .03) {
            var a2 = on;
            x.setLineDash([2, 3]);
            line(x, cx - R, best.y, cx + R, best.y, c('ink', .2 * a2), .8); line(x, best.x, cy - R, best.x, cy + R, c('ink', .2 * a2), .8);
            x.setLineDash([]);
            ring(x, best.x, best.y, 7 + 1.5 * Math.sin(T * .005), c('gl', .8 * a2), 1);
            var bx = best.x + (best.x > cx ? -38 : 12), by = best.y - 10;
            for (i = 0; i < 3; i++) {x.fillStyle = c('ink', .12 * a2); x.fillRect(bx, by + i * 7, 26, 2.5); x.fillStyle = c('gl', .85 * a2); x.fillRect(bx, by + i * 7, 26 * best.p.v[i], 2.5);}
          }
          dot(x, cx, cy, 2.2, c('gl', .9));
        },
        /* 04 Post-Bind Support — an operational pathway that lights up as you move along it */
        path: function (it, x, w, h, T) {
          var d = it.d, i, rtl = isRTL(), on = it.on;
          if (!d.lay || d.rtl !== rtl) {
            d.rtl = rtl; var N = 90, x0 = w * .08, x1 = w * .92; d.x0 = x0; d.x1 = x1; d.pts = []; d.len = [0];
            for (i = 0; i <= N; i++) {var u = i / N, X = lerp(x0, x1, u), Y = h * .52 + Math.sin(u * TAU * 1.0 + .5) * h * .17 * Math.sin(u * Math.PI); d.pts.push({x: X, y: Y});}
            if (rtl) d.pts.reverse();
            for (i = 1; i <= N; i++)d.len.push(d.len[i - 1] + Math.hypot(d.pts[i].x - d.pts[i - 1].x, d.pts[i].y - d.pts[i - 1].y));
            d.L = d.len[N]; d.pr = d.pr || 0; d.lay = 1;
          }
          var pts = d.pts, len = d.len, Ltot = d.L;
          function at(u) {
            var s = cl(u, 0, 1) * Ltot, lo = 0, hi = len.length - 1; while (hi - lo > 1) {var m = (lo + hi) >> 1; if (len[m] < s) lo = m; else hi = m;}
            var t = (s - len[lo]) / ((len[hi] - len[lo]) || 1); return {x: lerp(pts[lo].x, pts[hi].x, t), y: lerp(pts[lo].y, pts[hi].y, t)};
          }
          function stroke(u0, u1, col, lw) {x.beginPath(); var st = at(u0); x.moveTo(st.x, st.y); for (var k = 0; k < pts.length; k++) {var uk = len[k] / Ltot; if (uk > u0 && uk < u1) x.lineTo(pts[k].x, pts[k].y);} var en = at(u1); x.lineTo(en.x, en.y); x.strokeStyle = col; x.lineWidth = lw; x.stroke();}
          stroke(0, 1, c('ink', .16), 1.2);
          var cu = cl(rtl ? (d.x1 - it.px) / (d.x1 - d.x0) : (it.px - d.x0) / (d.x1 - d.x0), 0, 1);
          d.pr += (cu - d.pr) * cl(.12 * it.dt / 16.7, 0, 1);
          var lit = d.pr * sm(on * 1.4);
          if (lit > .002) {stroke(0, lit, c('gl', .16), 6); stroke(0, lit, c('gl', .9), 1.6);}
          var q = (T * .00016) % 1, pa = 1 - on * .7;
          for (i = 0; i < 10; i++) {var pp = at(q - i * .012); if (q - i * .012 < 0) break; dot(x, pp.x, pp.y, 2.4 - i * .18, c('gl', pa * (1 - i / 10) * .8));}
          var stg = [0, .25, .5, .75, 1];
          for (i = 0; i < 5; i++) {
            var s = stg[i], n = at(s), passed = lit >= s - .01 && on > .05, fl = Math.max(0, 1 - Math.abs(q - s) / .035) * pa;
            if (fl > 0) ring(x, n.x, n.y, 5 + (1 - fl) * 8, c('gl', fl * .5), 1);
            if (i === 4) {star4(x, n.x, n.y, passed ? 7 : 5.5); x.fillStyle = c(passed ? 'gl' : 'ink', passed ? .95 : .4); x.fill(); continue;}
            if (passed) {dot(x, n.x, n.y, 4.2, c('gl', .95)); x.beginPath(); x.moveTo(n.x - 1.8, n.y); x.lineTo(n.x - .4, n.y + 1.5); x.lineTo(n.x + 2, n.y - 1.6); x.strokeStyle = c('star', P.L ? .9 : .95); x.lineWidth = 1.1; x.stroke();}
            else {dot(x, n.x, n.y, 3.4, P.L ? 'rgba(245,241,235,1)' : 'rgba(0,20,31,1)'); ring(x, n.x, n.y, 3.4, c('ink', .45), 1);}
          }
          if (on > .05) {var hd = at(lit); ring(x, hd.x, hd.y, 8 + 1.5 * Math.sin(T * .006), c('gl', .6 * on), 1);}
        },
        /* 05 Risk Diversification — a concentrated cluster expands into a balanced, connected pool */
        pool: function (it, x, w, h, T) {
          var d = it.d, i, N = 9, cx = w / 2, cy = h / 2, S = Math.min(w * .34, h * .4), on = it.on;
          if (!d.lay) {var r = rng(it.seed * 17); d.n = []; for (i = 0; i < N; i++)d.n.push({r0: .1 + r() * .38, a: r() * TAU, sz: 1.6 + r() * 4, p: r() * TAU}); d.rot = 0; d.lay = 1;}
          d.rot += it.dtA * .00022;
          var ps = [], ms = 0;
          for (i = 0; i < N; i++) {
            var n = d.n[i], m = sm(on * 1.25 - i * .03); ms += m;
            var ax = cx + Math.cos(n.a + d.rot * 1.7) * n.r0 * S + Math.sin(T * .001 + n.p) * 2, ay = cy + Math.sin(n.a + d.rot * 1.7) * n.r0 * S * .8 + Math.cos(T * .0009 + n.p) * 2;
            var ia = i / N * TAU + d.rot - Math.PI / 2, bx = cx + Math.cos(ia) * S * .92, by = cy + Math.sin(ia) * S * .92;
            var X = lerp(ax, bx, m), Y = lerp(ay, by, m), dx = X - it.px, dy = Y - it.py, dl = Math.sqrt(dx * dx + dy * dy);
            if (dl < 46 && dl > 0) {var k = (1 - dl / 46) * 7 * on; X += dx / dl * k; Y += dy / dl * k;}
            ps.push({x: X, y: Y, s: lerp(n.sz, 3, m), m: m});
          }
          var mm = ms / N;
          x.setLineDash([2, 4]); ring(x, cx, cy, S * .92, c('ink', .05 + mm * .14), .8); x.setLineDash([]);
          x.beginPath(); for (i = 0; i < N; i++) {x.moveTo(cx, cy); x.lineTo(ps[i].x, ps[i].y);} x.strokeStyle = c(mm > .5 ? 'gl' : 'ink', .08 + mm * .12); x.lineWidth = .8; x.stroke();
          if (mm > .05) {x.beginPath(); for (i = 0; i < N; i++) {var A = ps[i], B = ps[(i + 1) % N]; x.moveTo(A.x, A.y); x.lineTo(B.x, B.y);} x.strokeStyle = c('gl', .35 * mm); x.lineWidth = 1; x.stroke();}
          for (i = 0; i < N; i++) {var q = ps[i]; dot(x, q.x, q.y, q.s, c(q.m > .6 ? 'gl' : 'ink', .35 + q.m * .55)); if (q.s > 3.5 && mm < .5) ring(x, q.x, q.y, q.s + 3, c('ink', .12 * (1 - mm)), .8);}
          x.globalCompositeOperation = P.add; glow(x, cx, cy, S * .6, 'gl', .05 + .14 * mm); x.globalCompositeOperation = 'source-over';
          ring(x, cx, cy, 4 + 6 * mm, c('gl', .4 + .4 * mm), 1); dot(x, cx, cy, 2 + 2 * mm, c('gl', .8));
        },
        /* 06 Local Risk Distribution — the hub distributes locally; reliance on the external link fades */
        network: function (it, x, w, h, T) {
          var d = it.d, i, cx = w * .47, cy = h * .56, S = Math.min(w * .38, h * .4), on = it.on;
          if (!d.lay) {
            var r = rng(it.seed * 19); d.n = []; for (i = 0; i < 7; i++) {var a = i / 7 * TAU + (r() - .5) * .45; var rr = S * (.55 + r() * .45); d.n.push({bx: Math.cos(a) * rr, by: Math.sin(a) * rr * .82, p: r() * TAU, fl: 0});}
            d.pl = []; d.sp = 0; d.r = r; d.ex = {x: w * .9, y: h * .13}; d.lay = 1;
          }
          var ns = d.n.map(function (n) {return {x: cx + n.bx + Math.sin(T * .0008 + n.p) * 2.5, y: cy + n.by + Math.cos(T * .0007 + n.p) * 2.5, n: n};});
          var ext = d.ex, ea = 1 - .82 * on;
          x.setLineDash([3, 4]); line(x, cx, cy, ext.x, ext.y, c('ink', .28 * ea), 1); x.setLineDash([]);
          ring(x, ext.x, ext.y, 6, c('ink', .35 * ea), 1); ring(x, ext.x, ext.y, 10, c('ink', .12 * ea), .8);
          if (!reduce) {var eq = (T * .0004) % 1; dot(x, lerp(ext.x, cx, eq), lerp(ext.y, cy, eq), 1.6, c('sky', .6 * ea * (1 - on)));}
          if (on > .03) {x.beginPath(); for (i = 0; i < ns.length; i++) {var A = ns[i], B = ns[(i + 1) % ns.length]; x.moveTo(A.x, A.y); x.lineTo(B.x, B.y);} x.strokeStyle = c('gl', .25 * on); x.lineWidth = .9; x.stroke();}
          for (i = 0; i < ns.length; i++) {var q = ns[i], pk = prox(it, q.x, q.y, S * .5); q.pk = pk; line(x, cx, cy, q.x, q.y, pk > .15 ? c('gl', .18 + pk * .5) : c('ink', .14 + on * .06), 1 + pk * 1.4);}
          d.sp -= it.dtA;
          if (d.sp <= 0 && !reduce) {
            d.sp = lerp(950, 240, on); var k = Math.floor(d.r() * ns.length);
            if (on > .2) {var tot = 0, ws = ns.map(function (q) {var v = .15 + q.pk * 5; tot += v; return v;}), pick = d.r() * tot; for (k = 0; k < ws.length; k++) {pick -= ws[k]; if (pick <= 0) break;} k = Math.min(k, ns.length - 1);}
            d.pl.push({k: k, s: 0});
          }
          x.globalCompositeOperation = P.add;
          for (i = d.pl.length - 1; i >= 0; i--) {
            var p = d.pl[i]; p.s += it.dtA * .0013;
            if (p.s >= 1) {d.n[p.k].fl = 1; d.pl.splice(i, 1); continue;}
            var tq = ns[p.k], e = sm(p.s); dot(x, lerp(cx, tq.x, e), lerp(cy, tq.y, e), 2, c('gl', .9)); glow(x, lerp(cx, tq.x, e), lerp(cy, tq.y, e), 8, 'gl', .25);
          }
          x.globalCompositeOperation = 'source-over';
          for (i = 0; i < ns.length; i++) {
            var q2 = ns[i], n = q2.n; n.fl = Math.max(0, n.fl - it.dt * .0016);
            if (n.fl > 0) ring(x, q2.x, q2.y, 3 + (1 - n.fl) * 10, c('gl', n.fl * .55), 1);
            dot(x, q2.x, q2.y, 2.6 + n.fl * 1.4 + q2.pk * 1.2, c(n.fl > .1 || q2.pk > .3 ? 'gl' : 'ink', .5 + n.fl * .5));
          }
          x.globalCompositeOperation = P.add; glow(x, cx, cy, 22, 'gl', .12 + .2 * on); x.globalCompositeOperation = 'source-over';
          star4(x, cx, cy, 6 + 2 * on); x.fillStyle = c('gl', .95); x.fill();
        },
        /* 07 Operational Efficiency — fixed, misaligned blocks align into a variable, efficient structure */
        align: function (it, x, w, h, T) {
          var d = it.d, i, N = 7, on = it.on;
          if (!d.lay) {var r = rng(it.seed * 23); d.b = []; for (i = 0; i < N; i++)d.b.push({h0: .35 + r() * .5, yo: (r() - .3) * 1.6, r: (r() - .5) * .5, p: r() * TAU}); d.lay = 1;}
          var x0 = w * .14, x1 = w * .86, slot = (x1 - x0) / N, bw = slot * .48, base = h * .84, mx = h * .64;
          var vx = cl((it.px - x0) / (x1 - x0), 0, 1); if (isRTL()) vx = 1 - vx;
          var fy = base - mx * .62, ms = 0, tops = [];
          for (i = 0; i < N; i++) {
            var b = d.b[i], m = sm(on * 1.3 - i * .05); ms += m;
            var Ha = mx * b.h0, ya = base - Ha / 2 - b.yo * h * .1 + Math.sin(T * .0011 + b.p) * 3.5, ra = b.r + Math.sin(T * .0007 + b.p) * .05;
            var Hb = mx * (.16 + .84 * (.2 + .8 * vx)) * (.32 + .68 * (i + 1) / N);
            var H = lerp(Ha, Hb, m), Y = lerp(ya, base - H / 2, m), Rr = lerp(ra, 0, m), X = x0 + slot * (i + .5);
            x.save(); x.translate(X, Y); x.rotate(Rr);
            x.fillStyle = c('gl', .05 + .22 * m * (.4 + .6 * i / N)); x.fillRect(-bw / 2, -H / 2, bw, H);
            x.strokeStyle = c(m > .5 ? 'gl' : 'ink', .28 + .35 * m); x.lineWidth = 1; x.strokeRect(-bw / 2, -H / 2, bw, H);
            line(x, -bw / 2, -H / 2, bw / 2, -H / 2, c('gl', .4 + .5 * m), 1.4);
            x.restore(); tops.push({x: X, y: Y - H / 2});
          }
          var mm = ms / N;
          x.setLineDash([4, 4]); line(x, x0 - 6, fy, x1 + 6, fy, c('ink', .3 * (1 - mm)), 1); x.setLineDash([]);
          line(x, x0 - 8, base, x1 + 8, base, c(mm > .4 ? 'gl' : 'ink', .22 + .45 * mm), 1);
          if (mm > .2) {
            x.beginPath(); tops.forEach(function (t, k) {if (k) x.lineTo(t.x, t.y); else x.moveTo(t.x, t.y);}); x.strokeStyle = c('gl', .6 * sm((mm - .2) / .6)); x.lineWidth = 1; x.stroke();
            tops.forEach(function (t) {dot(x, t.x, t.y, 1.8, c('gl', .8 * mm));});
          }
        },
        /* 08 Economies of Scale — scattered points join into one unified network around a star */
        scale: function (it, x, w, h, T) {
          var d = it.d, i, j, N = 24, cx = w / 2, cy = h / 2, on = it.on, a = Math.min(h * .165, w * .11);
          if (!d.lay) {
            var r = rng(it.seed * 29); d.n = []; var lat = [];
            for (var q = -4; q <= 4; q++)for (var s = -4; s <= 4; s++) {if (!q && !s) continue; var lx = a * (q + s * .5), ly = a * s * .866; lat.push({x: lx, y: ly, d: lx * lx + ly * ly * 1.25});}
            lat.sort(function (A, B) {return A.d - B.d;});
            for (i = 0; i < N; i++)d.n.push({x: .06 + r() * .88, y: .1 + r() * .8, p: r() * TAU, q: r() * TAU, lx: lat[i].x, ly: lat[i].y}); d.lay = 1;
          }
          var m = sm(on * 1.15), ps = [];
          for (i = 0; i < N; i++) {
            var n = d.n[i], ax = n.x * w + Math.sin(T * .0005 + n.p) * 9, ay = n.y * h + Math.cos(T * .0004 + n.q) * 7;
            var X = lerp(ax, cx + n.lx, m * .92), Y = lerp(ay, cy + n.ly, m * .92); ps.push({x: X, y: Y, pk: prox(it, X, Y, a * 1.6)});
          }
          var thr = lerp(a * .95, a * 1.18, m);
          x.lineWidth = .9;
          for (i = 0; i < N; i++)for (j = i + 1; j < N; j++) {
            var A = ps[i], B = ps[j], dd = Math.hypot(A.x - B.x, A.y - B.y);
            if (dd < thr) {var al = (1 - dd / thr) * (.16 + .4 * m) + (A.pk + B.pk) * .2; line(x, A.x, A.y, B.x, B.y, c(m > .3 ? 'gl' : 'ink', al), .9);}
          }
          var sa = sm((on - .55) / .35);
          if (sa > 0) {
            for (i = 0; i < 6; i++)line(x, cx, cy, ps[i].x, ps[i].y, c('gl', .4 * sa), .9);
            x.globalCompositeOperation = P.add; glow(x, cx, cy, a * 1.4, 'gl', .25 * sa); x.globalCompositeOperation = 'source-over';
            star4(x, cx, cy, 7 * sa + 1); x.fillStyle = c('star', .95 * sa); x.fill();
          }
          for (i = 0; i < N; i++) {var q2 = ps[i]; dot(x, q2.x, q2.y, 1.6 + m * .7 + q2.pk, c(m > .4 || q2.pk > .2 ? 'gl' : 'ink', .45 + m * .4 + q2.pk * .3));}
        }
      };

      tiles.forEach(function (el) {
        var cv = el.querySelector('.role-cv'), fn = R8[el.getAttribute('data-k')];
        if (cv && fn) add(el, cv, fn, {act: 1});
      });

      pal(); kick();
    })();
    /* WR:END */
  

   host.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=host.querySelector(a.getAttribute('href'));if(target){e.preventDefault();target.scrollIntoView({behavior:window.SkyMotion.enabled()?'smooth':'instant'});}}));
   if(host.classList.contains('is-loading')){
     nativeDoc.body.classList.add('benchmark-loading');
     const loadingObserver=new MutationObserver(()=>{if(host.classList.contains('ready')){nativeDoc.body.classList.remove('benchmark-loading');loadingObserver.disconnect();}});
     loadingObserver.observe(host,{attributes:true,attributeFilter:['class']});
   }
   if(!window.SkyMotion.enabled()&&!reduce)window.requestAnimationFrame(()=>{if(!disposed)setMotion(false);});
 }
 return {render,init,clean,setMotion:on=>current?.setMotion(on),replayIntro:()=>{introShown=false;}};
})();
