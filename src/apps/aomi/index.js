import {btn,esc} from '../../system/ui.js';
import {aomiHome} from './features/home/index.js';
import {aomiOrders} from './features/orders/index.js';
import {aomiProfile} from './features/profile/index.js';
import {aomiLogin} from './features/login/index.js';
export const manifest={id:'aomi',name:'澳觅',glyph:'澳',tone:'#ff315b',defaultRoute:'/',kicker:'AOMI'};
let section='home',login=false,phone='';
const tabs=()=>`<nav class="aomi-tabs">${[['home','tab-delivery','外卖'],['orders','tab-orders','订单'],['profile','tab-me','我']].map(([id,icon,label])=>btn('aomi-tab',`<img src="/assets/aomi-source/${icon}.png" alt=""><span>${label}</span>`,section===id?'active':'',`data-tab="${id}"`)).join('')}</nav>`;
export function render(){return `<div class="aomi-page">${login?aomiLogin(phone):`${section==='orders'?aomiOrders():section==='profile'?aomiProfile():aomiHome()}${tabs()}`}</div>`;}
export function handle(a,t,c){if(a==='aomi-tab'){section=t.dataset.tab;c.refresh();}if(a==='aomi-login'){login=true;c.refresh();}if(a==='aomi-close'){login=false;c.refresh();}if(a==='aomi-code')c.toast('请输入正确的手机号');if(a==='aomi-search')c.toast('附近暂无商户');if(a==='aomi-retry')c.toast('当前位置附近没有商户');if(a==='aomi-chat')c.toast('客服暂不可用');if(a==='aomi-login-submit')c.toast('请输入正确的手机号');}
export function input(el){if(el.name==='aomi-phone')phone=el.value;}
