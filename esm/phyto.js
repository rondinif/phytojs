import { Log } from '../esm/log';

// DIP: export Higher-order function factories : each of them returns a function as its result.
// Higher-order function: returns a function as its result.
function makeGetPromiseOfWikiDataApiResults(fetch, log) {
	return (uri, headers) => {
		return fetch(encodeURI(uri), {
			headers
		}).then(body => body.json())
			.catch(error => log.error(`ERROR FETCHING DATA: ${error.message}`));
	};
}

// Higher-order function: returns a function as its result.
function makeGetPromiseOfSparqlResults(fetch, log) {
	return (serviceUri, sparql, headers) => {
		const uri = `${serviceUri}/sparql?query=${sparql}`;
		return fetch(encodeURI(uri), {headers})
			.then(body => body.json())
			.catch(error => log.error(`ERROR FETCHING DATA: ${error.message}`));
	};
}

const openDataPromisesFactories = {
	makeWdSearchByAnyName: (ff, config, log) => name => {
		return getPromiseOfWikiDataApiActionQuerySearchByName({ff, config, log}, name);
	},
	makeWdPlantsByAnyName: (ff, config, log) => name => {
		return getPlantsFromWikiDataApiActionQuerySearchByName({ff, config, log}, name);
	},
	makeResolvedPlantsByName: (ff, ffSparql, config, log) => name => {
		return getPromiseOfPlantResolvedByOpendataByName({ff, ffSparql, config, log}, name);
	},
	makeSparqlScientificNameById: (ffSparql, config, log) => id => {
		return getPromiseOfSparqlGetScientificNameByEntityId({ffSparql, config, log}, id);
	}
};

const openDataEndpointFactories = {
	makeWdEndpointUri: (config, log) => () => {
		return getWdEndpointUri({config, log});
	},
	makeSparqlEndpointUri: (config, log) => () => {
		return getSparqlEndpointUri({config, log});
	}
};

function getSparqlEndpointUri({config, log}) {
	const serviceUri = config.isUnderTest() ? 'http://127.0.0.1:6569' : 'https://query.wikidata.org';
	log.debug(`sparqlEndpointUri: ${serviceUri}`);
	return serviceUri;
}

function getWdEndpointUri({config, log}) {
	const svc = config.isUnderTest() ? 'http://127.0.0.1:6568' : 'https://www.wikidata.org';
	const serviceUri = `${svc}/w/api.php`;
	log.debug(`wdEndpointUri: ${serviceUri}`);
	return serviceUri;
}

/* WdSearchByAnyName:
dato un nome generico nome di pianta espresso in qualsiasi lingua
ritorna una lista di `wikidata entities`
[1.0.1 BUG FIX]: added `origin=*`
*/
function getPromiseOfWikiDataApiActionQuerySearchByName({ff, config, log}, name) {
	name = (name === undefined) ? '' : name;
	const uri = `${getWdEndpointUri({config, log})}?action=query&format=json&origin=*&list=search&srsearch=${name}&srlimit=500`;
	log.debug(uri);
	const headers = {Accept: 'application/json'};
	// Ritorna la promise ottenta dal modulo di gestione delle richieste http asincrone verso opendata
	// return OpenDataAsyncRequest.getPromiseOfWikiDataApiResults( uri, headers );
	return ff(uri, headers);
}

/* WdPlantsByAnyName:   // ex: getAsynchronoslyPlantsFromWikiDataApiActionQuerySearchByName
dato un nome in qualsiasi lingua,
usa le API di wikidata.org con action=query
e dal risultato estrae solo quegli elementi che potrebbero essere piante
quindi restituisce un proprio risultato contenente in nome cercato e le piante
*/
async function getPlantsFromWikiDataApiActionQuerySearchByName({ff, config, log}, name) {
	if (name === undefined) {
		return {name: undefined, plants: []};
	}

	if (name === null) {
		return {name: null, plants: []};
	}

	const response = await getPromiseOfWikiDataApiActionQuerySearchByName({ff, config, log}, name);
	try {
		log.debug(JSON.stringify(response)); // There is a response we can log it.
		if (response.error) {
			return {
				name,
				plants: [],
				error: {
					code: response.error.code,
					message: response.error.info
				}
			};
		}

		const plants = response.query.search.filter(item => {
			// Species of plant
			// variety of plants
			return (
				item.snippet.toLowerCase().includes('plant') ||
        item.snippet.toLowerCase().includes('cultivar')
			);
		});
		// Log.debug('============================');
		// log.debug(name);
		// log.debug(JSON.stringify(plants));
		return {
			name,
			plants
		};
	} catch (error) {
		return {
			name,
			plants: [],
			error: {
				code: '999',
				message: `unexpected ${error.message}`
			}
		};
	}
}

/* Es: sparqlGetScientificNameByEntityId
data una wikidata entity ( es: Q23501) che dovrebbe essere di un taxon
ne ricava il nome scentifico eseguendo una query spqrql ad un endpoint di wikidata
*/
function getPromiseOfSparqlGetScientificNameByEntityId({ffSparql, config, log}, entityId) {
	const sparql = `SELECT ?scientificname WHERE {wd:${entityId} wdt:P225 ?scientificname.}`;
	const headers = {Accept: 'application/sparql-results+json'};
	// Return OpenDataAsyncRequest.getPromiseOfSparqlResults(serviceUri, sparql, headers);
	return ffSparql(getSparqlEndpointUri({config, log}), sparql, headers);
}

