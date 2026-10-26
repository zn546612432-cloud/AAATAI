import {btn,card,demo} from '../../system/ui.js';
export const manifest={id:'phone',name:'电话',icon:7,defaultRoute:'/',kicker:'CALLS'};
export const render=()=>`<div class="page-pad"><div class="large-title">电话</div>${card(`<div class="contact-row"><span class="avatar">旺</span><div><strong>熙旺</strong><small>最近联系</small></div></div>${btn('call-demo','查看通话功能','button-primary wide')}`)}<p class="fine-print">MiniMax 尚未接入。这里不会显示假接通、通话时长或角色语音。</p></div>`;
export const handle=(a,t,c)=>{if(a==='call-demo')c.toast('语音服务未连接；需要服务端 MiniMax 配置。');};
