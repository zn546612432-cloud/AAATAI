import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,PhoneStore} from '../src/services/storage.js';
import {MessageDelivery} from '../src/services/messaging/delivery.js';
import {advanceGameMinutes,tickWorld,setSleeping,dismissAlarm,absoluteMinute} from '../src/system/time/clock.js';
import {plugIn,drainBattery,BATTERY_DRAIN_INTERVAL_MS} from '../src/system/power/battery.js';

test('normal game clock: 30 real minutes for 24 game hours, battery independent',()=>{
 const s=initialState();s.day=1;s.clock='08:00';s.batteryPercent=100;
 const start=absoluteMinute(s);
 const elapsed=1_125_000;
 tickWorld(s,elapsed);
 assert.equal(absoluteMinute(s)-start,900);
 drainBattery(s,elapsed);
 assert.equal(s.clock,'23:00');
 assert.equal(s.batteryPercent,20);
});

test('charging can start above 20%, one hour per 3 seconds, and can be stopped',()=>{
 const s=initialState(),start=absoluteMinute(s);s.batteryPercent=55;
 plugIn(s);
 const outcome=tickWorld(s,3000);
 assert.equal(outcome.minutes,60);
 assert.equal(absoluteMinute(s)-start,60);
 assert.ok(s.batteryPercent>55);
 assert.equal(s.powerMode,'charging');
});

test('sleep wakes at 08:00 with full charge when no earlier alarm',()=>{
 const s=initialState();s.clock='23:00';s.batteryPercent=20;
 s.content.alarms=[];
 plugIn(s);assert.equal(setSleeping(s),true);
 let outcome=tickWorld(s,20_000);
 assert.equal(outcome.event,'wake');
 assert.equal(s.clock,'08:00');
 assert.equal(s.day,57);
 assert.equal(s.batteryPercent,100);
 assert.equal(s.powerMode,'idle');
});

test('03:00 alarm rings at exact time despite fast-forward, then user wakes',()=>{
 const s=initialState();s.clock='23:00';s.batteryPercent=30;
 s.content.alarms=[{id:'test',time:'03:00',label:'凌晨工作',enabled:true,repeat:'永不'}];
 plugIn(s);setSleeping(s);
 const outcome=tickWorld(s,12_000);
 assert.equal(outcome.event,'alarm');
 assert.equal(s.clock,'03:00');
 assert.equal(s.alarmRinging.label,'凌晨工作');
 assert.equal(tickWorld(s,5000).minutes,0);
 dismissAlarm(s);
 assert.equal(s.alarmRinging,null);
 assert.equal(s.powerMode,'charging');
});

test('03:00 at night without charging forces emergency 1%, stops clock',()=>{
 const s=initialState();s.clock='02:50';s.batteryPercent=67;
 const outcome=advanceGameMinutes(s,40);
 assert.equal(outcome.event,'emergency');
 assert.equal(s.clock,'03:00');
 assert.equal(s.batteryPercent,1);
 assert.equal(tickWorld(s,8000).minutes,0);
 plugIn(s);
 assert.equal(s.emergencyCharge,false);
 assert.equal(tickWorld(s,3000).minutes,60);
});

test('typing slows time rather than rushing long conversations',()=>{
 const a=initialState(),b=initialState();
 tickWorld(a,5000);
 tickWorld(b,5000,{focused:true});
 assert.equal(a.clock,'21:22');
 assert.equal(b.clock,'21:18');
});

test('fast-forward delivers each pre-scheduled chat message with its original timestamp',()=>{
 const data=new Map(),storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};
 const store=new PhoneStore(storage);
 store.update(s=>{
  s.content.conversations={wechat:[{id:'test',name:'测试聊天',messages:[
   {id:'a',from:'contact',text:'午夜之前',schedule:{mode:'game-time',day:56,clock:'23:30'}},
   {id:'b',from:'contact',text:'凌晨一点',schedule:{mode:'game-time',day:57,clock:'01:00'}}
  ]}]};
  plugIn(s);
  advanceGameMinutes(s,300);
 });
 const due=new MessageDelivery(store).tick();
 assert.equal(due.length,2);
 const messages=store.get().content.conversations.wechat[0].messages;
 assert.deepEqual(messages.map(m=>m.delivery),[{day:56,clock:'23:30'},{day:57,clock:'01:00'}]);
});
