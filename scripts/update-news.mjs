import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const source='https://www.sotillo.net/';
const decode=s=>s.replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&apos;|&#039;/g,"'").replace(/&([a-z])(acute|tilde|uml);/gi,(_,c,a)=>({acute:c+'\u0301',tilde:c+'\u0303',uml:c+'\u0308'}[a.toLowerCase()]).normalize('NFC')).replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/\s+/g,' ').trim();
export function eventEndFromTitle(title){
 const match=title.match(/\b(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\s+(?:de\s+)?(20\d{2})\b/i);
 if(!match)return undefined;
 // Un intervalo o varios días requieren una fecha final revisada explícitamente.
 if(/\b(?:al|y)\s*\d{1,2}\s+de\b/i.test(title))return undefined;
 const month=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'].indexOf(match[2].toLowerCase())+1;
 const iso=`${match[3]}-${String(month).padStart(2,'0')}-${match[1].padStart(2,'0')}`;
 if(new Date(iso+'T12:00:00Z').toISOString().slice(0,10)!==iso)return undefined;
 return iso;
}
export function parseNews(html){
 const section=html.match(/<section[^>]*id="noticiasenportada"[^>]*>([\s\S]*?)<\/section>/i)?.[1];
 if(!section)throw Error('No se encuentra la portada municipal; se conserva el archivo anterior');
 const items=[];
 const add=(title,url)=>{const full=new URL(url,source);if(full.origin!==new URL(source).origin||!title||items.some(x=>x.url===full.href))return;const clean=decode(title);const eventEnd=eventEndFromTitle(clean);items.push({title:clean,url:full.href,...(eventEnd?{eventEnd}:{})})};
 const featured=section.match(/<h2[^>]*class="display-3[^>]*>([\s\S]*?)<\/h2>[\s\S]*?<a href="([^"]+)"/i);
 if(featured)add(featured[1],featured[2]);
 for(const block of section.split(/<div class="col-12 noticia">/i).slice(1)){
   const title=block.match(/<h4[^>]*>([\s\S]*?)<\/h4>/i)?.[1];
   const url=block.match(/<a href="([^"]+)"/i)?.[1];
   if(title&&url)add(title,url);
   if(items.length>=6)break;
 }
 if(items.length<2)throw Error('Portada incompleta; se conserva el archivo anterior');
 return items;
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const response=await fetch(source,{signal:AbortSignal.timeout(30000)});
 if(!response.ok)throw Error('Fuente municipal: '+response.status);
 const items=parseNews(await response.text());
 const target=new URL('../news.json',import.meta.url);
 const previous=await fs.readFile(target,'utf8').then(JSON.parse).catch(()=>null);
 const updatedAt=JSON.stringify(previous?.items)===JSON.stringify(items)?previous.updatedAt:new Date().toISOString();
 await fs.writeFile(target,JSON.stringify({source,checkedAt:new Date().toISOString(),updatedAt,items},null,2)+'\n');
 console.log('Portada municipal verificada: '+items.length+' titulares.');
}
