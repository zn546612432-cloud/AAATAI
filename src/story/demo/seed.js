// UI fixtures only. Reviewed story dialogue lives in separately imported story content.
export const demoContent={
  conversations:{
    wechat:[{id:'wang',name:'熙旺',avatar:'旺',messages:[{id:'w1',from:'wang',text:'阿蒙，返嚟記得食宵夜。',time:'21:03',demo:true},{id:'w2',from:'me',text:'知道啦，哥。',time:'21:06',demo:true}]},{id:'group',name:'GROUP',avatar:'六',unread:1,messages:[{id:'g1',from:'胡枫',text:'聽日有人想去食燒烤嗎？',time:'20:58',demo:true},{id:'g2',from:'小辛',text:'@胡枫 你又臨時先講。',time:'21:01',demo:true}]}],
    noapp:[{id:'tai',name:'Dr Ouroboros',avatar:'D',messages:[{id:'n1',from:'tai',text:'下一局？',time:'21:17',demo:true},{id:'n2',from:'tai',kind:'app_invitation',targetApp:'chess',invitationId:'demo-inv-001',time:'21:18',demo:true}]}],
    mirage:[{id:'rook',name:'Rookery 13',avatar:'R',messages:[{id:'r1',from:'rook',text:'舊委託已歸檔。',time:'昨天',demo:true}]}]
  },
  notes:[{id:'note-1',title:'留到下次',text:'那盤棋，改天接著下。',demo:true}],
  orders:[{id:'order-1',title:'離線資料整理',owner:'Rookery 13',reward:'MOP 240',status:'开放',demo:true}],
  photos:[],
  reminders:[{id:'reminder-demo-1',title:'给手机充电',done:false,demo:true},{id:'reminder-demo-2',title:'整理照片',done:false,demo:true},{id:'reminder-demo-3',title:'继续上次的棋局',done:false,demo:true}],
  mail:[{id:'mail-1',from:'KIRA',subject:'档案索引',body:'演示邮件：附件可以在文件 App 中打开。',demo:true}],
};
export const demoInvitation={id:'demo-inv-001',senderId:'tai',recipientId:'player',source:'demo-fixture',status:'pending',createdDay:56,expiresDay:58,matchId:null};
