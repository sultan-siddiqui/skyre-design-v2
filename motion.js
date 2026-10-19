/* Local motion reference; timings and triggers map to Webflow interactions. */
window.SkyMotion=(()=>{
 const ease='cubic-bezier(.22,1,.36,1)',reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let observer,frame=0,media=[],paused=false;
 const enabled=()=>!reduce.matches&&!paused;
 function tween(el,frames,options={}){
  if(!el||!enabled())return Promise.resolve();
  return el.animate(frames,{duration:700,easing:ease,...options}).finished.catch(()=>{});
 }
 function clean(){observer?.disconnect();cancelAnimationFrame(frame);frame=0;media=[];document.querySelectorAll('#main [data-motion]').forEach(el=>el.getAnimations().forEach(a=>a.cancel()));}
 function init(){
  clean();window.SkyBenchmark?.setMotion(enabled());window.SkyCelestial?.setMotion(enabled());document.body.classList.toggle('motion-off',!enabled());
  document.querySelectorAll('#main .reveal').forEach(el=>el.classList.remove('reveal','is-visible'));
  document.querySelectorAll('#main .scroll-image').forEach(el=>{el.classList.remove('scroll-image');el.style.removeProperty('--image-y');});
  const title=document.querySelector('#main > .hero h1');
  if(title&&!title.querySelector('.display-line'))title.innerHTML=title.innerHTML.split('\n').map(line=>'<span class="display-line"><span>'+line+'</span></span>').join('');
  if(!enabled()){document.body.dataset.motion='reduced';return;}
  document.body.dataset.motion='active';
  document.querySelectorAll('.hero-copy .eyebrow,.hero-copy h1 .display-line>span,.hero-copy .intro,.hero-copy>.btn,.hero-actions .btn,.hero-copy>.team-jump').forEach((el,i)=>{el.dataset.motion='hero';tween(el,[{opacity:0,transform:'translateY(36px)'},{opacity:1,transform:'translateY(0)'}],{duration:850,delay:80+i*100});});
  document.querySelectorAll('.hero-photo-media,.hero-photo:not(.home-hero-photo),.team-hero-portraits .portrait-trigger').forEach((el,i)=>{el.dataset.motion='hero-image';tween(el,[{opacity:0,transform:'translateY(48px)'},{opacity:1,transform:'translateY(0)'}],{duration:1100,delay:180+i*180});});
  observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   const el=entry.target;el.classList.add('is-visible');el.dataset.motionState='revealed';observer.unobserve(el);
  }),{threshold:.08,rootMargin:'0px 0px -5% 0px'});
  const selectors='.brand-intro-copy,.brand-intro-art,.bridge-visual,.principle,.section-head,.split-copy,.split-image,.list-heading,.list-item,.process-item,.fact,.article>h2,.article>blockquote,.statement-copy,.video-heading,.video-poster,.cta-copy,.cta .btn,.card:not(.slider-track>.card),.slider';
  document.querySelectorAll('#main '+selectors.split(',').join(',#main ')).forEach(el=>{
   if(el.closest('.benchmark'))return;el.classList.add('reveal');el.dataset.motion='scroll-reveal';
   const index=el.matches('.card,.process-item,.fact')?[...el.parentElement.children].indexOf(el):0;
   el.style.setProperty('--reveal-delay',Math.min(index,3)*110+'ms');observer.observe(el);
  });
  media=[...document.querySelectorAll('.hero-photo>img:not(.hero-crescent),.hero-photo-media>img,.split-image img')];media.forEach(el=>el.classList.add('scroll-image'));updateScroll();
 }
 function updateScroll(){
  frame=0;const height=innerHeight,max=document.documentElement.scrollHeight-height;
  document.documentElement.style.setProperty('--scroll-progress',max>0?Math.min(1,scrollY/max):0);
  document.body.classList.toggle('is-scrolled',scrollY>40);
  if(!enabled()||document.querySelector('#canvas').clientWidth<900)return;
  media.forEach(el=>{const box=el.parentElement.getBoundingClientRect();if(box.bottom<0||box.top>height)return;const progress=(height/2-(box.top+box.height/2))/(height+box.height);el.style.setProperty('--image-y',Math.max(-22,Math.min(22,progress*70))+'px');});
 }
 addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(updateScroll);},{passive:true});
 addEventListener('resize',()=>{if(document.querySelector('#canvas')?.clientWidth<900)media.forEach(el=>el.style.setProperty('--image-y','0px'));updateScroll();});
 reduce.addEventListener('change',()=>{document.getAnimations().forEach(a=>a.cancel());init();});
 function dialog(el,closing=false){
  el.getAnimations().forEach(a=>a.cancel());
  return tween(el,closing?[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(24px)'}]:[{opacity:0,transform:el.classList.contains('profile-dialog')?'translateX(72px)':'translateY(28px)'},{opacity:1,transform:'translate(0)'}],{duration:closing?220:550});
 }
 function details(el){return tween(el,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:440});}
 function replay(){init();}
 function toggle(){paused=!paused;document.getAnimations().forEach(a=>a.cancel());init();return paused;}
 return {init,dialog,details,replay,toggle,enabled};
})();
