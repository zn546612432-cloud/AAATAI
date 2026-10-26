import {releaseVelocity} from './pager.js';
export function classifyGesture({dx,dy,home,locked,shade,top}){if(Math.max(Math.abs(dx),Math.abs(dy))<9)return null;if(shade&&Math.abs(dy)>Math.abs(dx))return 'shade';if(locked&&top&&dy>0&&Math.abs(dy)>Math.abs(dx))return 'shade';if(locked)return dy<0&&Math.abs(dy)>Math.abs(dx)?'unlock':null;if(home&&Math.abs(dx)>Math.abs(dy)*1.15)return 'pages';if((home||top)&&dy>0&&Math.abs(dy)>Math.abs(dx))return 'shade';return null;}
export function mountGestures(root,{state,page,shade,unlock}){
 let drag=null,suppress=false;
 root.addEventListener('pointerdown',e=>{if(!e.isPrimary||e.button!==0||e.target.closest('input,textarea,select,[data-drag-message],.composer,.passcode-panel'))return;const s=state(),rect=root.getBoundingClientRect();drag={x:e.clientX,y:e.clientY,mode:null,id:e.pointerId,...s,top:e.clientY-rect.top<115,page:s.page,samples:[{x:e.clientX,t:e.timeStamp}]};});
 root.addEventListener('pointermove',e=>{
  if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  drag.samples.push({x:e.clientX,t:e.timeStamp});if(drag.samples.length>12)drag.samples.shift();
  if(!drag.mode)drag.mode=classifyGesture({dx,dy,...drag});if(!drag.mode)return;
  if(!root.hasPointerCapture(e.pointerId))root.setPointerCapture(e.pointerId);e.preventDefault();suppress=true;
  if(drag.mode==='pages')page({dx,index:drag.page,settle:false});
  if(drag.mode==='shade')shade({progress:Math.max(0,Math.min(1,(drag.shade?1:0)+dy/root.clientHeight)),settle:false});
  if(drag.mode==='unlock'){const cover=root.querySelector('.lock-screen');if(cover){cover.style.transform=`translateY(${Math.max(-160,dy*.55)}px)`;cover.style.opacity=String(Math.max(.25,1+dy/450));}}
 },{passive:false});
 const finish=(e,cancel=false)=>{if(!drag||drag.id!==e.pointerId)return;const g=drag;drag=null;const dx=e.clientX-g.x,dy=e.clientY-g.y;if(root.hasPointerCapture(e.pointerId))root.releasePointerCapture(e.pointerId);
  if(g.mode==='pages')page({dx,velocity:cancel?0:releaseVelocity(g.samples,e.timeStamp),index:g.page,cancel,settle:true});
  if(g.mode==='shade')shade({progress:cancel?Number(g.shade):g.shade?Number(dy> -70):Number(dy>70),settle:true});
  if(g.mode==='unlock'){if(!cancel&&dy< -60)unlock();else{const cover=root.querySelector('.lock-screen');if(cover){cover.style.transform='';cover.style.opacity='';}}}
  if(suppress)setTimeout(()=>suppress=false,0);
 };
 root.addEventListener('pointerup',e=>finish(e));root.addEventListener('pointercancel',e=>finish(e,true));
 // If the browser takes the pointer away mid-drag, settle instead of leaving the pager frozen.
 root.addEventListener('lostpointercapture',e=>finish(e,true));
 root.addEventListener('click',e=>{if(suppress){e.preventDefault();e.stopImmediatePropagation();}},{capture:true});
}
