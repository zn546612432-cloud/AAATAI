import {btn} from '../../system/ui.js';
import {dateParts,dateLabel,monthCells} from '../../services/calendar.js';
export const manifest={id:'calendar',name:'日历',glyph:'日',tone:'#e8f0f1',defaultRoute:'/',kicker:'CALENDAR'};
export function render({store}){const s=store.get(),d=dateParts(s);return `<div class="page-pad"><span class="eyebrow">${d.year}</span><div class="large-title">${d.month}月</div><div class="calendar-weekdays">${['日','一','二','三','四','五','六'].map(x=>`<span>${x}</span>`).join('')}</div><div class="calendar-month">${monthCells(s).map(cell=>`<span class="${cell?.today?'today':''}">${cell?.date||''}</span>`).join('')}</div><p class="calendar-current">${dateLabel(s,{weekday:true})}</p>${btn('open-schedule','查看今日安排','button-primary wide')}</div>`;}
export const handle=(a,t,c)=>{if(a==='open-schedule')c.router.open({appId:'schedule',route:'/'});};
