### Introduction to the PhytoJS package
Welcome to `PhytoJS`, a modern javascript toolkit to search about plants on open data. 

- The prefix [phyto-](https://en.wiktionary.org/wiki/phyto-) , comes from ancient greek φυτόν (phutón, “plant”), is used when something is **pertaining** to or derived from **plants**.
- [js](https://en.wiktionary.org/wiki/js) is the abbreviation of **javascript**. 

#### About PhytoJS documentation 
This documentation is still a work in progress,nevertheless it could help to understand what PhytoJS consists of, how to use the library and what are the APIs it provides.
#### Why should this project interest me?
The development of PhytoJS has a single goal: gain experience by experimenting with emerging and gain experience by experimenting with interesting software engineering practices and enjoy the benefits that can be obtained through them.
This can be done by having fun with an area of interest as pleasant and important as the world of flowers, vegetables and plants. 

Collaborating together in the development of `PhytoJS` it's an opportunity to learn a lot of new things and share them with fellow friends and the community


<!--
##### “Do one thing and do it well” 
There are some principles that inspire the design and implementation of the project. 
You can know more by reading [Principles and Patterns](https://web.archive.org/web/20150906155800/http://www.objectmentor.com/resources/articles/Principles_and_Patterns.pdf) and [Twelve-Factor App methodology](https://12factor.net)
if you think there are points where this does not happen correctly or can be improved you should immediately [open an new issue](https://github.com/rondinif/phytojs/issues) and express your idea.
<!--
[Twelve-Factor_App_methodology](https://en.wikipedia.org/wiki/Twelve-Factor_App_methodology) [Q197857](single responsibility principle) 
-->
#### How to use the PhytoJS's algorithms as a dependency or service component for my programs 

`PhytoJS` is [released as a package](https://www.npmjs.com/package/@rondinif/phytojs) and can easily be exploited by other projects thaks to popular package manager such as `npm` or `yarm`.

`PhytoJS` was designed to (theoretically) work whatever the use case,as long as the application in in the Javascript or Typescript ecosystem, as long as the application in in the Javascript or Typescript ecosystem, it could be used in: 
- Front-end and browser scripts
- Command line interface (CLI) applications
- Desktop (GUI) applications
- Mobile applications
- Back-end development
- In the build or continous integration phases
- Any combination of the above

### Some examples of how this library could apply in your projects 
#### [PhytoJS Samples for NodeJS](https://github.com/rondinif/phytojs/tree/master/samples) 
There are examples that use both `require` and `import` to reference the PhytoJS servive module. 
- UMD (Universal Module Definition)
    - `AMD` and `CJS` (`CommonJS`) are both compatible with `UMD`
- ESM / ES6 (ECMAScript.next and TC39 Module Definition)
#### [PhytoJS Samples for the browser](https://github.com/rondinif/phytojs/tree/master/docs)
#### Live [Demo of PhytoJS running in the browser](https://rondinif.github.io/phytojs/mvc)
[video demo available](https://youtu.be/kzvMT4TYiZk) 
[![demo video](http://img.youtube.com/vi/kzvMT4TYiZk/0.jpg)](https://youtu.be/kzvMT4TYiZk "demo")
#### Play & Learn by these codepens: [PhytoJS & pReact tutorial](https://codepen.io/collection/DPKJKN/)
.. more pens linked in the [samples for the browser section](https://github.com/rondinif/phytojs/tree/master/docs)

#### ServerSide PhytoJS Samples for NodeJS
- [Trivial Runkit PhytoJs endpoint example](https://runkit.com/rondinif/phytojs-rosmarino) 
- [PhytoJs Express API endpoint in RunKit](https://runkit.com/rondinif/phytojs-api)


#### What's in `PhythoJS` the library 
Let's start with the main [Phyto](#phyto) class or jump directly to its most useful methods:

- [resolvedPlantsByName](#resolvedplantsbyname)
- [wdSearchByAnyName](#wdsearchbyanyname)
- [wdPlantsByAnyName](#wdplantsbyanyname)
- [sparqlScientificNameById](#sparqlscientificnamebyid)
