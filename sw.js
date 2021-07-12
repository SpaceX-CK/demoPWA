const staticCacheName = 'cache_name';
const URLS = [
  '/',
  'index.html',
  '/logo.png',
  '/app.js',
  '/manifest.json',
  '/sw.js',
  'https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css'

]




// install event
self.addEventListener('install',async evt => {
    //console.log('service worker installed');
    //caching 
    const cache = await caches.open(staticCacheName)
    await cache.addAll(URLS);
    await self.skipWaiting();
})

// activate event
self.addEventListener('activate',async evt => {
  //console.log('service worker activated');
  //cleaning old cache
  const keys = await caches.keys()
  keys.forEach(keys =>{
    
    if (keys !== staticCacheName){
      caches.delete(key)
    }
  })
  await self.clients.claim()
})

// fetch event
self.addEventListener('fetch', evt => {
  //console.log('fetch event', evt);
  const req = evt.request
  evt.respondWith(networkFirst(req))
  //filter resource,only allow data from same url
  // const url = new URL(req.url)
  // if (url.origin !== self.origin){
  //   return
  // }

  // if (req.url.include('/api')){
  //   evt.respondWith(networkFirst(req))
  // }
  // else{
  //   evt.respondWith(cacheFirst(req))
  // }
})


// self.addEventListener('fetch', evt => {
//   //console.log('fetch event', evt);
//   evt.respondWith(
//     caches.match(evt.request).then(cacheRes => {
//       return cacheRes || fetch(evt.request);
//     })
//   );
// });







//cache primary for static file
async function cacheFirst(req){
  const cache = await caches.open(staticCacheName)
  const cached = await cache.match(req)
  //if got it from cache
  if (cached){
    return cached
  }else{
    const fresh = await fetch(req)
    return fresh
  }
}

//network primary for dynamic data file
async function networkFirst(req){
  const cache = await caches.open(staticCacheName)
  try{
    //storing new data from internet to local cache
    const fresh = await fetch(req)
    cache.put(req,fresh.clone())
    //clone = store
    return fresh
  }catch(e){
    const cached = await cache.match(req)
    return cached
  }
}