export const tools=[
 {id:'cipher',name:'破译',en:'CIPHER',detail:'重组加密矩阵',glyph:'◇'},
 {id:'route',name:'链接',en:'ROUTE',detail:'建立传输链路',glyph:'⌁'},
 {id:'extract',name:'窃取',en:'EXTRACT',detail:'匹配数据指纹',glyph:'⊡'},
 {id:'veil',name:'隐匿',en:'VEIL',detail:'覆写追踪序列',glyph:'≋'},
 {id:'strike',name:'攻击',en:'STRIKE',detail:'执行预设程序',glyph:'↯'}
];
export const defaultConfig={seconds:90,retries:3,rounds:3,codeLength:4,attackMs:5200,reward:null};
export const stages=['INITIALIZING','LINK ESTABLISHED','STREAMING PAYLOAD','VERIFYING RESPONSE','OPERATION COMPLETE'];
