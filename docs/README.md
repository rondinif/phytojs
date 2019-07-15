# PhytoJS Samples for the web browser
[./docs](https://github.com/rondinif/phytojs/tree/master/docs) has *use-cases* for the web browser, if you're looking for examples to run in nodejs please look at the [./samples](https://github.com/rondinif/phytojs/tree/master/samples) folder; if you're looking for the documentation of the PhytoJS service component please look at the project [./README.md](https://github.com/rondinif/phytojs/blob/master/README.md)  

## codepen.io interactive coding example
### [PhytoJS - how to import it as JS Module](https://codepen.io/collection/XgxGxb/)
Super simple examples to learn how to import PhytoJS as a JS Module on Codepen; 
Start here and have fun creating your application with PhytoJS

This collection ha only two pens  which differ from one another only by the vernacular name sought

1. [origano](https://codepen.io/rondinif/pen/gNJbKK)
2. [menta](https://codepen.io/rondinif/pen/agrzKm)

### [PhytoJS & pReact tutorial](https://codepen.io/collection/DPKJKN/)
<!-- tags: tutorial, preach, module, PhytoJS, garden,     
"botanica","botanical","flowers","grow vegetables","herbs","linked data","plants","rdf","spqrql","vegetables","vegetable garden","wikidata","wkbotanica" 

PhytoJS is a modern javascript library to search about plants on open data;

This pen is part of an introductory tutorial showing how easy it is to build powerful browser based applications with preact and phytojs

You can see step by step adding features to the page and have fun playing with styles or creating your first web application with PhytoJS
-->
Introductory tutorial showing how easy it is to build powerful browser based applications with preact and phytojs

You can see step by step adding features to the page and have fun playing with styles or creating your first web application with PhytoJS

1. [Search plants by vernacular name](https://codepen.io/rondinif/pen/JQqoeW)

    please [check the pen](https://codepen.io/rondinif/pen/JQqoeW) for basic scaffolding.

2. [Add taxon rank to each plant](https://codepen.io/rondinif/pen/WqBOJZ)
``` js       
return h("li", null, `${plant.scientificName}  - [${plant.taxonRankLabel}]`);
// instead of ..>
return h("li", null, plant.scientificName);
```         
3. [Add plant image and basic styles](https://codepen.io/rondinif/pen/ZdNgEm)
``` js
return 
    h("li", 
        {id: `${plant.wdEntityId}`, class: "plantTitle"}, 
        `${plant.scientificName}`,
    h("span",{class: "taxonRank"},` [${plant.taxonRankLabel}]`),
    h("img",{src: plant.image}));
```
4. [Add link to the plant page](https://codepen.io/rondinif/pen/vqqBOR)
``` js
return 
    h("li", 
        {id: plant.wdEntityId, class: "plantTitle"}, 
        h("a", 
            {href: plant.specieArticle, target:"_blank"},
            `${plant.scientificName}`),
        h("span",{class: "taxonRank"},` [${plant.taxonRankLabel}]`),
        h("img",{src: plant.image}));
```
## ... more and more pens
Follow the link to [search newest PhytoJS pens](https://codepen.io/search/pens?q=phytojs&page=1&order=newest&depth=everything)

## Vanillajs (ECMAScript.next) MVC Example
[Live Demo](https://rondinif.github.io/rondinif/phytojs)
[demo sources](https://github.com/rondinif/phytojs/tree/master/docs/mvc)

[![demo video](http://img.youtube.com/vi/kzvMT4TYiZk/0.jpg)](https://youtu.be/kzvMT4TYiZk "demo")

Will work in your browser in these cases:

<ul>
<li>Safari 10.1.</li>
<li>Chrome 61.</li>
<li>Firefox 54 – behind the <code>dom.moduleScripts.enabled</code> setting in <code>about:config</code>.</li>
<li>Edge 15 – behind the Experimental JavaScript Features setting in <code>about:flags</code>.</li>
</ul>

### Vanillajs development
``` bash 
# this demo require http-server; if you haven't it then install it: `npm i http-server -g`
npm start 
# then navigate to http://localhost:8080 
```
In any case this is a Single-Page Application (SPA) of static pages with browser friendly ES Modules therefore
you can choose to serve it the way you like; for example:
``` bash 
git clone https://github.com/rondinif/phytojs.git
cd ./phytojs/docs/mvc 
python -m SimpleHTTPServer
# Serving HTTP on 0.0.0.0 port 8000 ...
#  then navigate to http://localhost:8000 
```

### Acknowledgments

This example was created by [rondinif](https://github.com/rondinif) importing the PhytoJs library into a a Single-Page Application (SPA) inspired by the following works 
- (https://github.com/paulirish/es-modules-todomvc) by [Paul Irish](https://github.com/paulirish)
- (https://github.com/kentcdodds/es6-todomvc) by [Kent C. Dodds](https://github.com/kentcdodds)
under [MIT LICENCE](https://github.com/kentcdodds/es6-todomvc/blob/master/LICENSE) 

### Contributing
[we encourage contributions from everyone](https://github.com/rondinif/phytojs/blob/master/.github/CONTRIBUTING.md)
<!--
## JS 
./bootstrap.js
    - ./helpers.js
    - ./app.js 
        - ./phyto.js ( from witch import {updatePhyto} in app.js )
            - :=[has a]=> docs/view.js (bind + render = abstracts away the browser's DOM completely) 
                - phytoList
                - phytoItemCounter
                - newPhyto
                    ( instantiated with a ./template.js )
                      render(viewCmd, parameter) <<## riceve i vari diversi comandi dal controller 

                        - defaultTemplate
                        - show(data) - binds data to the template and shows (return) as a view
                        - clearCompletedButton(phyta)
                        - itemCounter
            - :=[has a]=> Store initiated with a name ( see store.js )
                - methods to manage local storage data:{ plsnts}
            - :=[has a]=> Model that receive the Store when instantiated
                :=[has a]=> Store initiate with a name ( see store.js )
                - create(entityId, callback)  save the new entityId into the Store ##> used by controller.addItem
                - read(query, callback) -- query the storage ##> used by controller.showAll, showCompleted
                - update(id, data, callback)
                - remove(id, callback)
                - removeAll
                - getCount
            - :=[has + => Controller initiated with  (model, view)
                - uses read/write to the storage by the model 
                - send render commands to the view
 

## CSS
./app.css
./pytoapp.css
    - todpapp       phytoapp
    - new-todo      new-phyto  
    - todo-list     phyto-list

-->