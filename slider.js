/* Dependency-free Collection List adapter; static version maps to Webflow Slider. */
window.SkySliders=(()=>{
 let observers=[];
 function clean(){observers.forEach(o=>o.disconnect());observers=[];}
 function init(){
  clean();document.querySelectorAll('.slider').forEach(slider=>{
   const mask=slider.querySelector('.slider-mask'),track=slider.querySelector('.slider-track'),prev=slider.querySelector('[data-slide-prev]'),next=slider.querySelector('[data-slide-next]'),dots=slider.querySelector('.slider-pagination'),status=slider.querySelector('.slider-status');
   let items=[],visible=1,current=0,pageCount=0,timer;
   const label=slider.getAttribute('aria-label');
   function update(){
    if(!items.length)return;
    const step=items[0].getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap);
    current=Math.max(0,Math.min(items.length-visible,Math.round(mask.scrollLeft/step)));
    const page=Math.min(pageCount-1,Math.ceil(current/visible));
    prev.disabled=current===0;next.disabled=current>=items.length-visible;
    status.textContent=String(current+1).padStart(2,'0')+'–'+String(Math.min(current+visible,items.length)).padStart(2,'0')+' / '+String(items.length).padStart(2,'0');
    status.setAttribute('aria-label',label+': items '+(current+1)+' to '+Math.min(current+visible,items.length)+' of '+items.length);
    [...dots.children].forEach((d,i)=>d.setAttribute('aria-current',String(i===page)));
    items.forEach((item,i)=>{item.inert=i<current||i>=current+visible;item.setAttribute('aria-label',(i+1)+' of '+items.length);});
   }
   function move(index,smooth=true){if(!items.length)return;const target=items[Math.max(0,Math.min(items.length-visible,index))];mask.scrollTo({left:target.offsetLeft-track.offsetLeft,behavior:smooth&&window.SkyMotion?.enabled()?'smooth':'instant'});if(!smooth)update();}
   function refresh(){
    items=[...track.querySelectorAll('.card:not([hidden])')];visible=Math.max(1,Math.min(items.length,parseInt(getComputedStyle(slider).getPropertyValue('--visible'))||1));current=0;pageCount=Math.ceil(items.length/visible);dots.replaceChildren();
    for(let i=0;i<pageCount;i++){const dot=document.createElement('button');dot.className='slider-dot';dot.setAttribute('aria-label',label+': slide group '+(i+1)+' of '+pageCount);dot.onclick=()=>move(i*visible);dots.appendChild(dot);}
    slider.querySelector('.slider-controls').hidden=items.length===0;mask.hidden=items.length===0;
    if(items.length)move(0,false);
   }
   prev.onclick=()=>move(current-visible);next.onclick=()=>move(current+visible);
   mask.onkeydown=e=>{if(e.target!==mask||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();move(e.key==='Home'?0:e.key==='End'?items.length-visible:current+(e.key==='ArrowRight'?visible:-visible));};
   mask.addEventListener('scroll',()=>{clearTimeout(timer);timer=setTimeout(update,100);},{passive:true});
   slider.refresh=refresh;const observer=new ResizeObserver(()=>refresh());observer.observe(mask);observers.push(observer);refresh();
  });
 }
 return {init,clean};
})();
