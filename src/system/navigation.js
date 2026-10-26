const WECHAT_TABS=new Set(['/','/contacts','/discover','/me']);

// Native tab switches are changes of content inside a single app, not page navigation.
export function isWeChatTabSwitch(before,after){
 return before?.appId==='wechat'&&after?.appId==='wechat'&&
  before.route!==after.route&&WECHAT_TABS.has(before.route)&&WECHAT_TABS.has(after.route);
}
