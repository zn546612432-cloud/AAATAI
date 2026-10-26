import {btn,esc} from '../../system/ui.js';
export const manifest={id:'ghost',name:'GHOST',icon:9,defaultRoute:'/',supportsDeepLink:true,kicker:'LOCAL TERMINAL'};
export const render=({store},loc)=>`<div class="terminal-page"><div class="terminal-glow">◉</div><span class="eyebrow">GHOST / LOCAL SANDBOX</span><h1>请保持安静。</h1><div class="terminal-lines">&gt; system ready<br>&gt; archive / ${esc(loc.params.orderId||'idle')}<br>&gt; available: status · files · chess</div><p>这是虚构工具界面，不连接外部设备或目标。</p>${btn('ghost-files','浏览本机文件','terminal-action')}${btn('ghost-chess','打开国际象棋','terminal-action')}</div>`;
export function handle(action,t,ctx){if(action==='ghost-files')ctx.router.open({appId:'files',route:'/'});if(action==='ghost-chess')ctx.router.open({appId:'chess',route:'/'});}
