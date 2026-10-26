export const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const btn=(action,label,cls='',attrs='')=>`<button type="button" class="${cls}" data-action="${action}" ${attrs}>${label}</button>`;
export const timeLabel=s=>`D${String(s.day).padStart(2,'0')} · ${s.clock}`;
export function icon(app,s,cls=''){const src=s.iconOverrides?.[app.id];if(src)return `<span class="app-tile ${cls}" style="background-image:url('${esc(src)}');background-size:cover;background-position:center"></span>`;if(Number.isInteger(app.icon))return `<span class="app-tile icon-atlas ${cls}" style="background-position:${(app.icon%4)*100/3}% ${Math.floor(app.icon/4)*100/3}%"></span>`;return `<span class="app-tile icon-glyph ${cls}" style="--tone:${app.tone||'#446c87'}">${app.glyph||'✦'}</span>`;}
export const avatar=(name,variant='')=>`<span class="avatar ${variant}">${esc((name||'?').slice(0,1))}</span>`;
export const section=(title,body)=>`<section class="section"><div class="section-heading">${title}</div>${body}</section>`;
export const demo=()=>'<span class="demo-tag">DEMO</span>';
export const empty=(title,desc='')=>`<div class="empty"><span class="empty-orbit">✦</span><strong>${title}</strong><p>${desc}</p></div>`;
export const card=(body,cls='')=>`<div class="card ${cls}">${body}</div>`;
