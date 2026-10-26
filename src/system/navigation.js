undefined
const PHOTOS_TABS=new Set(['/','/collections']);
// All first-level tabs must keep their existing app frame for native, flash-free switching.
export function isPhotosTabSwitch(before,after){
 return before?.appId==='photos'&&after?.appId==='photos'&&
  before.route!==after.route&&PHOTOS_TABS.has(before.route)&&PHOTOS_TABS.has(after.route);
}
export const isNativeTabSwitch=(before,after)=>isWeChatTabSwitch(before,after)||isPhotosTabSwitch(before,after);
