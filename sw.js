'use strict';
const CACHE='sotillo-shell-0.1.5';
const ASSETS=['./','./index.html','./weather.css?v=0.1.4','./weather.js?v=0.1.3','./manifest.webmanifest?v=0.1.2','./install.js?v=0.1.5','./refresh.js?v=0.1.4','./icon.svg','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(asset=>new Request(asset,{cache:'reload'})))).then(()=>self.skipWaiting())))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('sotillo-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
  if(!ASSETS.some(p=>new URL(p,self.registration.scope).pathname===url.pathname))return;
  event.respondWith(fetch(event.request,{cache:'no-cache'}).then(response=>{
    if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(event.request,copy)))}return response;
  }).catch(async()=>await caches.match(event.request)||(event.request.mode==='navigate'?await caches.match('./index.html'):Response.error())));
});






self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting()});


