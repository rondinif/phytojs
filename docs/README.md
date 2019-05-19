# PhytoJS Samples for the web browser
[./docs](../docs) has *use-cases* for the web browser, if you're looking for examples to run in nodejs please look at the [./docs](../docs folder; if you're looking for the documentation of the PhytoJS service component please look at the project [./README.md](../readme.md)  

## Vanillajs (ECMAScript.next) MVC Example
[Live Demo](https://rondinif.github.io/rondinif/phytojs)
[demo sources](./docs/mvc)
``` bash 
# this demo require http-server; if you haven't install it `npm i http-server -g`
npm start 
# then navigate to http://localhost:8080 
```



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