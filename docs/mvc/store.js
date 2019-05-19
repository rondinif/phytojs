import {remove} from './helpers.js'
export default Store

/**
 * Creates a new client side storage object and will create an empty
 * collection if no collection already exists.
 *
 * @param {string} name The name of our DB we want to use
 * @param {function} callback Our fake DB uses callbacks because in
 * real life you probably would be making AJAX calls
 */
function Store(name, callback) {
  callback = callback || function() {
  }

  this._dbName = name

  if (!localStorage[name]) {
    var data = {
      plants: []
    }

    localStorage[name] = JSON.stringify(data)
  }

  callback.call(this, JSON.parse(localStorage[name]))
  this.subscribers = []
}

Store.prototype.subscribe = function(subscriber) {
  this.subscribers.push(subscriber)
  return () => remove(this.subscribers, subscriber)
}

Store.prototype._notify = function() {
  this.subscribers.forEach(s => s())
}

/**
* Finds items based on a query given as a JS object
*
* @param {object} query The query to match against (i.e. {foo: 'bar'})
* @param {function} callback   The callback to fire when the query has
* completed running
*
* @example
* db.find({foo: 'bar', hello: 'world'}, function (data) {
*   // data will return any items that have foo: bar and
*   // hello: world in their properties
* });
*/
Store.prototype.find = function(query, callback) {
  if (!callback) {
    return
  }

  var plants = JSON.parse(localStorage[this._dbName]).plants

  callback.call(this, plants.filter(function(plant) {
    for (var q in query) {
      if (query[q] !== plant[q]) {
        return false
      }
    }
    return true
  }))
}

/**
* Will retrieve all data from the collection
*
* @param {function} callback The callback to fire upon retrieving data
*/
Store.prototype.findAll = function(callback) {
  callback = callback || function() {
  }
  callback.call(this, JSON.parse(localStorage[this._dbName]).plants)
}

/**
* Will save the given data to the DB. If no item exists it will create a new
* item, otherwise it'll simply update an existing item's properties
*
* @param {object} updateData The data to save back into the DB
* @param {function} callback The callback to fire after saving
* @param {number} id An optional param to enter an ID of an item to update
*/
Store.prototype.save = function(updateData, callback, id) {
  var data = JSON.parse(localStorage[this._dbName])
  var plants = data.plants

  callback = callback || function() {
  }

  // If an ID was actually given, find the item and update each property
  if (id) {
    console.log(`store.save: <b0s1> updateData:${JSON.stringify(updateData)}`)
    for (var i = 0; i < plants.length; i++) {
      if (plants[i].id === id) {
        for (var key in updateData) { // eslint-disable-line guard-for-in
          plants[i][key] = updateData[key]
        }
        break
      }
    }

    localStorage[this._dbName] = JSON.stringify(data)
    callback.call(this, JSON.parse(localStorage[this._dbName]).plants)
  } else {
    // updateData is the data received from `model.createPlant` (a plant + an id and a completed flag)
    console.log(`store.save: <b1s1> updateData:${JSON.stringify(updateData)}`)
    // DO NOT Generate an ID - it was received from model
    // updateData.id = updateData.entityId // new Date().getTime()
    console.log(`store.save: <b1s2> updateData:${JSON.stringify(updateData)}`)
    if ((updateData.plant.image) === undefined) {
      updateData.completed = true
    }
    let isPlantAlreadyStored = false 
    for (var i = 0; i < plants.length; i++) {
      if (plants[i].id === updateData.id) {
        isPlantAlreadyStored = true
        plants[i].completed = false
        break
      }
    }
    if ( isPlantAlreadyStored ) {
      console.log(`store.save: <b1s4> already stored:${updateData.id})`)
    } else {
      plants.push(updateData)
      console.log(`store.save: <b1s3> plants:${JSON.stringify(plants)}`)
      console.log(`store.save: <b1s3> data:${JSON.stringify(data)}`)
    } 
    localStorage[this._dbName] = JSON.stringify(data)
    callback.call(this, [updateData])
  }
  this._notify()
}

/**
* Will remove an item from the Store based on its ID
*
* @param {number} id The ID of the item you want to remove
* @param {function} callback The callback to fire after saving
*/
Store.prototype.remove = function(id, callback) {
  var data = JSON.parse(localStorage[this._dbName])
  var plants = data.plants

  for (var i = 0; i < plants.length; i++) {
    if (plants[i].id === id) {
      plants.splice(i, 1)
      break
    }
  }

  localStorage[this._dbName] = JSON.stringify(data)
  callback.call(this, JSON.parse(localStorage[this._dbName]).plants)
  this._notify()
}

/**
* Will drop all storage and start fresh
*
* @param {function} callback The callback to fire after dropping the data
*/
Store.prototype.drop = function(callback) {
  localStorage[this._dbName] = JSON.stringify({plants: []})
  callback.call(this, JSON.parse(localStorage[this._dbName]).plants)
  this._notify()
}
