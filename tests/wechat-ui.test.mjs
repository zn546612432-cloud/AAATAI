import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWeChatHome,routeForTab,tabForRoute} from '../src/apps/wechat/components/views.js';
import {wxIcon} from '../src/apps/wechat/components/icons.js';
import {demoContent} from '../src/story/demo/seed.js';

const mock={content:demoContent};
test('wechat has four functional first-level routes',()=>{
  assert.equal(tabForRoute('/'),'chats');
  for(const [id,route,label] of [
    ['chats','/','微信'],['contacts','/contacts','通讯录'],
    ['discover','/discover','发现'],['me','/me','我']
  ]){
    assert.equal(routeForTab(id),route);
    const html=renderWeChatHome(mock,route);
    assert.match(html,new RegExp('data-wx-tab="'+id+'"'));
    assert.equal((html.match(/class="wx-tab /g)||[]).length,4);
    assert.ok(html.includes(label));
    assert.match(html,/aria-current="page"/);
  }
});
test('wechat reads the existing editable conversations instead of inventing dialogue',()=>{
  const html=renderWeChatHome(mock,'/');
  assert.match(html,/熙旺/);
  assert.match(html,/GROUP/);
  assert.match(html,/data-action="open-chat"/);
  assert.match(html,/DEMO/);
});
test('contacts connect to story group participants and existing conversations',()=>{
  const html=renderWeChatHome(mock,'/contacts');
  for(const name of ['熙旺','胡枫','小辛','阿威','仔仔'])
    assert.ok(html.includes(name),name);
  assert.match(html,/data-action="wx-open-groups"/);
  assert.match(html,/data-wx-search/);
});
test('discover and me reproduce native first-level groupings',()=>{
  const discover=renderWeChatHome(mock,'/discover');
  for(const label of ['朋友圈','直播','扫一扫','小程序'])assert.ok(discover.includes(label));
  const me=renderWeChatHome(mock,'/me');
  for(const label of ['熙蒙','服务','收藏','表情','设置'])assert.ok(me.includes(label));
  assert.match(me,/ximeng-avatar\.svg/);
});
test('wechat icons remain scalable standalone vectors',()=>{
  assert.match(wxIcon('chats'),/^<svg/);
  assert.match(wxIcon('compass'),/<circle/);
  assert.match(wxIcon('qr'),/<path/);
});
