# PhytoJS Samples for NodeJS
[./samples](../samples) has *use-cases* for nodejs, if you're looking for examples to run in browsers please look at the [./docs](../docs folder.  

### CLI Samples
#### UMD (Universal Module Definition) sample
`AMD` and `CJS` (`CommonJS`) are both compatible with `UMD`.

##### run UMD example that uses `require`.
``` bash 
node  ./samples/index.umd.js
npm run sample-umd
```
##### run UMD example that uses `import`.
``` bash 
node  -r esm ./samples/index.umd.esm.js
npm run sample-umd-esm
```
##### run ESM example.
``` bash 
node -r esm samples/index.esm.js
npm run sample-esm
```


<!-- ## REST API Samples -->