'use strict';
import {Log} from '../esm/log';
import {makeGetPromiseOfWikiDataApiResults, makeGetPromiseOfSparqlResults} from './lib/open-data-async-factories';
import {openDataPromisesFactories, openDataEndpointFactories} from './lib/open-data-logic-agent';

// https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/
/**
 * This is a description of the Phyto constructor function.
 * @class
 * @classdesc This is a description of the Phyto class.
 */
export class Phyto {
	/**
    * @constructor
    * @param {Function} fetch - a fetch function possibly polymorphic
    * @param {object} config - a configuration object isomorph with @rondinif/phytojs/esm/config
    * @param {object} log - a logger object isomorph with @rondinif/phytojs/esm/log
    * @param {object} logconfig - a configuration object dor the logger, isomorph with @rondinif/phytojs/esm/logconfig
    */
	constructor(fetch, config, log, logconfig) {
		this._effectiveConfig = (typeof config === 'undefined') ? {isUnderTest: () => false} : config;
		this._effectiveLog = (typeof log === 'undefined') ? new Log((typeof logconfig === 'undefined') ? {isLogVerbose: () => false, isLogSilent: () => true} : logconfig) : log;

		const _ff = makeGetPromiseOfWikiDataApiResults(fetch, this._effectiveLog);
		const _ffSparql = makeGetPromiseOfSparqlResults(fetch, this._effectiveLog);

		this._wdSearchByAnyName = openDataPromisesFactories.makeWdSearchByAnyName(_ff, this._effectiveConfig, this._effectiveLog);
		this._wdPlantsByAnyName = openDataPromisesFactories.makeWdPlantsByAnyName(_ff, this._effectiveConfig, this._effectiveLog);
		this._resolvedPlantsByName = openDataPromisesFactories.makeResolvedPlantsByName(_ff, _ffSparql, this._effectiveConfig, this._effectiveLog);
		this._sparqlScientificNameById = openDataPromisesFactories.makeSparqlScientificNameById(_ffSparql, this._effectiveConfig, this._effectiveLog);

		this._wdEndpointUri = openDataEndpointFactories.makeWdEndpointUri(this._effectiveConfig, this._effectiveLog);
		this._sparqlEndpointUri = openDataEndpointFactories.makeSparqlEndpointUri(this._effectiveConfig, this._effectiveLog);
	}

	// SECTION which concerns: `openDataPromisesFactories`

	/**
    * @param {string} name - the `name` or any `term` for which the wikidata search will be carried out
    * @return {Promise} - a Promise of the search results; @see [tests](https://github.com/rondinif/phytojs/blob/master/test/lib/) and [expectations](https://github.com/rondinif/phytojs/tree/master/test/fixture/lib/OpenDataLogicAgent/wdSearchByAnyName)
    */
	wdSearchByAnyName(name) {
		return this._wdSearchByAnyName(name);
	}

	/**
    * @param {string} name - the `name` of the plant for which the odla search will be carried out
    * @return {Promise} - a Promise of the search results; @see [tests](https://github.com/rondinif/phytojs/blob/master/test/lib/) and [expectations](https://github.com/rondinif/phytojs/tree/master/test/fixture/lib/OpenDataLogicAgent/wdPlantsByAnyName)
    */
	wdPlantsByAnyName(name) {
		return this._wdPlantsByAnyName(name);
	}

	/**
    * @param {string} name - the `name` of the plant for which the odla re-solver will go to find valid entities uniquely identifiable by means of an `id` and a `scientific-name`
    * @return {Promise} - a Promise of results with the list resolved plants; @see [tests](https://github.com/rondinif/phytojs/blob/master/test/lib/) and [expectations](https://github.com/rondinif/phytojs/tree/master/test/fixture/lib/OpenDataLogicAgent/resolvedPlantsByName)
    */
	resolvedPlantsByName(name) {
		return this._resolvedPlantsByName(name);
	}

	/**
    * @param {string} id - the `id` of the entitity for which the odla re-solver will go to find valid `scientific-name`
    * @return {Promise} - a Promise of results with the list of `scientific-name` of the resolved plants; @see [tests](https://github.com/rondinif/phytojs/blob/master/test/lib/) and [expectations](https://github.com/rondinif/phytojs/tree/master/test/fixture/lib/OpenDataLogicAgent/sparqlScientificNameById)
    */
	sparqlScientificNameById(id) {
		return this._sparqlScientificNameById(id);
	}

	// SECTION which concerns: `openDataEndpointFactories`

	/**
    * @return {string} - the `SPARQL endpoint` which will be used by the `OpenDataLogicAgent`
    */
	getSparqlEndpointUri() {
		return this._sparqlEndpointUri();
	}

	/**
    * @return {string} - the `Wikidata API endpoint` which will be used by the `OpenDataLogicAgent`
    */
	getWikiDataApiEndpointUri() {
		return this._wdEndpointUri();
	}

	/**
    * @return {object} - the effective `configuration` which will be used by the `OpenDataLogicAgent`
    */
	config() {
		return this._effectiveConfig;
	}

	/**
    * @return {object} - the effective `logger` which will be used by the `OpenDataLogicAgent`
    */
	logger() {
		// #DEBUG console.log(`####:${this._effectiveLog}`);
		return this._effectiveLog;
	}
}
