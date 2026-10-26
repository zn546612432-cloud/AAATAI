import {chatView,sendChat,attachChat} from '../../components/chat.js';
import {receiveInvitation,deferInvitation,startAcceptedInvitation} from '../../services/invitations.js';
import {btn,demo} from '../../system/ui.js';
export const manifest={id:'noapp',name:'NoApp',icon:12,unlockDay:56,defaultRoute:'/chat/tai',supportsDeepLink:true,kicker:'PRIVATE CHANNEL'};
export function render({store}){const s=store.get();return `<div class="noapp-shell"><div class="noapp-note"><span>◈　私人频道 · 本机演示</span>${demo()}</div>${chatView(s,'noapp','tai')}</div>`;}
export function handle(action,target,ctx){const id=target.dataset.id;if(action==='accept-invite'){const matchId=receiveInvitation(ctx.store,id);ctx.router.open({appId:'chess',route:'/match/'+matchId,params:{invitationId:id}});}if(action==='defer-invite')deferInvitation(ctx.store,id);if(action==='open-invite-match'){const matchId=startAcceptedInvitation(ctx.store,id);ctx.router.open({appId:'chess',route:'/match/'+matchId,params:{invitationId:id}});}if(action==='attach-chat')attachChat('tai','noapp',ctx);}
export const submit=(form,ctx)=>{if(form.dataset.form==='send-chat')sendChat(form,ctx);};
