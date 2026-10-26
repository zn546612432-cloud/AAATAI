import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {render,handle,manifest} from '../src/apps/photos/index.js';
import {renderLibrary} from '../src/apps/photos/features/library/index.js';
import {renderCollections} from '../src/apps/photos/features/collections/index.js';
import {samplePhotos,sampleCount,allPhotos} from '../src/apps/photos/data/demo.js';
import {isPhotosTabSwitch,isNativeTabSwitch} from '../src/system/navigation.js';
import {initialState} from '../src/services/storage.js';

const state=initialState(),ctx={store:{get:()=>state}};
test('photos is an independent registered app and two stable first-level views',()=>{
 assert.equal(manifest.id,'photos');
 for(const [route,title] of [['/','图库'],['/collections','精选集']]){
  const html=render(ctx,{route,params:{}});
  assert.match(html,new RegExp(`<main class="ph-screen is-${route==='/'?'library':'collections'}`));
  assert.match(html,new RegExp(`<h1>${title}</h1>`));
  assert.match(html,/data-action="photos-tab"/);
  assert.equal((html.match(/class="ph-tab /g)||[]).length,2);
  assert.match(html,/ph-bottom-bar/);
  assert.match(html,/ph-search-button/);
 }
});
test('native Photos tab switching never animates the whole screen',()=>{
 assert.equal(isPhotosTabSwitch({appId:'photos',route:'/'},{appId:'photos',route:'/collections'}),true);
 assert.equal(isNativeTabSwitch({appId:'photos',route:'/collections'},{appId:'photos',route:'/'}),true);
 assert.equal(isPhotosTabSwitch({appId:'photos',route:'/'},{appId:'photos',route:'/photo'}),false);
 assert.equal(isPhotosTabSwitch({appId:'home',route:'/'},{appId:'photos',route:'/collections'}),false);
});
test('reference screenshot layout is five-column grid and three horizontal album sections',()=>{
 assert.ok(samplePhotos.length>=50);
 assert.match(renderLibrary([]),/6,940个项目/);
 const markup=renderCollections([]);
 for(const name of ['回忆','固定','相簿','人物','个人收藏','最近保存','视频','微博','QQ']){
  assert.ok(markup.includes(name),name);
 }
 assert.match(markup,/无可用回忆/);
 assert.match(markup,/正在同步 1 个项目/);
 const css=readFileSync(new URL('../src/apps/photos/styles.css',import.meta.url),'utf8');
 assert.match(css,/grid-template-columns:repeat\(5,minmax\(0,1fr\)\)/);
 assert.match(css,/backdrop-filter:blur/);
 assert.match(css,/#phone:has\(\.ph-screen\) #homebar\{opacity:0/);
});
test('real imported photos render from state alongside replaceable visual fixtures',()=>{
 const own={id:'saved-1',src:'data:image/png;base64,AAAA',title:'我的图片',favorite:true,actual:true};
 assert.equal(allPhotos([own])[0].id,'saved-1');
 assert.equal(sampleCount,6940);
 assert.match(renderLibrary([own]),/6,941个项目/);
 const viewer=render({store:{get:()=>({content:{photos:[own]}})}},{route:'/photo',params:{photoId:'saved-1'}});
 assert.match(viewer,/data:image\/png;base64,AAAA/);
 assert.match(viewer,/data-action="photos-favorite"/);
 assert.match(viewer,/data-action="photos-wallpaper"/);
 assert.match(viewer,/data-action="photos-share"/);
});
test('photos remain decomposed into one folder per feature',()=>{
 for(const name of ['library','collections','albums','viewer','search','import','selection']){
  assert.ok(existsSync(new URL(`../src/apps/photos/features/${name}/index.js`,import.meta.url)),name);
 }
 const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 assert.match(index,/src\/apps\/photos\/styles\.css/);
});
