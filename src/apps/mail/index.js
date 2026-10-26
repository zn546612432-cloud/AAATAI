import {btn,demo,esc} from '../../system/ui.js';
export const manifest={id:'mail',name:'邮件',icon:4,defaultRoute:'/',supportsDeepLink:true,kicker:'INBOX'};
export const render=({store})=>`<div class="page-pad"><div class="large-title">收件箱</div><div class="surface-list">${store.get().content.mail.map(m=>btn('mail-open',`<span class="avatar">${esc(m.from.slice(0,1))}</span><span class="list-copy"><strong>${esc(m.subject)}</strong><small>${esc(m.body)}</small></span><span>›</span>`,'list-row',`data-id="${m.id}"`)).join('')}</div>${demo()}</div>`;
export function handle(a,t,c){if(a==='mail-open')c.router.open({appId:'files',route:'/attachment',params:{mailId:t.dataset.id}});}