/*
Come sparqlGetScientificNameByEntityId ma con più attribuiti
this function use the left-join semantics, which translates to the OPTIONAL keyword in SPARQL
*/
function getPromiseOfSparqlGetScientificNameAndBasicAttributesByEntityId({ffSparql, config, log}, entityId) {
	const sparql =
    `SELECT ?scientificname ?taxonrank ?taxonrankLabel ?image WHERE {
      OPTIONAL { wd:${entityId} wdt:P225 ?scientificname. }
      OPTIONAL { wd:${entityId} wdt:P105 ?taxonrank.}
      OPTIONAL { wd:${entityId} wdt:P18 ?image. }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" }
    }`;
	const headers = {Accept: 'application/sparql-results+json'};
	// Return OpenDataAsyncRequest.getPromiseOfSparqlResults(serviceUri, sparql, headers);
	return ffSparql(getSparqlEndpointUri({config, log}), sparql, headers);
}

/*
Data una wikidata entity ( es: Q23501) che dovrebbe essere di un taxon
ne ricava il relativo articolo wikimedia species
*/
function getPromiseOfSparqlGetSpecieArticleByEntityId({ffSparql, config, log}, entityId) {
	const sparql = `SELECT ?article WHERE { ?article schema:about wd:${entityId}; schema:isPartOf <https://species.wikimedia.org/>. }`;
	const headers = {Accept: 'application/sparql-results+json'};
	// Return OpenDataAsyncRequest.getPromiseOfSparqlResults(serviceUri, sparql, headers);
	return ffSparql(getSparqlEndpointUri({config, log}), sparql, headers);
}

/* Ex: wdPromise
get a Promise that the name provided will be used to search plants in the opendata
*/
function getPromiseOfPlantResolvedByOpendataByName({ff, ffSparql, config, log}, name) {
	return new Promise(resolve => {
		const asyncPlants = getPlantsFromWikiDataApiActionQuerySearchByName({ff, config, log}, name)
			.then(value => {
				// Log.debug(JSON.stringify(value));
				return value;
			});
		asyncPlants.then(responseOfPlantsSearchedByAnyName => {
			const entities = [];
			(async () => { // #loopWDEntities
				for (let i = 0; i < responseOfPlantsSearchedByAnyName.plants.length; i++) {
					// Log.debug(i);
					const wdEntity = responseOfPlantsSearchedByAnyName.plants[i].title;
					const wdPageId = responseOfPlantsSearchedByAnyName.plants[i].pageid;
					const wdSnippet = responseOfPlantsSearchedByAnyName.plants[i].snippet;
					// Log.debug(`wdEntity: ${wdEntity}`);
					const sparqlQueryScientificName = await getPromiseOfSparqlGetScientificNameAndBasicAttributesByEntityId({ffSparql, config, log}, wdEntity); // eslint-disable-line no-await-in-loop

					log.debug('%s', JSON.stringify(sparqlQueryScientificName.results));

					let scientificName;
					try {
						scientificName = sparqlQueryScientificName.results.bindings[0].scientificname.value;
					} catch (error) {
						scientificName = '#ND';
					}

					log.info(scientificName);

					let taxonRankId;
					let taxonRankLabel;
					try {
						taxonRankId = sparqlQueryScientificName.results.bindings[0].taxonrank.value;
						taxonRankLabel = sparqlQueryScientificName.results.bindings[0].taxonrankLabel.value;
					} catch (error) {
						taxonRankId = '#ND';
						taxonRankLabel = '#ND';
					}

					let image;
					try {
						image = sparqlQueryScientificName.results.bindings[0].image.value;
					} catch (error) {
						log.warn(`image #ND, cautch exception message:[${error.message}]`);
					}

					let specieArticle;
					try {
						const sparqlQueryArticle = await getPromiseOfSparqlGetSpecieArticleByEntityId({ffSparql, config, log}, wdEntity); // eslint-disable-line no-await-in-loop
						specieArticle = sparqlQueryArticle.results.bindings[0].article.value;
						log.info(specieArticle);
					} catch (error) {
						log.warn(`specieArticle #ND [${error.message}]`);
					}

					entities[i] = {
						wdEntityId: wdEntity,
						wdPageId,
						wdSnippet,
						scientificName,
						taxonRankId,
						taxonRankLabel
					};
					if (specieArticle) {
						entities[i].specieArticle = specieArticle;
					}

					if (image) {
						entities[i].image = image;
					}
				}

				resolve({
					name: responseOfPlantsSearchedByAnyName.name,
					plants: entities
				});
			})();
		});
	});
}

// [Why I've stopped exporting defaults from my JavaScript modules](https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/)
/**
 * PhytoJS
 * @module rondinif/phytojs
 * @description this module contains the Phyto class that has all the methods you need
 * @see module:rondinif/phytojs
 * bla bla bla
 */

/**
 * main class to use **PhytoJS application programming interface**. see *Instance Members* to learn about the features available and what each one of them does.
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
class Phyto {
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

export { Phyto };
