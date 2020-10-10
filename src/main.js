'use strict';
import {Log} from '../esm/log';
import {makeGetPromiseOfWikiDataApiResults, makeGetPromiseOfSparqlResults} from './lib/open-data-async-factories';
import {openDataPromisesFactories, openDataEndpointFactories} from './lib/open-data-logic-agent';

// [Why I've stopped exporting defaults from my JavaScript modules](https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/)
/**
 * PhytoJS
 * @module rondinif/phytojs
 * @description this module contains the Phyto class that has methods to simplify access to open data relating to the world of flowers, vegetables and plants by providing powerful search functions to obtain entities belonging to this data domain
 * @see module:rondinif/phytojs
 * the self contained code of this module promotes less clutter in the global namespace; the module pattern will typically push one object onto the global namespace, and all interaction with the module goes through this object.
 */

/**
 * main class to use as **PhytoJS application programming interface**. see *Instance Members* to learn about the features available and what each one of them does.
 * @example
 *
 * import 'isomorphic-fetch';
 * import { Phyto } from '@rondinif/phytojs';
 * const api = new Phyto(fetch);
 * api.resolvedPlantsByName('origano').then(async res => {
 *   console.log(JSON.stringify(res.plants));
 * });
 *
 * @class
 * @memberof module:rondinif/phytojs
 * @classdesc PhytoJS package main API class.
 */
export class Phyto {
	/**
    * @constructor
    * @param {Function} fetch - a *fetch function* possibly an **isomorphic** one; when code [runs in browsers](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) it could be `window.fetch` ,  or any compliant [standard fetch](https://fetch.spec.whatwg.org/); PhytoJS's tests are passed by using [isomorphic-fetch](https://www.npmjs.com/package/isomorphic-fetch)
		*
    * @param {object} [config={isUnderTest: () => false}] - an optional *configuration object* that has confifuration properties as defined in {@link config/config} @rondinif/phytojs/esm/config {@link config}
    * @param {object} [log=new Log()] - a logger object isomorph with @rondinif/phytojs/esm/log
    * @param {object} [logconfig={isLogVerbose: () => false, isLogSilent: () => true}] - a configuration object for the logger, isomorph with {@link config/logconfig} @rondinif/phytojs/esm/logconfig {@link logconfig}
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
    * @param {string} name - the `name` or any `term` for which the wikidata search will be carried out; read {@link Phyto#getWikiDataApiEndpointUri}  carefully and make sure you understand the recommendations regarding the use of data sources and endpoints for an aware use of this functionality.
    * @return {Promise} - a Promise of the search results; @see [tests](https://github.com/rondinif/phytojs/blob/master/test/lib/) and [expectations](https://github.com/rondinif/phytojs/tree/master/test/fixture/lib/OpenDataLogicAgent/wdSearchByAnyName)
    */
	wdSearchByAnyName(name) {
		return this._wdSearchByAnyName(name);
	}

	/**
	  * @method
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
	 * Bla Bla
	 * TODO ... completare con un Example
	 *
   * @param {string} id - the `id` of the entitity for which the odla re-solver will go to find valid `scientific-name`
	 * @return {Promise} - a Promise of results with the list of `scientific-name` of the resolved plant; see [tests](https://github.com/rondinif/phytojs/blob/master/test/lib/) and [expectations](https://github.com/rondinif/phytojs/tree/master/test/fixture/lib/OpenDataLogicAgent/sparqlScientificNameById)
	 */
	sparqlScientificNameById(id) {
		return this._sparqlScientificNameById(id);
	}

	// SECTION which concerns: `openDataEndpointFactories`

	/**
	 * The [URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier) of the [Web API enpoint](https://en.wikipedia.org/wiki/Web_API) used by PhytoJS to interface the [Wikidata Query Service](https://query.wikidata.org). The SPARQL endpoint URI is set by configuration; default behavior uses live endpoint only in production, while a virtualized service is used for tests.
	 *
	 * **Recommendation #1**:	Before using live endpoints make sure you have checked , accepted and agreed to the *Web API endpoint* service's *term of use*, *disclaimers*, *privacy policies* and *other conditions*; in this case see wikimedia.org-wiki [term of use](https://foundation.wikimedia.org/wiki/Terms_of_Use/en#Our_Terms_of_Use) and wikidata [disclaimer](https://www.wikidata.org/wiki/Wikidata:General_disclaimer)
	 *
	 * **Recommendation #2**: When the system is under test (or is at the development stage) the live endpoint should not be used; use a service virtualization tool instead with proxies support and record/replay behavior to easily capture data from origin server that the request should proxy to.  @see [service-virtualization](https://raw.githubusercontent.com/rondinif/phytojs/master/script/mbstart.sh) as a possible choice.
	 *
	 * @function
	 * @example
	 *
	 * import 'isomorphic-fetch';
	 * import { Phyto } from '@rondinif/phytojs';
	 * const api = new Phyto(fetch);
	 * console.log(api.getSparqlEndpointUri()); // > 'https://query.wikidata.org'
   * api.config().isUnderTest = () => true;
	 * console.log(api.getSparqlEndpointUri()); // > 'http://127.0.0.1:6569'
   *
   * @return {string} - the `SPARQL endpoint` which will be used by the `OpenDataLogicAgent`
   */
	getSparqlEndpointUri() {
		return this._sparqlEndpointUri();
	}

