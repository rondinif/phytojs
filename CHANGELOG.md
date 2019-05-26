##TODO PRIMA DI CHIUDERE LA # 1.2.0 
## PhytoJS library improvments
- 100% automatic tests code coverage
coverage reported on coveralls:
- `npm run coveralls` code coverage available at https://coveralls.io/github/rondinif/phytojs

- `esm/index.js` discarded as the new more coherent name `esm/phyto.js`
package.json:
``` json
  "main": "umd/phyto.js",
  "module": "esm/phytojs.js",
```

- Commit conventions allow our team to add more semantic meaning to our git history. @see rules in: `commitlint.config.js`

## sample web app improvments
demofeat:(mobile-first) + responsive design
demofeat:(demo) + pure css on page waiting animation 
removed from main beacuse of browser compatibility 
  // import { config } from '../esm/config'
  // import { logconfig } from '../esm/logconfig'

  `npm run test-main` replace `npm run test-index`
 
# 1.1.0 
## Include sample web app 
In the ./docs.mvc folder an essential example application is now available.
In response to the [issue #1](https://github.com/rondinif/phytojs/issues/1) the example show how to use PhytoJS in a vanilla ES6 web browser SPA; this particular example Will work in your browser in these cases:
- Safari 10.1.
- Chrome 61.
- Firefox 54 – behind the dom.moduleScripts.enabled setting in about:config.
- Edge 15 – behind the Experimental JavaScript Features setting in about:flags.  


## Logging 
- all `log.trace(` are replare with `log.trace(` beacause of the meaning of `log.trace` was misunderstood
## SDLC
- changed `rollup.config.js` to avoid too much warnings 

## 1.0.1 BUG HOTFIX
### fixed CORS disabled in Chrome breaks the operation od the service
`src/lib/OpenDataLogicAgent.mjs::getPromiseOfWikiDataApiActionQuerySearchByName` now has support for `cors`  this fix errors in browser such as: 
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
