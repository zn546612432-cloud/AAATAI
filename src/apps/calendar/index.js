import {btn,esc} from '../../system/ui.js';
export const manifest={id:'calendar',name:'日历',glyph:'日',tone:'#e8f0f1',defaultRoute:'/',kicker:'CALENDAR'};
export const render=({store})=>`<div class="page-pad"><span class="eyebrow">GAME DAY</span><div class="large-title">第 ${store.get().day} 天</div><div class="calendar-month">${Array.from({length:35},(_,i)=>`<span class="${i+1===store.get().day?'today':''}">${i+1<=30?i+1:''}</span>`).join('')}</div><div class="muted-note">日期浏览不推进正式剧情。</div>${btn('open-schedule','查看今日安排','button-primary wide')}</div>`;
export const handle=(a,t,c)=>{if(a==='open-schedule')c.router.open({appId:'schedule',route:'/'});};