	/**
	 * The [URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier) of the [Web API enpoint](https://en.wikipedia.org/wiki/Web_API) used by PhytoJS to interface [MediaWiki API](https://www.wikidata.org/w/api.php). The Web API enpoint URI is set by configuration; default behavior uses live endpoint only in production, while a virtualized service is used for tests.
	 *
	 * **Recommendation #1**:	Before using live endpoints make sure you have checked , accepted and agreed to the *Web API endpoint* service's *term of use*, *disclaimers*, *privacy policies* and *other conditions*; in this case see wikimedia.org-wiki [term of use](https://foundation.wikimedia.org/wiki/Terms_of_Use/en#Our_Terms_of_Use) and wikidata [disclaimer](https://www.wikidata.org/wiki/Wikidata:General_disclaimer)
	 *
	 * **Recommendation #2**: When the system is under test (or is at the development stage) the live endpoint should not be used; use a service virtualization tool instead with proxies support and record/replay behavior to easily capture data from origin server that the request should proxy to.  @see [service-virtualization](https://raw.githubusercontent.com/rondinif/phytojs/master/script/mbstart.sh) as a possible choice.
	 *
	 * @function
	 * @example
	 *
	 * import 'isomorphic-fetch';
	 * import { Phyto } from '@rondinif/phytojs';
	 * const api = new Phyto(fetch);
	 * console.log(api.getWikiDataApiEndpointUri()); // > 'https://www.wikidata.org/w/api.php'
   * api.config().isUnderTest = () => true;
	 * console.log(api.getWikiDataApiEndpointUri()); // > 'http://127.0.0.1:6568/w/api.php'
   *
   * @return {string} - the `Wikidata API endpoint` which will be used by `OpenDataLogicAgent`
   */
	getWikiDataApiEndpointUri() {
		return this._wdEndpointUri();
	}

	/**
	 * Allow access to the configuration object;
	 * Use this *function* to inspect the current *logger configuration*
	 * or to change on the fly the the PhytoJS's api instance configuration settings (hot change).
	 * @function
	 * @example
	 *
	 * import 'isomorphic-fetch';
	 * import { Phyto } from '@rondinif/phytojs';
	 * const api = new Phyto(fetch);
	 * console.log(api.config().isUnderTest()); // > false
	 * api.config().isUnderTest = () => true;
	 * console.log(api.config().isUnderTest()); // > true
	 *
   * @return {object} - the effective `configuration` which will be used by the `OpenDataLogicAgent` PhytoJs internals.
  */
	config() {
		return this._effectiveConfig;
	}

	/**
	 * Allow access to the actual internal used *logger*
	 * Use this *function* to get the *logger* object actually used internally by PhytoJS; the *logger* object could  be used to inspect the current *logger configuration* or for logging by the same *logger* used by the PhytoJS's api instance.
	 * @function
	 * @example
	 *
	 * import 'isomorphic-fetch';
	 * import { Phyto } from '@rondinif/phytojs';
	 * const api = new Phyto(fetch);
	 * api.logger()._config.isLogSilent();
	 * //	true
	 * api.logger()._config.isLogVerbose();
	 * //	false
	 *
	 * // live change logger configuration settings
	 * api.logger()._config.isLogSilent = () => false;
	 * api.logger()._config.isLogSilent();
	 * // false
	 * api.logger().info(('this log information is written by the actual logger used by the API instance of PhytoJS');
	 * // this log information is written by the actual logger used by the API instance of PhytoJS
	 *
   * @return {object} - the effective `logger` which will be used by the `OpenDataLogicAgent` PhytoJs internals.
   */
	logger() {
		return this._effectiveLog;
	}
}
