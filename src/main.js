import {PhoneStore} from './services/storage.js';
import {PhoneRouter} from './services/router.js';
import {registry} from './system/registry.js';
import {home,lock,appFrame,status,notifications,mountShell} from './system/shell.js';
import {LockScreen} from './system/lock.js';
import {toggleReminder} from './services/reminders.js';
import {processDemoReply} from './services/invitations.js';
import {MessageDelivery,isConversationOpen} from './services/messaging/delivery.js';
import {mountInteractions} from './editor/index.js';
import {patchHTML} from './system/dom.js';
import {mountGestures} from './system/gestures.js';
import {mountViewport} from './system/viewport.js';

const store=new PhoneStore(),router=new PhoneRouter(store,registry),lockscreen=new LockScreen();
mountShell();
let shade=false,toastTimer,assetHandler=null,entryAnimation=false,lastNavigation=null,quietEditorUpdate=false,draggingHome=false;
const delivery=new MessageDelivery(store);
// Opening the display always requires a new unlock, without removing saved content.
if(store.get().unlocked)store.update(s=>{s.unlocked=false;});
const $=q=>document.querySelector(q);
const toast=message=>{const el=$('#toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3200);};
const ctx=()=>({store,router,toast,refresh:render,pickImage(handler){assetHandler=handler;const input=$('#asset-picker');input.value='';input.click();},download(){const blob=new Blob([JSON.stringify(store.get(),null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='ximeng-phone-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}});
function setShade({progress,settle=true}){
 const layer=$('#shade-layer');layer.classList.toggle('is-present',progress>0);layer.classList.toggle('is-dragging',!settle);layer.style.setProperty('--shade-progress',String(progress));layer.setAttribute('aria-hidden',String(progress===0));layer.inert=progress===0;
 $('#screen-layer').inert=progress>0;$('#phone').classList.toggle('notification-open',progress>0);
 if(settle)shade=progress===1;
}
function animateNavigation(previous,direction=1){
 const layer=$('#transition-layer');layer.replaceChildren();
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const current=$('#screen-layer').firstElementChild;
 if(previous){previous.removeAttribute('id');previous.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));previous.inert=true;layer.append(previous);previous.querySelectorAll('[data-restore-scroll]').forEach(n=>{n.scrollTop=Number(n.dataset.restoreScroll);n.removeAttribute('data-restore-scroll');});previous.animate([{opacity:1,transform:'translateY(0) scale(1)'},{opacity:0,transform:`translateY(${-direction*8}px) scale(.99)`}],{duration:230,easing:'ease-out'}).finished.catch(()=>{}).finally(()=>previous.remove());}
 current?.animate([{opacity:0,transform:`translateY(${direction*14}px) scale(.985)`},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:270,easing:'cubic-bezier(.2,.75,.25,1)'});
}
function render(){
 if(draggingHome)return;
 const s=store.get(),current=s.nav.current,navigation=s.unlocked?JSON.stringify(current):'lock';
 const changed=lastNavigation!==null&&navigation!==lastNavigation,screen=$('#screen-layer'),previous=changed?screen.firstElementChild?.cloneNode(true):null;
 if(previous){const nodes=screen.firstElementChild.querySelectorAll('.app-content,.chat-messages');previous.querySelectorAll('.app-content,.chat-messages').forEach((node,i)=>node.dataset.restoreScroll=String(nodes[i].scrollTop));}
 const oldScroll=$('#screen-layer #app-content')?.scrollTop,actorsOpen=$('.editor-actors')?.open;
 const messagePane=$('#screen-layer .chat-messages'),nearBottom=!messagePane||messagePane.scrollHeight-messagePane.clientHeight-messagePane.scrollTop<85;
 const oldKeys=new Set([...screen.querySelectorAll('.message-row[data-key]')].map(el=>el.dataset.key));
 $('#phone').classList.toggle('is-locked',!s.unlocked);$('#phone').classList.toggle('show-passcode',!s.unlocked&&lockscreen.stage!=='cover');
 $('#phone').classList.toggle('app-light-active',s.unlocked&&current.appId!=='home'&&!['mirage','ghost','noapp'].includes(current.appId));
 const wallpaper=`url("${s.wallpaper}")`;if($('#wallpaper').style.backgroundImage!==wallpaper)$('#wallpaper').style.backgroundImage=wallpaper;
 patchHTML($('#status-layer'),status(s));patchHTML($('#shade-layer'),notifications(s));
 let body;
 if(!s.unlocked)body=lock(s,lockscreen.stage,lockscreen.digits);
 else if(current.appId==='home')body=home(s);
 else{const app=registry.get(current.appId);body=app?appFrame(s,app,app.render(ctx(),current)):'<div class="empty">App 不可用</div>';}
 patchHTML(screen,body);
 if(navigation===lastNavigation&&actorsOpen&&$('.editor-actors'))$('.editor-actors').open=true;
 if(changed&&s.unlocked)animateNavigation(previous);
 if(entryAnimation&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){screen.animate([{opacity:0,transform:'scale(1.08)'},{opacity:1,transform:'scale(1)'}],{duration:380,easing:'ease-out'});entryAnimation=false;}else if(entryAnimation)entryAnimation=false;
 if(navigation===lastNavigation&&oldScroll!==undefined&&$('#screen-layer #app-content'))$('#screen-layer #app-content').scrollTop=oldScroll;else router.restoreScroll();
 const nextPane=$('#screen-layer .chat-messages');
 if(nextPane){const added=[...nextPane.querySelectorAll('.message-row[data-key]')].filter(el=>!oldKeys.has(el.dataset.key));if(!changed&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)for(const row of added)row.animate([{opacity:0,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:180,easing:'ease-out'});if(changed||nearBottom)nextPane.scrollTop=nextPane.scrollHeight;}
 lastNavigation=navigation;
}
function requestUnlock(link=null){setShade({progress:0});lockscreen.open(link);render();}
function enterDigit(key){
  const result=lockscreen.key(key);
  if(result==='ignored')return;
  if(result==='cancelled'){render();return;}
  // Preserve the keypad node so typing does not replay its entrance animation.
  const dots=$('.passcode-dots');
  if(dots){dots.setAttribute('aria-label',`已输入 ${lockscreen.digits.length} 位密码`);dots.querySelectorAll('i').forEach((dot,i)=>dot.classList.toggle('filled',i<lockscreen.digits.length));}
  if(result==='error'){
    $('.lock-screen')?.classList.add('lock-error');toast('密码错误，请重试');
    setTimeout(()=>{lockscreen.retry();render();},420);
  }
  if(result==='unlocking'){
    $('.lock-screen')?.classList.add('lock-unlocking');
    setTimeout(()=>{
      const link=lockscreen.pendingLink;lockscreen.reset();setShade({progress:0});entryAnimation=true;
      store.update(s=>{s.unlocked=true;});
      if(link)router.open(link);
    },260);
  }
}
store.subscribe(()=>{if(!quietEditorUpdate)render();});render();
mountInteractions($('#root'),ctx());
setInterval(()=>{try{const delivered=delivery.tick(Date.now(),!document.hidden);if(delivered.length&&store.get().unlocked){const incoming=delivered.find(m=>m.from!=='me'&&!isConversationOpen(store.get(),m.channel,m.conversationId));if(incoming)toast(`${incoming.title}：${incoming.body}`);}}catch(err){toast(err.message||'消息未能保存');}},500);
$('#root').addEventListener('click',async e=>{
  const target=e.target.closest('[data-action]');if(!target)return;
  const action=target.dataset.action;
  try{
    if(!store.get().unlocked){
      if(action==='close-shade'){setShade({progress:0});return;}
      if(action==='unlock'||action==='home'){if(lockscreen.stage==='cover')requestUnlock();return;}
      if(action==='passcode-key'){enterDigit(target.dataset.key);return;}
      if(action==='notification'){const n=store.get().notifications.find(x=>x.id===target.dataset.id);requestUnlock(n?.link||null);return;}
      return;
    }
    if(action==='home'){router.home();return;}
    if(action==='back'){router.back();return;}
    if(action==='open-app'){const id=target.dataset.app,m=registry.get(id)?.manifest;if(!m||m.unlockDay&&store.get().day<m.unlockDay)return toast('此 App 尚未开放');router.open({appId:id,route:m.defaultRoute||'/'});return;}
    if(action==='home-reminder-toggle'){toggleReminder(store,target.dataset.id);return;}
    if(action==='page'){store.update(s=>{s.homePage=Number(target.dataset.page);});return;}
    if(action==='lock'){lockscreen.reset();shade=false;store.update(s=>{s.unlocked=false;s.nav.current={appId:'home',route:'/',params:{}};s.nav.stack=[];});return;}
    if(action==='notify'||action==='island'){setShade({progress:shade?0:1});return;}
    if(action==='close-shade'){setShade({progress:0});return;}
    if(action==='notification'){const n=store.get().notifications.find(x=>x.id===target.dataset.id);if(!n)return;setShade({progress:0});router.open(n.link);return;}
    const app=registry.get(store.get().nav.current.appId);
    if(app?.handle)await app.handle(action,target,ctx(),store.get().nav.current);
  }catch(err){toast(err.message||'操作未完成');}
});
$('#root').addEventListener('submit',e=>{if(!store.get().unlocked){e.preventDefault();return;}const app=registry.get(store.get().nav.current.appId);if(!app?.submit)return;e.preventDefault();try{app.submit(e.target,ctx(),store.get().nav.current);}catch(err){toast(err.message);}});
$('#root').addEventListener('input',e=>{if(!store.get().unlocked)return;if(e.target.matches('.composer input[name="text"]')){try{quietEditorUpdate=true;store.update(s=>{s.drafts[e.target.form.dataset.id]=e.target.value;});}finally{quietEditorUpdate=false;}return;}const app=registry.get(store.get().nav.current.appId);if(!app?.input)return;try{quietEditorUpdate=true;app.input(e.target,ctx());}catch(err){toast(err.message);}finally{quietEditorUpdate=false;}});
$('#root').addEventListener('change',e=>{if(!store.get().unlocked)return;const app=registry.get(store.get().nav.current.appId);if(app?.change)try{quietEditorUpdate=!!app.isTextEdit?.(e.target);app.change(e.target,ctx(),store.get().nav.current);}catch(err){toast(err.message);}finally{quietEditorUpdate=false;}});
$('#asset-picker').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file||!assetHandler)return;try{if(!/^image\/(png|jpeg|webp)$/.test(file.type)||file.size>15_000_000)throw Error('请选择小于 15MB 的 PNG、JPEG 或 WebP');const bitmap=await createImageBitmap(file),scale=Math.min(1,1200/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();assetHandler(canvas.toDataURL('image/jpeg',.82),file.name);toast('图片已保存到本机');}catch(err){toast(err.message);}assetHandler=null;});
mountViewport($('#phone'));
setShade({progress:0});
mountGestures($('#phone'),{
 state:()=>({home:store.get().unlocked&&store.get().nav.current.appId==='home',locked:!store.get().unlocked,shade,page:store.get().homePage||0}),
 page:({dx,index,settle})=>{const track=$('#screen-layer .home-track');if(!track)return;if(settle){draggingHome=false;track.style.transition='';store.update(s=>{s.homePage=index;});}else{draggingHome=true;const distance=(index===0&&dx>0||index===2&&dx<0)?dx*.25:dx;track.style.transition='none';track.style.transform=`translate3d(calc(${-index*100}% + ${distance}px),0,0)`;}},
 shade:setShade,
 unlock:()=>{if(lockscreen.stage==='cover')requestUnlock();}
});
document.addEventListener('keydown',e=>{
  if(!store.get().unlocked){
    if(lockscreen.stage==='cover'&&['ArrowUp','Enter',' '].includes(e.key)){e.preventDefault();requestUnlock();}
    else if(/^\d$/.test(e.key)||['Backspace','Escape'].includes(e.key)){e.preventDefault();enterDigit(e.key==='Backspace'?'erase':e.key==='Escape'?'cancel':e.key);}
    return;
  }
  if(e.key==='Escape'&&!e.target.closest('input,textarea,select'))shade?setShade({progress:0}):router.back();
});
// A local deterministic preview reply, never a real AI or server presence event.
setTimeout(()=>{if(processDemoReply(store)&&store.get().unlocked)toast('国际象棋邀请收到演示回应');},2400);
