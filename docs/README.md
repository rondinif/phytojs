# PhytoJS Samples for the web browser
[./docs](https://github.com/rondinif/phytojs/tree/master/docs) has *use-cases* for the web browser, if you're looking for examples to run in nodejs please look at the [./docs](https://github.com/rondinif/phytojs/tree/master/docs) folder; if you're looking for the documentation of the PhytoJS service component please look at the project [./README.md](https://github.com/rondinif/phytojs/blob/master/README.md)  

## Vanillajs (ECMAScript.next) MVC Example
[Live Demo](https://rondinif.github.io/rondinif/phytojs)
[demo sources](https://github.com/rondinif/phytojs/tree/master/docs/mvc)

Will work in your browser in these cases:

<ul>
<li>Safari 10.1.</li>
<li>Chrome 61.</li>
<li>Firefox 54 – behind the <code>dom.moduleScripts.enabled</code> setting in <code>about:config</code>.</li>
<li>Edge 15 – behind the Experimental JavaScript Features setting in <code>about:flags</code>.</li>
</ul>

### development
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