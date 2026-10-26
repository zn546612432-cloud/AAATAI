import {chatView,sendChat,attachChat} from '../../components/chat.js';
import {createConversation} from '../../editor/conversations/model.js';
import {renderWeChatHome,routeForTab} from './components/views.js';

export const manifest={id:'wechat',name:'微信',icon:0,defaultRoute:'/',supportsDeepLink:true,kicker:'MESSAGES'};
export const render=({store},location)=>location.route.startsWith('/chat/')
  ?chatView(store.get(),'wechat',location.route.slice(6))
  :renderWeChatHome(store.get(),location.route);

export function handle(action,target,ctx){
  if(action==='wx-tab'){
    const route=routeForTab(target.dataset.tab);
    if(ctx.store.get().nav.current.route!==route)ctx.store.update(s=>{s.nav.current.route=route;s.nav.current.params={};});
    return;
  }
  if(action==='wx-toggle-menu'){
    const menu=target.closest('.wx-screen')?.querySelector('.wx-action-menu');
    if(menu)menu.hidden=!menu.hidden;
    return;
  }
  if(action==='wx-open-entry'){
    ctx.toast((target.dataset.label||'此功能')+'：二级页面将在下一阶段接入');
    return;
  }
  if(action==='wx-open-contact'){
    const name=target.dataset.name||'';
    const existing=ctx.store.get().content.conversations.wechat?.find(c=>c.id===target.dataset.id||c.name===name);
    const id=existing?.id||createConversation(ctx.store,{channel:'wechat',name});
    ctx.router.open({appId:'wechat',route:'/chat/'+id});
    return;
  }
  if(action==='wx-open-groups'){
    const group=ctx.store.get().content.conversations.wechat?.find(c=>c.group||c.id==='group');
    if(group)ctx.router.open({appId:'wechat',route:'/chat/'+group.id});
    else ctx.toast('还没有群聊');
    return;
  }
  if(action==='wx-index'){
    const section=[...document.querySelectorAll('.wx-contact-section')].find(n=>n.dataset.wxSection===target.dataset.letter);
    section?.scrollIntoView({block:'start',behavior:'smooth'});
    return;
  }
  if(action==='open-chat')ctx.router.open({appId:'wechat',route:'/chat/'+target.dataset.id});
  if(action==='attach-chat')attachChat(target.dataset.id,'wechat',ctx);
}
export function input(target){
  if(!target.matches('[data-wx-search]'))return;
  const term=target.value.trim().toLocaleLowerCase();
  const root=target.closest('.wx-screen');
  root?.querySelectorAll('[data-wx-filter]').forEach(row=>{
    row.hidden=Boolean(term)&&!String(row.dataset.wxFilter||'').toLocaleLowerCase().includes(term);
  });
}
export const submit=(form,ctx)=>{if(form.dataset.form==='send-chat')sendChat(form,ctx);};
