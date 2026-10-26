import {btn,esc} from '../../system/ui.js';
export const manifest={id:'reminders',name:'提醒事项',glyph:'☑',tone:'#dce9ec',defaultRoute:'/',kicker:'TODAY'};
export const render=({store})=>`<div class="page-pad"><div class="large-title">提醒事项</div><div class="surface-list">${store.get().content.notes.map(n=>btn('reminder-note',`<span class="reminder-check">○</span><span class="list-copy"><strong>${esc(n.title)}</strong><small>${esc(n.text.slice(0,35))}</small></span>`,'list-row',`data-id="${n.id}"`)).join('')}</div></div>`;
export const handle=(a,t,c)=>{if(a==='reminder-note')c.router.open({appId:'notes',route:'/edit',params:{noteId:t.dataset.id}});};
