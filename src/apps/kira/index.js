import {btn,demo,esc} from '../../system/ui.js';
export const manifest={id:'kira',name:'KIRA',icon:10,defaultRoute:'/',supportsDeepLink:true,kicker:'ANONYMOUS RELAY'};
export const render=({store})=>`<div class="page-pad"><span class="eyebrow">ENCRYPTED MAIL ${demo()}</span><div class="large-title">KIRA</div><div class="surface-list">${store.get().content.mail.map(m=>btn('kira-mail',`<span class="file-symbol">✉</span><span class="list-copy"><strong>${esc(m.subject)}</strong><small>${esc(m.from)} · 附件可在文件中查看</small></span><span>›</span>`,'list-row',`data-id="${m.id}"`)).join('')}</div></div>`;
export function handle(action,t,ctx){if(action==='kira-mail')ctx.router.open({appId:'files',route:'/attachment',params:{mailId:t.dataset.id}});}
