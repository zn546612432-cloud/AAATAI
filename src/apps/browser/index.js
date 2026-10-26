import {btn,card} from '../../system/ui.js';
export const manifest={id:'browser',name:'浏览器',icon:5,defaultRoute:'/',kicker:'SAFARI'};
export const render=()=>`<div class="page-pad"><div class="large-title">浏览器</div><div class="search-line">⌕　搜索或输入网址</div><div class="section-heading">常用项目</div>${card('<strong>本机内容</strong><p>为了保持游戏世界一致，外部网页功能暂未启用。</p>')}${btn('browser-files','查看文件','button-quiet wide')}</div>`;
export const handle=(a,t,c)=>{if(a==='browser-files')c.router.open({appId:'files',route:'/'});};
