"use strict"
//TODO the boilerplate should be auto-generated avoiding human errors
import {makeGetPromiseOfWikiDataApiResults, makeGetPromiseOfSparqlResults} from './lib/OpenDataAsyncFactories.mjs';
import { openDataPromisesFactories } from './lib/OpenDataLogicAgent.mjs';  

// https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/
/**
 * This is a description of the Phyto constructor function.
 * @class
 * @classdesc This is a description of the Phyto class.
 */
export class Phyto {

    /**
    * @constructor
    * @param {Function} fetch
    * @param {Function} config
    * @param {Function} logger
    */
    constructor(fetch, config, log) {
      const _ff = makeGetPromiseOfWikiDataApiResults(fetch);
      const _ffSparql = makeGetPromiseOfSparqlResults(fetch);
      
      this._wdSearchByAnyName = openDataPromisesFactories.makeWdSearchByAnyName(_ff, config, log);
      this._wdPlantsByAnyName = openDataPromisesFactories.makeWdPlantsByAnyName(_ff, config, log);
      this._resolvedPlantsByName = openDataPromisesFactories.makeResolvedPlantsByName(_ff, _ffSparql, config, log);
      this._sparqlScientificNameById = openDataPromisesFactories.makeSparqlScientificNameById( _ffSparql, config, log);
    }

    /*
    get ready() {
        return this._ready;
    }
    */

    /**
    * @param {string} name
    * @return {Promise}
    */
    wdSearchByAnyName(name) {
      return this._wdSearchByAnyName(name);
    }

    /**
    * @param {string} name
    * @return {Promise}
    */
    wdPlantsByAnyName(name) {
        return this._wdPlantsByAnyName(name);
    }

    /**
    * @param {string} name
    * @return {Promise}
    */
    resolvedPlantsByName(name) {
        return this._resolvedPlantsByName(name);
    }

    /**
    * @param {string} id
    * @return {Promise}
    */
    sparqlScientificNameById(id) {
        return this._sparqlScientificNameById(id);
    } 
}
