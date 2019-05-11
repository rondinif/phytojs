# 1.0.1 
## 1.0.1 BUG FIX
### fixed CORS disabled in Chrome breaks the operation od the service
`src/lib/OpenDataLogicAgent.mjs::getPromiseOfWikiDataApiActionQuerySearchByName` now has support for `cors` and fixes
```
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

# 1.0.0
First working draft

``` bash 
npm i rondinif/phytojs --save
```

check dependencies in `package.json`
``` json
  "dependencies": {
    "@rondinif/phytojs": "github:rondinif/phytojs",
```
