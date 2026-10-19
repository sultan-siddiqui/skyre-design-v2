/* Benchmark starfield shared by all 20 routes. Original depth, twinkle and pointer response retained. */
window.SkyCelestial=(()=>{
 const mq=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=false,frame=0,lastScroll=scrollY,scrollDistance=0,lastScrollShot=-2000;
 const enabled=()=>!mq.matches&&!paused;
 function kick(){if(!frame&&!document.hidden)frame=requestAnimationFrame(draw);}
/* ---------- Starfield ---------- */
      const cv = document.querySelector('#celestial-sky'), cx = cv.getContext('2d'); let W, H, DPR, stars = [], shoot = null;
      const TAU = 6.2832; let smx = -9999, smy = -9999;
      if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
        addEventListener('pointermove', e => {smx = e.clientX; smy = e.clientY}, {passive: true});
        document.addEventListener('mouseleave', () => {smx = smy = -9999});
      }
      function resize() {
        DPR = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = W * DPR; cv.height = H * DPR; cx.setTransform(DPR, 0, 0, DPR, 0, 0);
        const n = Math.round(W * H / 5200);
        stars = Array.from({length: n}, () => {
          const k = Math.random(), z = k < .6 ? 0 : k < .9 ? 1 : 2; /* depth layer: far / mid / near */
          return {
            x: Math.random() * W, y: Math.random() * H, ox: 0, oy: 0, z,
            r: z === 0 ? .2 + Math.random() * .35 : z === 1 ? .55 + Math.random() * .45 : 1 + Math.random() * .55,
            a: Math.random() * .55 + .2,
            w1: TAU / (14000 + Math.random() * 18000), p1: Math.random() * TAU,   /* slow breath 14–32s */
            w2: TAU / (5500 + Math.random() * 8500), p2: Math.random() * TAU,     /* gentle twinkle 5.5–14s */
            sp: (.0009 + z * .0008) * (.75 + Math.random() * .5),                  /* px per ms — near stars drift a touch faster */
            dj: (Math.random() - .5) * .0003, react: .45 + Math.random() * .55,
            g: Math.random() < .12, hl: 0, hide: false, vis: 1
          }
        })
      }
      resize(); addEventListener('resize',()=>{resize();kick();});
      let lastShoot = 0, lastT = 0;
      function draw(t) {
        frame=0; if(document.hidden)return;
        const dt = lastT ? Math.min(64, t - lastT) : 16; lastT = t;
        cx.clearRect(0, 0, W, H);
        const R = 210, R2 = R * R, isLight = false;
        for (const s of stars) {
          if (s.hide) continue;
          let a = s.a * (.5 + .28 * Math.sin(t * s.w1 + s.p1) + .22 * Math.sin(t * s.w2 + s.p2)), tx = 0, ty = 0, rr = s.r;
          if (enabled()) {
            s.x += (-.94 * s.sp) * dt; s.y += (-.34 * s.sp + s.dj) * dt;
            if (s.x < -4) s.x += W + 8; else if (s.x > W + 4) s.x -= W + 8;
            if (s.y < -4) s.y += H + 8; else if (s.y > H + 4) s.y -= H + 8;
            const dx = s.x - smx, dy = s.y - smy;
            if (dx < R && dx > -R && dy < R && dy > -R) {
              const d2 = dx * dx + dy * dy;
              if (d2 < R2 && d2 > .01) {const f = 1 - d2 / R2, f2 = f * f * s.react, d = Math.sqrt(d2); a += (1 - a) * .45 * f2; tx = dx / d * 5 * f2; ty = dy / d * 5 * f2}
            }
          }
          s.ox += (tx - s.ox) * .045; s.oy += (ty - s.oy) * .045;
          if (s.vis < 1) s.vis = Math.min(1, s.vis + dt / 4500);
          const x = s.x + s.ox, y = s.y + s.oy;
          if (s.hl > 0) {
            a += (1 - a) * s.hl; rr = s.r * (1 + s.hl * 1.6);
            const g = cx.createRadialGradient(x, y, 0, x, y, rr * 10); g.addColorStop(0, 'rgba(255,250,238,.85)'); g.addColorStop(.35, 'rgba(233,220,192,.25)'); g.addColorStop(1, 'rgba(233,220,192,0)');
            cx.globalAlpha = s.hl * .7; cx.fillStyle = g; cx.beginPath(); cx.arc(x, y, rr * 10, 0, TAU); cx.fill()
          }
          cx.globalAlpha = Math.max(0, a * s.vis * (isLight ? 1.6 : 1)); cx.fillStyle = isLight ? (s.g ? '#a08850' : '#8a9bb0') : (s.g ? '#e7d3a6' : '#dfe9f5'); cx.beginPath(); cx.arc(x, y, rr, 0, TAU); cx.fill();
        }
        if (enabled()) {
          if (!shoot && t - lastShoot > 7000 && Math.random() < .01) {shoot = {x: Math.random() * W * .7 + W * .15, y: Math.random() * H * .4, l: 0, v: 9 + Math.random() * 5}; lastShoot = t}
          cv.dataset.shooting=shoot?'true':'false';
          if (shoot) {shoot.l += shoot.v * dt / 16; const x = shoot.x + shoot.l, y = shoot.y + shoot.l * .45; const sC = false ? 'rgba(148,123,76,' : 'rgba(255,255,255,'; const g = cx.createLinearGradient(x, y, x - 120, y - 54); g.addColorStop(0, sC + '.9)'); g.addColorStop(1, sC + '0)'); cx.globalAlpha = Math.max(0, 1 - shoot.l / 600); cx.strokeStyle = g; cx.lineWidth = 1.2; cx.beginPath(); cx.moveTo(x, y); cx.lineTo(x - 120, y - 54); cx.stroke(); if (shoot.l > 600) shoot = null}
        }
        cx.globalAlpha = 1; if (enabled()) frame=requestAnimationFrame(draw);
      }
      frame=requestAnimationFrame(draw);

      
 addEventListener('scroll',()=>{
   const delta=Math.abs(scrollY-lastScroll);lastScroll=scrollY;
   if(!enabled()||scrollY<=0||document.body.classList.contains('benchmark-loading'))return;
   scrollDistance+=delta;const now=performance.now();
   if(scrollDistance>=70&&now-lastScrollShot>1400){
     if(!shoot){shoot={x:W*(.15+Math.random()*.5),y:H*(.08+Math.random()*.24),l:0,v:5};lastShoot=now;lastScrollShot=now;scrollDistance=0;}
   }
 },{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else{lastT=0;kick();}});
 mq.addEventListener('change',()=>{shoot=null;cancelAnimationFrame(frame);frame=0;kick();});
 return {setMotion(on){paused=!on;shoot=null;cv.dataset.shooting='false';cv.dataset.motion=enabled()?'active':'paused';cancelAnimationFrame(frame);frame=0;kick();},resetScroll(){lastScroll=0;scrollDistance=0;shoot=null;},get pointer(){return {x:smx,y:smy}}};
})();
