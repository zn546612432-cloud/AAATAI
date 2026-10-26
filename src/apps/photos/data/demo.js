import {esc} from '../../../system/ui.js';
const A='/apps/wechat/avatars/originals/';
export const people=[
 {id:'wang',name:'熙旺',image:A+'xiwang.jpeg'},
 {id:'ximeng',name:'熙蒙',image:A+'ximeng.jpeg'},
 {id:'tai',name:'熙泰',image:A+'awei.jpeg'},
 {id:'hufeng',name:'胡枫',image:A+'hufeng.jpeg'},
 {id:'xiaoxin',name:'小辛',image:A+'xiaoxin.jpeg'},
 {id:'zaizai',name:'仔仔',image:A+'zaizai.jpeg'}
];
const kinds=[
 'chat','chat','chat','list','list','chat','chat','list','settings','settings',
 'settings','chat','terminal','video','blueprint','chat','settings','nature','film','list',
 'chat','flower','sky','portrait','poster','portrait','chat','chat','art','message',
 'settings','video','nature','terminal','portrait','list','chat','flower','settings','film',
 'art','nature','chat','portrait','blueprint','poster','portrait','video','list','chat',
 'portrait','settings','nature','film','chat','terminal','portrait','art','settings','flower'
];
export const samplePhotos=kinds.map((kind,i)=>({
 id:`sample-${String(i+1).padStart(3,'0')}`,title:`示例照片 ${i+1}`,kind,fixture:true,
 image:kind==='portrait'?people[[3,0,4,1,2,5][i%6]].image:null,
 tone:i%7
}));
export const sampleCount=6940; // Screenshot's display count; visual fixture only.
export function allPhotos(saved=[]){return [...saved.map(p=>({...p,kind:'uploaded',image:p.src})),...samplePhotos];}
export function findPhoto(saved=[],id){return allPhotos(saved).find(p=>p.id===id);}
export function photoArtwork(photo){
 if(photo.image)return `<img src="${esc(photo.image)}" alt="" loading="lazy" draggable="false">`;
 const kind=photo.kind||'chat';
 if(kind==='chat'||kind==='message')return `<span class="ph-art ph-art-${kind} tone-${photo.tone||0}"><i class="ph-mini-head"></i><b></b><em></em><small></small><b></b><em></em><small></small><b></b><em></em></span>`;
 if(kind==='settings'||kind==='list')return `<span class="ph-art ph-art-${kind} tone-${photo.tone||0}"><i></i><b></b><i></i><b></b><i></i><b></b><i></i><b></b><i></i><b></b></span>`;
 if(kind==='terminal'||kind==='blueprint')return `<span class="ph-art ph-art-${kind} tone-${photo.tone||0}"><i></i><b></b><em></em><b></b><i></i><small></small></span>`;
 if(kind==='flower')return '<span class="ph-art ph-art-flower"><i></i><b></b><em></em><small></small></span>';
 if(kind==='sky')return '<span class="ph-art ph-art-sky"><i></i><b></b><em></em></span>';
 if(kind==='art'||kind==='poster')return `<span class="ph-art ph-art-${kind} tone-${photo.tone||0}"><i></i><b></b><em></em></span>`;
 if(kind==='nature')return '<span class="ph-art ph-art-nature"><i></i><b></b><em></em></span>';
 return `<span class="ph-art ph-art-${kind} tone-${photo.tone||0}"><i></i><b></b><em></em></span>`;
}
