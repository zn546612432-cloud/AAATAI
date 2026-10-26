import {btn,demo,esc,empty} from '../../system/ui.js';
export const manifest={id:'kira',name:'KIRA',icon:10,defaultRoute:'/',supportsDeepLink:true,kicker:'ENCRYPTED MAIL'};
export function render({store},loc){
 const s=store.get();
 if(loc.route.startsWith('/mail/')){
  const m=s.content.mail.find(m=>m.id===loc.route.slice(6));
  return m?`<div class="page-pad"><span class="eyebrow">KIRA MAIL ${m.demo?demo():''}</span><h2>${esc(m.subject)}</h2><p class="muted">${esc(m.from)}</p><div class="mail-body">${esc(m.body)}</div>${btn('kira-attachment','查看附件　↗','button-quiet wide',`data-id="${esc(m.id)}"`)}</div>`:empty('邮件不存在');
 }
 return `<div class="page-pad"><span class="eyebrow">ENCRYPTED MAIL ${demo()}</span><div class="large-title">KIRA</div><div class="surface-list">${s.content.mail.map(m=>btn('kira-mail',`<span class="file-symbol">✉</span><span class="list-copy"><strong>${esc(m.subject)}</strong><small>${esc(m.from)} · ${esc(m.body)}</small></span><span>›</span>`,'list-row',`data-id="${esc(m.id)}"`)).join('')}</div></div>`;
}
export function handle(a,t,c){if(a==='kira-mail')c.router.open({appId:'kira',route:'/mail/'+t.dataset.id});if(a==='kira-attachment')c.router.open({appId:'files',route:'/attachment',params:{mailId:t.dataset.id}});}
