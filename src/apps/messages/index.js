import {btn,esc,demo} from '../../system/ui.js';
export const manifest={id:'messages',name:'信息',glyph:'••',tone:'#5bbd82',defaultRoute:'/',kicker:'MESSAGES'};
export const render=()=>`<div class="page-pad"><div class="large-title">信息</div><div class="surface-list">${btn('open-bank',`<span class="avatar">P</span><span class="list-copy"><strong>Pacific Bank</strong><small>电子月结单已可查看。 ${demo()}</small></span><span>›</span>`,'list-row')}</div></div>`;
export const handle=(a,t,c)=>{if(a==='open-bank')c.router.open({appId:'bank',route:'/'});};
