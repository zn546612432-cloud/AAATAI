export const selection={enabled:false,selected:new Set(),filter:'all'};
export function resetSelection(){selection.enabled=false;selection.selected.clear();selection.filter='all';}
export function handleSelection(action,target,ctx){
 if(action==='photos-toggle-select'){
  selection.enabled=!selection.enabled;selection.selected.clear();ctx.refresh();return true;
 }
 if(action==='photos-select-photo'){
  const id=target.dataset.id;
  selection.selected.has(id)?selection.selected.delete(id):selection.selected.add(id);
  ctx.refresh();return true;
 }
 if(action==='photos-clear-selection'){resetSelection();ctx.refresh();return true;}
 if(action==='photos-filter'){selection.filter=target.dataset.filter||'all';ctx.refresh();return true;}
 return false;
}
