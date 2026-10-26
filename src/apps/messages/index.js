import {chatList,chatView,sendChat,attachChat} from '../../components/chat.js';
import {btn,demo} from '../../system/ui.js';
export const manifest={id:'messages',name:'信息',glyph:'••',tone:'#5bbd82',defaultRoute:'/',supportsDeepLink:true,kicker:'MESSAGES'};
export function render({store},loc){const s=store.get();if(loc.route.startsWith('/chat/'))return chatView(s,'messages',loc.route.slice(6));return chatList(s,'messages')+`<div class="page-pad sms-bank-shortcut">${btn('open-bank','Pacific Bank · 电子月结单　↗ '+demo(),'button-quiet wide')}</div>`;}
export function handle(a,t,c){if(a==='open-bank')c.router.open({appId:'bank',route:'/'});if(a==='open-chat')c.router.open({appId:'messages',route:'/chat/'+t.dataset.id});if(a==='attach-chat')attachChat(t.dataset.id,'messages',c);}
export const submit=(form,ctx)=>{if(form.dataset.form==='send-chat')sendChat(form,ctx);};
