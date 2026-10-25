(function(){
  const box=document.getElementById('character');
  const frame=box.querySelector('.rendered-frame');
  const image=frame.querySelector('img');
  const portrait=document.querySelector('.portrait');
  const actions=document.getElementById('character-actions');
  const status=document.getElementById('character-status');
  const pause=document.getElementById('character-pause');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let paused=motion.matches,x=0,y=0,drag=null,moved=false,greeting=null;
  function tilt(){frame.style.transform='perspective(1400px) rotateX('+(-y*2)+'deg) rotateY('+(x*4)+'deg)';}
  function updatePause(){
    pause.setAttribute('aria-pressed',String(paused));
    pause.textContent=paused?'Resume motion':'Pause motion';
    image.style.animationPlayState=paused?'paused':'running';
    if(paused&&greeting)greeting.cancel();
  }
  function greet(){
    status.textContent='Namaste! Thanks for stopping by.';
    if(paused)return;
    if(greeting)greeting.cancel();
    greeting=image.animate([
      {transform:'translateY(0) rotate(0deg)'},
      {transform:'translateY(8px) rotate(3deg)',offset:.35},
      {transform:'translateY(-3px) rotate(-1deg)',offset:.7},
      {transform:'translateY(0) rotate(0deg)'}
    ],{duration:900,easing:'ease-in-out'});
  }
  box.hidden=false;portrait.hidden=true;actions.hidden=false;
  status.textContent='Move to tilt · Tap to greet';updatePause();
  document.getElementById('character-greet').addEventListener('click',greet);
  pause.addEventListener('click',()=>{paused=!paused;updatePause();});
  motion.addEventListener('change',event=>{paused=event.matches;updatePause();});
  document.querySelectorAll('[data-portrait]').forEach(button=>button.addEventListener('click',()=>{
    const avatar=button.dataset.portrait==='avatar';
    box.hidden=!avatar;actions.hidden=!avatar;portrait.hidden=avatar;
    image.style.animationPlayState=avatar&&!paused?'running':'paused';
  }));
  box.addEventListener('pointermove',event=>{
    const r=box.getBoundingClientRect();
    x=Math.max(-1,Math.min(1,(event.clientX-r.left)/r.width*2-1));
    y=Math.max(-1,Math.min(1,(event.clientY-r.top)/r.height*2-1));
    if(drag)moved=moved||Math.abs(event.clientX-drag.x)>5||Math.abs(event.clientY-drag.y)>5;
    tilt();
  });
  box.addEventListener('pointerleave',()=>{x=y=0;tilt();});
  box.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;
    drag={id:event.pointerId,x:event.clientX,y:event.clientY};moved=false;
    box.setPointerCapture(event.pointerId);
  });
  box.addEventListener('pointerup',event=>{
    if(!drag||drag.id!==event.pointerId)return;
    drag=null;if(!moved)greet();
  });
  box.addEventListener('pointercancel',()=>{drag=null;});
  box.addEventListener('lostpointercapture',()=>{drag=null;});
  box.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
      event.preventDefault();x=Math.max(-1,Math.min(1,x+(event.key==='ArrowLeft'?-.2:.2)));tilt();
    }else if(event.key==='Enter'||event.key===' '){event.preventDefault();greet();}
    else if(event.key==='Home'){event.preventDefault();x=y=0;tilt();}
  });
  document.addEventListener('visibilitychange',()=>{
    image.style.animationPlayState=!document.hidden&&!paused&&!box.hidden?'running':'paused';
  });
})();
