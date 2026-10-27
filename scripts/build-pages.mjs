import {execFileSync} from 'node:child_process';
import {readdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';

// The game runs at / in local development, but project Pages lives at /AAATAI/.
// Rewrite absolute app asset URLs only in the generated site, never in sources or saves.
const repo=(process.env.GITHUB_REPOSITORY||'zn546612432-cloud/AAATAI').split('/').at(-1);
const projectPath=process.env.GITHUB_PAGES_BASE||`/${repo}/`;
if(!/^\/[A-Za-z0-9._/-]*\/$/.test(projectPath)||projectPath.includes('..'))throw Error('Invalid GitHub Pages base path');
const base=projectPath==='/'?'/':projectPath;
const resourcePattern=/(["'`(=])\/(src|assets|apps|icons|vendor|wallpapers)(?=\/)/g;

execFileSync(process.execPath,['scripts/build.mjs'],{stdio:'inherit'});

let replacements=0;
async function rewriteTree(folder){
 for(const entry of await readdir(folder,{withFileTypes:true})){
  const file=path.join(folder,entry.name);
  if(entry.isDirectory()){await rewriteTree(file);continue;}
  if(!/\.(html|css|js)$/.test(entry.name))continue;
  const original=await readFile(file,'utf8');
  const rewritten=original.replace(resourcePattern,(_all,prefix,section)=>{replacements++;return `${prefix}${base}${section}`;});
  if(rewritten!==original)await writeFile(file,rewritten);
 }
}
await rewriteTree('dist');
await writeFile('dist/.nojekyll','');
console.log(`GitHub Pages: ${replacements} resource paths adapted to ${base}`);
