import { Phyto } from '../esm/phyto.js';

export default Controller

/**
* Takes a model and view and acts as the controller between them
*
* @constructor
* @param {object} model The model instance
* @param {object} view The view instance
*/
function Controller(model, view) {
  var that = this
  that.model = model
  that.view = view

  that.view.bind('newPhyto', function(name) {
    that.phytoResolve(name)
  })
/*
  that.view.bind('itemEdit', function(item) {
    that.editItem(item.id)
  })

  that.view.bind('itemEditDone', function(item) {
    that.editItemSave(item.id, item.title)
  })

  that.view.bind('itemEditCancel', function(item) {
    that.editItemCancel(item.id)
  })
*/
  that.view.bind('itemRemove', function(item) {
    console.log(item);
    that.removeItem(item.id)
  })

  that.view.bind('itemToggle', function(item) {
    that.toggleComplete(item.id, item.completed)
  })

  that.view.bind('removeCompleted', function() {
    that.removeCompletedItems()
  })

  that.view.bind('toggleAll', function(status) {
    that.toggleAll(status.completed)
  })
}

/**
* Loads and initialises the view
*
* @param {string} '' | 'active' | 'completed'
*/
Controller.prototype.setView = function(locationHash) {
  var route = locationHash.split('/')[1]
  var page = route || ''
  this._updateFilterState(page)
}

/**
* An event to fire on load. Will get all items and display them in the
* plant-list
*/
Controller.prototype.showAll = function() {
  var that = this
  that.model.read(function(data) {
    that.view.render('showEntries', data)
  })
}

/**
* Renders all active tasks
*/
Controller.prototype.showActive = function() {
  var that = this
  that.model.read({completed: false}, function(data) {
    that.view.render('showEntries', data)
  })
}

/**
* Renders all completed tasks
*/
Controller.prototype.showCompleted = function() {
  var that = this
  that.model.read({completed: true}, function(data) {
    that.view.render('showEntries', data)
  })
}

/**
* An event to fire whenever you want to add an item. Simply pass in the event
* object and it'll handle the DOM insertion and saving of the new item.
*/
Controller.prototype.phytoResolve = function(name) {
  console.log(`Controller.phytoResolve ${name}`)
  var that = this

  if (name.trim() === '') {
    return
  }

  const fetch = window.fetch;
  let log = console;
  log.trace = log.log;
  const config = { isUnderTest: () => false };
  const _ = new Phyto(fetch, config, log);
  
  that.view.render('loaderBlockVisibility', {visible: true})
  _.resolvedPlantsByName(name).then(async res => {
    /* res: @see https://github.com/rondinif/phytojs/tree/master/test/fixture/lib/OpenDataLogicAgent/resolvedPlantsByName for schema and sample data  */
      const plants = res.plants.map((plant) => {
              that.model.createPlant(plant, () => {
                that.view.render('clearNewPhyto')
                that._filter(true)
              })  
          return { plant };
          });
      that.view.render('loaderBlockVisibility', {visible: false})
      // console.log(plants);
  }).catch(error => {
      console.error(`generic error: ${error} \n searching for ${name || 'nothing'}`)
      that.view.render('loaderBlockVisibility', {visible: false})
      // that.view.render('errorBlockVisibility', {visible: true})
  });        

  }

/*
* Triggers the item editing mode.
*/
/*
Controller.prototype.editItem = function(id) {
  var that = this
  that.model.read(id, function(data) {
    that.view.render('editItem', {id, title: data[0].scientificName})
  })
}
*/

/*
* Finishes the item editing mode successfully.
*/
/*
Controller.prototype.editItemSave = function(id, title) {
  var that = this
  if (title.trim()) {
    that.model.update(id, {title}, function() {
      that.view.render('editItemDone', {id, title})
    })
  } else {
    that.removeItem(id)
  }
}
*/ 

/*
* Cancels the item editing mode.
*/
/*
Controller.prototype.editItemCancel = function(id) {
  var that = this
  that.model.read(id, function(data) {
    that.view.render('editItemDone', {id, title: data[0].title})
  })
}
*/ 

/**
* By giving it an ID it'll find the DOM element matching that ID,
* remove it from the DOM and also remove it from storage.
*
* @param {number} id The ID of the item to remove from the DOM and
* storage
*/
Controller.prototype.removeItem = function(id) {
  var that = this
  that.model.remove(id, function() {
    that.view.render('removeItem', id)
  })

  that._filter()
}

/**
* Will remove all completed items from the DOM and storage.
*/
Controller.prototype.removeCompletedItems = function() {
  var that = this
  that.model.read({completed: true}, function(data) {
    data.forEach(function(item) {
      that.removeItem(item.id)
    })
  })

  that._filter()
}

/**
* Give it an ID of a model and a checkbox and it will update the item
* in storage based on the checkbox's state.
*
* @param {number} id The ID of the element to complete or uncomplete
* @param {object} checkbox The checkbox to check the state of complete
*                          or not
* @param {boolean|undefined} silent Prevent re-filtering the plant items
*/
Controller.prototype.toggleComplete = function(id, completed, silent) {
  var that = this
  that.model.update(id, {completed}, function() {
    that.view.render('elementComplete', {
      id,
      completed,
    })
  })

  if (!silent) {
    that._filter()
  }
}

/**
* Will toggle ALL checkboxes' on/off state and completeness of models.
* Just pass in the event object.
*/
Controller.prototype.toggleAll = function(completed) {
  var that = this
  that.model.read({completed: !completed}, function(data) {
    data.forEach(function(item) {
      that.toggleComplete(item.id, completed, true)
    })
  })

  that._filter()
}

/**
* Updates the pieces of the page which change depending on the remaining
* number of plants.
*/
Controller.prototype._updateCount = function() {
  var that = this
  that.model.getCount(function(plants) {
    that.view.render('updateElementCount', plants.active)
    that.view.render('clearCompletedButton', {
      completed: plants.completed,
      visible: plants.completed > 0
    })

    that.view.render('toggleAll', {checked: plants.completed === plants.total})
    that.view.render('contentBlockVisibility', {visible: plants.total > 0})
  })
}

/**
* Re-filters the plant items, based on the active route.
* @param {boolean|undefined} force  forces a re-painting of plant items.
*/
Controller.prototype._filter = function(force) {
  var activeRoute = this._activeRoute.charAt(0).toUpperCase() + this._activeRoute.substr(1)

  // Update the elements on the page, which change with each completed plant
  this._updateCount()

  // If the last active route isn't "All", or we're switching routes, we
  // re-create the plant item elements, calling:
  //   this.show[All|Active|Completed]();
  if (force || this._lastActiveRoute !== 'All' || this._lastActiveRoute !== activeRoute) {
    this['show' + activeRoute]()
  }

  this._lastActiveRoute = activeRoute
}

/**
* Simply updates the filter nav's selected states
*/
Controller.prototype._updateFilterState = function(currentPage) {
  // Store a reference to the active route, allowing us to re-filter plant
  // items as they are marked complete or incomplete.
  currentPage = currentPage.split('?')[0]
  this._activeRoute = currentPage

  if (currentPage === '') {
    this._activeRoute = 'All'
  }

  this._filter()

  this.view.render('setFilter', currentPage)
}
