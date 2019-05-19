import View from './view.js'
import Controller from './controller.js'
import Model from './model.js'
import Store from './store.js'
import Template from './template.js'
import {remove} from './helpers.js'

export {updatePhyto, getPhyto, subscribe}

let phyto
const subscribers = []

/**
 * Sets up a brand new Phyto list.
 *
 * @param {string} name The name of your new phyto list.
 */
function Phyto(name) {
  this.storage = new Store(name)
  this.model = new Model(this.storage)
  this.template = new Template()
  this.view = new View(this.template)
  this.controller = new Controller(this.model, this.view)
}

function updatePhyto() {
  phyto = new Phyto('phytojs-store')
  phyto.controller.setView(document.location.hash)
  subscribers.forEach(s => s())
}

function getPhyto() {
  return phyto
}

function subscribe(cb) {
  subscribers.push(cb)
  return function unsubscribe() {
    remove(subscribers, cb)
  }
}
