"use strict"
//TODO the boilerplate should be auto-generated avoiding human errors
import {makeGetPromiseOfWikiDataApiResults, makeGetPromiseOfSparqlResults} from './lib/OpenDataAsyncFactories.mjs';
import { openDataPromisesFactories, openDataEndpointFactories } from './lib/OpenDataLogicAgent.mjs';  

/*
import { config as defaultConfig } from './config/config';
import { logconfig } from './config/logconfig';
import { Log as DefaultLog } from './log/log';
*/ 
import { config } from '../esm/config'
import { logconfig } from '../esm/logconfig'
import { Log } from '../esm/log' 

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
    constructor(fetch, config$1, log) {
//      let effectiveConfig = (typeof config == 'undefined') ? defaultConfig : config;
//      let effectiveLog = (typeof log == 'undefined') ? new DefaultLog(logconfig) : log; 
      let effectiveConfig = (typeof config$1 == 'undefined') ? (typeof config == undefined) ? {isUnderTest: () => false } : config  : config$1;
      let effectiveLog = (typeof log == 'undefined') ? new Log((typeof logconfig == undefined) ? {isLogVerbose: () => false, isLogSilent: () => true } : logconfig) : log; 


      const _ff = makeGetPromiseOfWikiDataApiResults(fetch, effectiveLog);
      const _ffSparql = makeGetPromiseOfSparqlResults(fetch, effectiveLog);
      
      this._wdSearchByAnyName = openDataPromisesFactories.makeWdSearchByAnyName(_ff, effectiveConfig, effectiveLog);
      this._wdPlantsByAnyName = openDataPromisesFactories.makeWdPlantsByAnyName(_ff, effectiveConfig, effectiveLog);
      this._resolvedPlantsByName = openDataPromisesFactories.makeResolvedPlantsByName(_ff, _ffSparql, effectiveConfig, effectiveLog);
      this._sparqlScientificNameById = openDataPromisesFactories.makeSparqlScientificNameById( _ffSparql, effectiveConfig, effectiveLog);

      this._wdEndpointUri = openDataEndpointFactories.makeWdEndpointUri(effectiveConfig, effectiveLog);
      this._sparqlEndpointUri = openDataEndpointFactories.makeSparqlEndpointUri(effectiveConfig, effectiveLog);
    }

    // SECTION which concerns: `openDataPromisesFactories`  

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

    // SECTION which concerns: `openDataEndpointFactories`

    /**
    * @return {string}
    */
    getSparqlEndpointUri() {
        return this._sparqlEndpointUri(); 
    }

    /**
    * @return {string}
    */
   getWikiDataApiEndpointUri() {
        return this._wdEndpointUri(); 
    }

}
