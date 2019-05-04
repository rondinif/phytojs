# PhytoJS: @rondinif/phytojs
A modern javascript library to search about plants on open data
- The prefix [phyto-](https://en.wiktionary.org/wiki/phyto-) , comes from Ancient Greek φυτόν (phutón, “plant”), is used when something is **pertaining** to or derived from **plants**.
- [js](https://en.wiktionary.org/wiki/js) is the abbreviation of **javascript**. 

## Install
``` bash 
npm i @rondinif/phytojs --save
```
## Usage
see below at the examples section...

## Develop

Clone the package and install the npm dependencies with `npm i`.

```
git clone https://github.com/rondinif/phytojs.git
cd phytojs
npm i
```

### Build
``` bash
npm run prepare
```

### Unit tests
``` bash
npm test
```
<!--
### Linting

Run `npm run lint`

## Why
-->

### Examples
#### UMD (Universal Module Definition) sample
`AMD` and `CJS` (`CommonJS`) are both compatible with `UMD`.

##### run UMD example that uses `require`.
``` bash 
node  ./samples/index.umd.js
```
##### run UMD example that uses `import`.
``` bash 
node  -r esm ./samples/index.umd.esm.js
```
##### run ESM example.
``` bash 
node  -r esm ./samples/index.esm.js
```
