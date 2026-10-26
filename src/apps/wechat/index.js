import {chatList,chatView,sendChat,attachChat} from '../../components/chat.js';
export const manifest={id:'wechat',name:'微信',icon:0,defaultRoute:'/',supportsDeepLink:true,kicker:'MESSAGES'};
export const render=({store},location)=>location.route.startsWith('/chat/')?chatView(store.get(),'wechat',location.route.slice(6)):chatList(store.get(),'wechat');
export function handle(action,target,ctx){if(action==='open-chat')ctx.router.open({appId:'wechat',route:'/chat/'+target.dataset.id});if(action==='attach-chat')attachChat(target.dataset.id,'wechat',ctx);}
export const submit=(form,ctx)=>{if(form.dataset.form==='send-chat')sendChat(form,ctx);};
