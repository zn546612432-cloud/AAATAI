import {esc} from '../../../../system/ui.js';
import {phIcon} from '../../components/icons.js';
import {allPhotos} from '../../data/demo.js';
import {renderPhotoTile} from '../library/index.js';
export function renderSearch(saved=[]){
 const photos=allPhotos(saved);
 return `<section class="ph-search-page" aria-label="搜索照片">
  <div class="ph-search-header"><div class="ph-search-field">${phIcon('search',19)}<input data-photo-search type="search" placeholder="搜索照片" aria-label="搜索照片" autocomplete="off"></div>
  <button data-action="back">取消</button></div>
  <div class="ph-search-results">${photos.map(p=>`<div data-photo-search-item="${esc((p.title||'')+' '+(p.kind||''))}">${renderPhotoTile(p)}</div>`).join('')}</div>
  <p class="ph-search-empty" hidden>没有找到照片</p>
 </section>`;
}
