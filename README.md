# PhytoJS: @rondinif/phytojs
[![Travis build status](http://img.shields.io/travis/rondinif/phytojs/master.svg?style=flat-square)](https://travis-ci.org/rondinif/phytojs)
[![Coveralls](https://img.shields.io/coveralls/rondinif/phytojs.svg?style=flat-square)](https://coveralls.io/github/rondinif/phytojs)
[![NPM version](https://img.shields.io/npm/v/@rondinif/phytojs.svg?style=flat-square)](https://www.npmjs.org/package/@rondinif/phytojs)
[![Twitter Follow](https://img.shields.io/twitter/follow/rondinif.svg?style=social&label=Follow)](https://twitter.com/rondinif)


A modern javascript library to search about plants on open data
- The prefix [phyto-](https://en.wiktionary.org/wiki/phyto-) , comes from Ancient Greek φυτόν (phutón, “plant”), is used when something is **pertaining** to or derived from **plants**.
- [js](https://en.wiktionary.org/wiki/js) is the abbreviation of **javascript**. 

## Install
``` bash 
npm i @rondinif/phytojs --save
```
## Usage
see below at the examples section...

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
[![demo video](http://img.youtube.com/vi/kzvMT4TYiZk/0.jpg)](https://youtu.be/kzvMT4TYiZk "demo")

### Contributing
Simply [we encourage contributions from everyone](https://github.com/rondinif/phytojs/blob/master/.github/CONTRIBUTING.md)
