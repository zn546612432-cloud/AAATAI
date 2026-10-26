import {uid} from '../services/id.js';
import {datePreset,messageDate,messageClock,setMessageDate} from '../services/messaging/timestamps.js';
import {dateParts,dateLabel,setPreviewDate} from '../services/calendar.js';
import {btn,card,demo,empty,esc} from '../system/ui.js';
import {conversations as allConversations,selectedConversation,actors,actorName,renameConversation,renameActor,setSchedule,newMessage,reorderMessage,moveMessageTo,clearDelivery,scheduleLabel,createConversation,chatApps,isGroup} from './conversations/model.js';
export const manifest={id:'editor',name:'内容编辑器',glyph:'✎',tone:'#65798c',hidden:true,defaultRoute:'/',kicker:'DEVELOPER / LOCAL DRAFT'};
const tabs=[['conversations','对话'],['assets','图片'],['preview','预览']];
const attr=v=>esc(v);
function nav(route){return `<div class="editor-tabs">${tabs.map(([id,name])=>btn('editor-tab',name,route===id?'active':'',`data-tab="${id}"`)).join('')}</div>`;}
function messageCard(m,c,s,index){
 const mode=m.schedule?.mode||'immediate',options=actors(c),key=attr(m.id),sentPreset=datePreset(m,s);
 return `<article class="edit-message" data-message-id="${key}"><div class="edit-message-head"><button type="button" class="drag-message" data-drag-message="${key}" aria-label="拖动第 ${index+1} 条消息排序" title="按住拖动；也可使用下方上移和下移">⠿</button><span class="edit-number">${String(index+1).padStart(2,'0')}</span><span class="edit-kind">${m.kind==='image'?'图片':m.kind==='app_invitation'?'棋局邀请':'文字'} ${m.demo?demo():''}</span>${btn('duplicate-message','复制','text-button',`data-id="${key}"`)}${btn('delete-message','删除','text-button danger',`data-id="${key}"`)}</div><div class="editor-field-pair"><label>谁说这句话<select data-message-field="from" data-id="${key}" aria-label="第 ${index+1} 条发言人">${options.map(a=>`<option value="${attr(a.id)}" ${m.from===a.id?'selected':''}>${esc(a.name)}${a.id==='me'?'（我方）':''}</option>`).join('')}</select></label><label>发送时间<input type="time" data-message-field="time" data-id="${key}" value="${attr(messageClock(m,s)||s.clock)}" aria-label="第 ${index+1} 条显示时间"></label></div><div class="editor-field-pair"><label>发送日期<select data-sent-date="${key}" aria-label="第 ${index+1} 条发送日期">${[['today','今天'],['yesterday','昨天'],['before-yesterday','前天'],['custom','指定日期']].map(([id,label])=>`<option value="${id}" ${sentPreset===id?'selected':''}>${label}</option>`).join('')}</select></label>${sentPreset==='custom'?`<label>具体日期<input type="date" data-message-field="sentDate" data-id="${key}" value="${messageDate(m,s)}" aria-label="第 ${index+1} 条具体发送日期"></label>`:''}</div>${m.kind==='image'?`<img src="${attr(m.text)}" alt="消息图片">${btn('replace-message-image','替换图片','button-quiet',`data-id="${key}"`)}`:m.kind==='app_invitation'?`<p>国际象棋邀请 · ${esc(m.invitationId)}</p>`:`<label class="editor-message-label">对话内容<textarea data-message-field="text" data-id="${key}" aria-label="第 ${index+1} 条对话内容">${esc(m.text)}</textarea></label>`}<div class="message-schedule"><div class="schedule-heading"><span>什么时候出现</span><span class="schedule-badge ${m.delivery?'delivered':''}">${esc(scheduleLabel(m))}</span></div><select data-schedule-field="mode" data-id="${key}" aria-label="第 ${index+1} 条出现条件"><option value="immediate" ${mode==='immediate'?'selected':''}>直接保留在聊天记录</option><option value="game-time" ${mode==='game-time'?'selected':''}>到指定游戏日与时间弹出</option><option value="chat-delay" ${mode==='chat-delay'?'selected':''}>打开这段对话后延迟弹出</option></select>${mode==='game-time'?`<div class="editor-field-pair"><label>游戏日<input type="number" min="1" max="90" data-schedule-field="day" data-id="${key}" value="${m.schedule.day}" aria-label="第 ${index+1} 条触发游戏日"></label><label>游戏时间<input type="time" data-schedule-field="clock" data-id="${key}" value="${attr(m.schedule.clock)}" aria-label="第 ${index+1} 条触发游戏时间"></label></div>`:mode==='chat-delay'?`<label>延迟秒数<input type="number" min="0" max="3600" step="0.1" data-schedule-field="seconds" data-id="${key}" value="${m.schedule.seconds}" aria-label="第 ${index+1} 条延迟秒数"></label>`:''}${mode!=='immediate'?`<div class="edit-order">${btn('test-message','▶ 预览弹出','text-button',`data-id="${key}"`)}${m.delivery?btn('rearm-message','重新等待触发','text-button',`data-id="${key}"`):''}</div>`:''}</div><div class="edit-order edit-order-footer">${btn('move-up','↑ 上移','text-button',`data-id="${key}" ${index===0?'disabled':''}`)}${btn('move-down','↓ 下移','text-button',`data-id="${key}" ${index===c.messages.length-1?'disabled':''}`)}<label>移到第 <input type="number" min="1" max="${c.messages.length}" value="${index+1}" data-order-message="${key}" aria-label="第 ${index+1} 条排序位置"> 条</label></div></article>`;
}
function newConversationForm(s){return `<details class="new-conversation"><summary>＋ 新建对话窗口</summary><form data-form="new-conversation"><label>聊天软件<select name="channel" aria-label="新对话聊天软件">${chatApps.map(([id,name])=>`<option value="${id}" ${(s.editor.channel||selectedConversation(s)?.channel)===id?'selected':''}>${name}</option>`).join('')}</select></label><label>窗口类型<select name="type" aria-label="新对话窗口类型"><option value="direct">私聊</option><option value="group">群聊</option></select></label><label>联系人或群聊名称<input name="name" placeholder="例如：Rookery 13 或周末计划" maxlength="60" aria-label="新对话名称" required></label><label>群聊成员<textarea name="members" placeholder="自动包含熙蒙；其余成员一行一人，私聊留空" aria-label="新群聊成员"></textarea></label><p class="editor-help">创建后会自动选中新窗口。可直接添加文字或图片，再点“预览整段对话”打开。所有修改保存在本机。</p><button class="button-primary wide" type="submit">创建并编辑</button></form></details>`;}
function conversations(s){
 const selected=selectedConversation(s);if(!selected)return `<div class="editor-panel">${newConversationForm(s)}${empty('暂无对话')}</div>`;
 const {c,channel}=selected,list=allConversations(s),pending=c.messages.filter(m=>m.schedule&&m.schedule.mode!=='immediate'&&!m.delivery).length;
 return `<div class="editor-panel">${newConversationForm(s)}<label>选择对话</label><select id="editor-conversation" aria-label="选择对话">${list.map(x=>`<option value="${attr(x.channel+':'+x.c.id)}" ${x.channel===channel&&x.c.id===c.id?'selected':''}>${esc({wechat:'微信',noapp:'NoApp',mirage:'MIRAGE',messages:'信息'}[x.channel]||x.channel)} / ${esc(x.c.name)}</option>`).join('')}</select><section class="editor-conversation-info"><label>联系人／群聊名称<input id="editor-conversation-name" value="${attr(c.name)}" maxlength="60" aria-label="联系人或群聊名称"></label><details class="editor-actors"><summary>编辑发言人名字 <span>${actors(c).length} 人</span></summary><div class="editor-actor-list">${actors(c).map(a=>`<label>${a.id==='me'?'我方':isGroup(c)?'群成员':'对方'}<input data-actor-name="${attr(a.id)}" value="${attr(a.name)}" maxlength="60" aria-label="${attr(a.name)}的显示名称"></label>`).join('')}</div></details><p class="editor-save-note">输入即时保存到本机。</p></section><div class="editor-list-heading"><strong>${c.messages.length} 条消息</strong><span>${pending} 条待触发</span></div><p class="editor-help">按住 ⠿ 拖动排序，手机也可操作。发送日期和几点发控制聊天里的时间标记；下方出现条件控制何时弹出，两者分开设置。定时按游戏日与游戏时间触发；在“预览”页调整时间。“预览弹出”会切到聊天，定时消息会同步调整本机游戏时间。</p><div class="editor-message-list">${c.messages.map((m,i)=>messageCard(m,c,s,i)).join('')}</div><div class="editor-add-actions">${btn('add-message','＋ 添加文字','button-primary')}${btn('add-image-message','＋ 添加图片','button-quiet')}</div>${btn('preview-chat','预览整段对话　↗','button-quiet wide')}<p class="editor-help">已弹出的消息会保留为记录；重新测试时可点“重新等待触发”。</p><div class="editor-drag-status" role="status" aria-live="polite"></div></div>`;
}
function assets(s){return `<div class="editor-panel">${card(`<strong>手机壁纸</strong><p>当前图片可从本机替换。</p>${btn('replace-wallpaper','更换壁纸','button-primary wide')}`)}<div class="section-heading">独立 App 图标</div><div class="surface-list">${Object.entries({wechat:'微信',noapp:'NoApp',chess:'国际象棋',mirage:'MIRAGE',photos:'照片',music:'音乐'}).map(([id,name])=>`<div class="list-row"><span class="list-copy"><strong>${name}</strong></span>${btn('replace-icon','替换','text-button',`data-id="${id}"`)}</div>`).join('')}</div><div class="section-heading">相册</div>${btn('add-photo','导入照片','button-primary wide')}</div>`;}
function preview(s){const d=dateParts(s);return `<div class="editor-panel">${card(`<span class="eyebrow">DATE PREVIEW</span><h2>${dateLabel(s)}</h2><p>手机显示正常日期。剧情进度只在这里调整，用于 App 开放与消息触发；预览日期不作为电影官方时间线。</p>`)}<form data-form="preview"><label>手机显示日期</label><input name="date" type="date" value="${d.iso}" aria-label="手机显示日期" required><label>游戏时间</label><input name="clock" type="time" value="${s.clock}" required><label>内部剧情进度（1–90，仅开发者可见）</label><input name="day" type="number" min="1" max="90" value="${s.day}" required><button class="button-primary wide" type="submit">应用预览</button></form>${btn('export-content','导出全部本机内容','button-quiet wide')}</div>`;}
export function render({store},loc){const s=store.get(),route=loc.route.slice(1)||'conversations';return `<div class="page-pad editor-page"><span class="eyebrow">LOCAL DRAFT ${demo()}</span><div class="large-title">内容编辑器</div>${nav(route)}${route==='assets'?assets(s):route==='preview'?preview(s):conversations(s)}</div>`;}
export function handle(a,t,ctx){
 const {store,router}=ctx,id=t.dataset.id;
 if(a==='editor-tab'){router.open({appId:'editor',route:'/'+t.dataset.tab});return;}
 if(a==='preview-chat'){const x=selectedConversation(store.get());if(x)router.open({appId:x.channel,route:'/chat/'+x.c.id});return;}
 if(a==='add-message')store.update(s=>{const {c}=selectedConversation(s);c.messages.push(newMessage(s,c));});
 if(a==='duplicate-message')store.update(s=>{const {c}=selectedConversation(s),i=c.messages.findIndex(m=>m.id===id);if(i<0)return;const m=structuredClone(c.messages[i]);m.id=uid();delete m.delivery;delete m.actual;m.authored=true;c.messages.splice(i+1,0,m);});
 if(a==='delete-message')store.update(s=>{const {c}=selectedConversation(s),m=c.messages.find(m=>m.id===id);if(m)clearDelivery(s,c,m);c.messages=c.messages.filter(m=>m.id!==id);});
 if(a==='move-up'||a==='move-down')store.update(s=>{const {c}=selectedConversation(s),i=c.messages.findIndex(m=>m.id===id);moveMessageTo(c,id,i+(a==='move-up'?-1:1));});
 if(a==='rearm-message')store.update(s=>{const {c}=selectedConversation(s),m=c.messages.find(m=>m.id===id);if(m)clearDelivery(s,c,m);});
 if(a==='test-message'){
  const x=selectedConversation(store.get());
  store.update(s=>{const {c}=selectedConversation(s),m=c.messages.find(m=>m.id===id);if(!m)return;clearDelivery(s,c,m);if(m.schedule?.mode==='game-time'){s.day=m.schedule.day;s.clock=m.schedule.clock;}if(x.channel==='noapp'&&s.day<56)s.day=56;});
  router.open({appId:x.channel,route:'/chat/'+x.c.id});return;
 }
 if(a==='add-image-message'||a==='replace-message-image'){
  const x=selectedConversation(store.get());
  ctx.pickImage(src=>store.update(s=>{const c=s.content.conversations[x.channel].find(c=>c.id===x.c.id);if(a==='add-image-message')c.messages.push({...newMessage(s,c,'image'),text:src});else {const m=c.messages.find(m=>m.id===id);if(m)m.text=src;}}));
 }
 if(a==='replace-wallpaper')ctx.pickImage(src=>store.update(s=>s.wallpaper=src));
 if(a==='replace-icon')ctx.pickImage(src=>store.update(s=>s.iconOverrides[id]=src));
 if(a==='add-photo')ctx.pickImage((src,name)=>store.update(s=>s.content.photos.push({id:uid(),title:name,src,actual:true})));
 if(a==='export-content')ctx.download();
}
export function change(t,ctx){
 const {store}=ctx;
 if(t.id==='editor-conversation'){const i=t.value.indexOf(':');store.update(s=>{s.editor.channel=t.value.slice(0,i);s.editor.conversation=t.value.slice(i+1);});return;}
 if(t.id==='editor-conversation-name')store.update(s=>renameConversation(selectedConversation(s).c,t.value));
 if(t.dataset.actorName)store.update(s=>renameActor(selectedConversation(s).c,t.dataset.actorName,t.value));
 if(t.dataset.messageField)store.update(s=>{const {c}=selectedConversation(s),m=c.messages.find(m=>m.id===t.dataset.id);if(!m)return;const field=t.dataset.messageField;if(field==='from'&&actors(c).some(a=>a.id===t.value))m.from=t.value;else if(field==='time')setMessageDate(m,s,{time:t.value});else if(field==='sentDate')setMessageDate(m,s,{date:t.value});else if(field==='text'&&(!m.kind||m.kind==='text'))m.text=t.value;});
 if(t.dataset.sentDate)store.update(s=>{const {c}=selectedConversation(s),m=c.messages.find(m=>m.id===t.dataset.sentDate);if(m)setMessageDate(m,s,{preset:t.value});});
 if(t.dataset.scheduleField)store.update(s=>{const {c}=selectedConversation(s),m=c.messages.find(m=>m.id===t.dataset.id);if(!m)return;const field=t.dataset.scheduleField,mode=field==='mode'?t.value:m.schedule?.mode;const input=field==='mode'?{mode}:{...m.schedule,[field]:t.value};setSchedule(s,c,m,input);});
 if(t.dataset.orderMessage){const value=Number(t.value);if(!Number.isInteger(value)||value<1)throw Error('排序位置需为正整数');store.update(s=>moveMessageTo(selectedConversation(s).c,t.dataset.orderMessage,value-1));}
}
export const isTextEdit=t=>t.id==='editor-conversation-name'||!!t.dataset.actorName||!!t.dataset.messageField&&['text','time','sentDate'].includes(t.dataset.messageField)||!!t.dataset.scheduleField&&t.dataset.scheduleField!=='mode';
export function input(t,ctx){
 if(!isTextEdit(t))return;
 if((t.dataset.scheduleField||['date','time'].includes(t.type))&&(!t.value||!t.checkValidity()))return;
 if((t.id==='editor-conversation-name'||t.dataset.actorName)&&!t.value.trim())return;
 change(t,ctx);
 const root=t.closest('.editor-panel');if(!root)return;
 const {c,channel}=selectedConversation(ctx.store.get());
 const edited=c.messages.find(m=>m.id===t.dataset.id),badge=t.closest('[data-message-id]')?.querySelector('.schedule-badge');if(edited&&badge){badge.textContent=scheduleLabel(edited);badge.classList.toggle('delivered',!!edited.delivery);}
 const people=new Map(actors(c).map(a=>[a.id,a.name]));
 const choice=root.querySelector('#editor-conversation');
 if(choice?.selectedOptions[0])choice.selectedOptions[0].textContent=({wechat:'微信',noapp:'NoApp',mirage:'MIRAGE',messages:'信息'}[channel]||channel)+' / '+c.name;
 root.querySelectorAll('select[data-message-field="from"]').forEach(select=>{for(const option of select.options)option.textContent=(people.get(option.value)||option.value)+(option.value==='me'?'（我方）':'');});
 root.querySelectorAll('[data-actor-name]').forEach(field=>{const name=people.get(field.dataset.actorName);if(name){field.setAttribute('aria-label',name+'的显示名称');if(field!==t)field.value=name;}});
 const title=root.querySelector('#editor-conversation-name');if(title&&title!==t)title.value=c.name;
}
export function submit(f,ctx){const {store,toast}=ctx,data=new FormData(f);if(f.dataset.form==='new-conversation'){createConversation(store,{channel:String(data.get('channel')),name:String(data.get('name')||''),type:String(data.get('type')),members:String(data.get('members')||'')});const pane=document.querySelector('#app-content');if(pane)pane.scrollTop=0;toast('对话窗口已创建，可以添加消息');}if(f.dataset.form==='preview'){store.update(s=>setPreviewDate(s,{day:Number(data.get('day')),clock:String(data.get('clock')),date:String(data.get('date'))}));toast('预览日期已更新');}}
export function mountInteractions(root,ctx){
 let drag=null;
 const cleanup=()=>{root.querySelectorAll('.drag-active,.drop-before,.drop-after').forEach(el=>el.classList.remove('drag-active','drop-before','drop-after'));root.classList.remove('editor-dragging');};
 root.addEventListener('pointerdown',e=>{
  const grip=e.target.closest('[data-drag-message]');if(!grip||!e.isPrimary||e.button!==0||ctx.store.get().nav.current.appId!=='editor')return;
  e.preventDefault();drag={id:grip.dataset.dragMessage,pointerId:e.pointerId,targetId:null,after:false};root.setPointerCapture(e.pointerId);grip.closest('[data-message-id]').classList.add('drag-active');root.classList.add('editor-dragging');
 });
 root.addEventListener('pointermove',e=>{
  if(!drag||e.pointerId!==drag.pointerId)return;e.preventDefault();
  const pane=root.querySelector('#app-content'),rect=pane?.getBoundingClientRect();
  if(rect){if(e.clientY<rect.top+55)pane.scrollTop-=18;else if(e.clientY>rect.bottom-55)pane.scrollTop+=18;}
  const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-message-id]');
  root.querySelectorAll('.drop-before,.drop-after').forEach(el=>el.classList.remove('drop-before','drop-after'));
  if(!target||target.dataset.messageId===drag.id){drag.targetId=null;return;}
  drag.targetId=target.dataset.messageId;const box=target.getBoundingClientRect();drag.after=e.clientY>box.top+box.height/2;target.classList.add(drag.after?'drop-after':'drop-before');
 });
 root.addEventListener('pointerup',e=>{
  if(!drag||e.pointerId!==drag.pointerId)return;
  const moved=drag;drag=null;if(root.hasPointerCapture(e.pointerId))root.releasePointerCapture(e.pointerId);cleanup();
  if(moved.targetId){ctx.store.update(s=>reorderMessage(selectedConversation(s).c,moved.id,moved.targetId,moved.after));const status=root.querySelector('.editor-drag-status');if(status)status.textContent='消息顺序已保存';}
 });
 root.addEventListener('pointercancel',()=>{drag=null;cleanup();});
}
