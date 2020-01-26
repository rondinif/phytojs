# PhytoJS: @rondinif/phytojs
[![Travis build status](https://img.shields.io/travis/rondinif/phytojs/master.svg?style=flat-square)](https://travis-ci.org/rondinif/phytojs)
[![Coveralls](https://img.shields.io/coveralls/rondinif/phytojs.svg?style=flat-square)](https://coveralls.io/github/rondinif/phytojs)
[![NPM version](https://img.shields.io/npm/v/@rondinif/phytojs.svg?style=flat-square)](https://www.npmjs.org/package/@rondinif/phytojs)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Twitter Follow](https://img.shields.io/twitter/follow/rondinif.svg?style=social&label=Follow)](https://twitter.com/rondinif)


[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=rondinif:phytojs-js&metric=alert_status)](https://sonarcloud.io/dashboard?id=rondinif:phytojs-js)
[![Sonarcloud coverage](https://sonarcloud.io/api/project_badges/measure?project=rondinif:phytojs-js&metric=coverage)](https://sonarcloud.io/dashboard?id=rondinif:phytojs-js)
[![Sonarcloud sqale_index](https://sonarcloud.io/api/project_badges/measure?project=rondinif:phytojs-js&metric=sqale_index)](https://sonarcloud.io/dashboard?id=rondinif:phytojs-js)

[![Sonarcloud security_rating](https://sonarcloud.io/api/project_badges/measure?project=rondinif:phytojs-js&metric=security_rating)](https://sonarcloud.io/dashboard?id=rondinif:phytojs-js)
[![Sonarcloud sqale_rating](https://sonarcloud.io/api/project_badges/measure?project=rondinif:phytojs-js&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=rondinif:phytojs-js)
[![Sonarcloud reliability_rating](https://sonarcloud.io/api/project_badges/measure?project=rondinif:phytojs-js&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=rondinif:phytojs-js)

<a title="Powered by WIKIDATA - under cc0 licence; badge by Charlie Kritschmar (WMDE) [CC0], via Wikimedia Commons" href="https://www.wikidata.org/wiki/Wikidata:Data_access/en"><img height="30" alt="Powered by WIKIDATA" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Wikidata_stamp_rec.png/150px-Wikidata_stamp_rec.png"></a> (... so close to 100% 💪)

A modern javascript library to search about plants on open data
- The prefix [phyto-](https://en.wiktionary.org/wiki/phyto-) , comes from Ancient Greek φυτόν (phutón, “plant”), is used when something is **pertaining** to or derived from **plants**.
- [js](https://en.wiktionary.org/wiki/js) is the abbreviation of **javascript**. 

## Install
``` bash 
npm i @rondinif/phytojs --save
```
## Usage
see below at the examples section...

are you impatient? ... become a PhytoJS ninja by training [PhytoJS and pReact tutorial](https://codepen.io/collection/DPKJKN/) or fork one of these [newest PhytoJS pens](https://codepen.io/search/pens?q=phytojs&page=1&order=newest&depth=everything) learn and play by forking one of these [newest PhytoJS pens](https://codepen.io/search/pens?q=phytojs&page=1&order=newest&depth=everything)

Designed to be used anywhere, runs in the browser but if you prefer to experience PhytoJs "server side" you can start your personal livecoding journey by forking [a basic example that shows how to use `@rondinif/phytojs` npm package in RunKit a get development an API endpoint](https://runkit.com/rondinif/phytojs-api)

<!--
TODO: API cached ( Azure Function )
TODO: Build time webpack pug plugin
-->


## Development

Clone the package and install the npm dependencies with `npm i`.

```
git clone https://github.com/rondinif/phytojs.git
cd phytojs
npm i
```

### Build & Test & Coverage
``` bash
npm run clean:prepare:cover
```
<!-- TODO add postprocessing to fix import in `umd/phyto.js` to fix import to ./ (current dir) instead of ../esm -->

### Unit tests
``` bash
npm test
# to execute specific test suites: 
npm run test-main
npm run test-config
npm run test-config-stubbed
npm run test-odla
npm run test-odla-special
npm run test-odla-stubbed
npm run test-odla-sandboxed
```

<!--
### Linting

Run `npm run lint`

## Why
-->

## Examples
# [PhytoJS Samples for NodeJS](https://github.com/rondinif/phytojs/tree/master/samples) 
There are examples that use both `require` and `import` to reference the PhytoJS servive module. 
- UMD (Universal Module Definition)
    - `AMD` and `CJS` (`CommonJS`) are both compatible with `UMD`
- ESM / ES6 (ECMAScript.next and TC39 Module Definition)
# [PhytoJS Samples for the browser](https://github.com/rondinif/phytojs/tree/master/docs)
## Live [Demo of PhytoJS running in the browser](https://rondinif.github.io/phytojs/mvc)
[video demo available](https://youtu.be/kzvMT4TYiZk)

[![demo video](https://img.youtube.com/vi/kzvMT4TYiZk/0.jpg)](https://youtu.be/kzvMT4TYiZk "demo")
## Play & Learn by these codepens: [PhytoJS & pReact tutorial](https://codepen.io/collection/DPKJKN/)
.. more pens linked in the [samples for the browser section](https://github.com/rondinif/phytojs/tree/master/docs)

# ServerSide PhytoJS Samples for NodeJS
``` js
const phytojs = require("@rondinif/phytojs/umd/phyto");
const fetch = require('isomorphic-fetch');
const _ = new phytojs.Phyto(fetch);;
const q = await _.sparqlScientificNameById('Q134283');
q.results.bindings[0].scientificname.value;
```
- [Trivial Runkit PhytoJs endpoint example](https://runkit.com/rondinif/phytojs-rosmarino) 
- [PhytoJs Express API endpoint in RunKit](https://runkit.com/rondinif/phytojs-api)

### Contributing
Simply [we encourage contributions from everyone](https://github.com/rondinif/phytojs/blob/master/.github/CONTRIBUTING.md)

## Licence 
[MIT Licence - Copyright (c) 2019 Franco Rondini](https://raw.githubusercontent.com/rondinif/phytojs/master/LICENSE)
