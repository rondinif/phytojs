import { Log } from '../esm/log';

// DIP: export Higher-order function factories : each of them returns a function as its result.

// Higher-order function: returns a function as its result.
function makeGetPromiseOfWikiDataApiResults(fetch, log) {
  return (uri, headers) => {
    return fetch(encodeURI(uri), {
      headers: headers // ,
      // method: 'GET', ...mode, cache , see 
    }).then(body => body.json())
      .catch(err => log.error(`ERROR FETCHING DATA: ${err.message}`));
  };
}

// Higher-order function: returns a function as its result.
function makeGetPromiseOfSparqlResults(fetch, log) {
  return (serviceUri, sparql, headers) => {
    const uri = `${serviceUri}/sparql?query=${sparql}`;
    return fetch(encodeURI(uri), { headers })
      .then(body => body.json())
      .catch(err => log.error(`ERROR FETCHING DATA: ${err.message}`));
  };
}

const openDataPromisesFactories = {
  makeWdSearchByAnyName: (ff, config, log) => name => {
    return getPromiseOfWikiDataApiActionQuerySearchByName({ ff, config, log }, name);
  },
  makeWdPlantsByAnyName: (ff, config, log) => name => {
    return getPlantsFromWikiDataApiActionQuerySearchByName({ ff, config, log }, name);
  },
  makeResolvedPlantsByName: (ff, ffSparql, config, log) => name => {
    return getPromiseOfPlantResolvedByOpendataByName({ ff, ffSparql, config, log }, name);
  },
  makeSparqlScientificNameById: (ffSparql, config, log) => id => {
    return getPromiseOfSparqlGetScientificNameByEntityId({ ffSparql, config, log }, id);
  },
};

const openDataEndpointFactories = {
  makeWdEndpointUri: (config, log) => () => {
    return getWdEndpointUri({ config, log });
  },
  makeSparqlEndpointUri: (config, log) => () => {
    return getSparqlEndpointUri({ config, log });
  }
};

function getSparqlEndpointUri({ config, log }) {
  const serviceUri = config.isUnderTest() ? 'http://127.0.0.1:6569' : 'https://query.wikidata.org';
  log.debug(`sparqlEndpointUri: ${serviceUri}`);
  return serviceUri;
}

function getWdEndpointUri({ config, log }) {
  const svc = config.isUnderTest() ? 'http://127.0.0.1:6568' : 'https://www.wikidata.org';
  const serviceUri = `${svc}/w/api.php`;
  log.debug(`wdEndpointUri: ${serviceUri}`);
  return serviceUri;
}

/* wdSearchByAnyName:
dato un nome generico nome di pianta espresso in qualsiasi lingua
ritorna una lista di `wikidata entities`
[1.0.1 BUG FIX]: added `origin=*`
*/
function getPromiseOfWikiDataApiActionQuerySearchByName({ ff, config, log }, name) {
  name = (name === undefined) ? "" : name;
  const uri = `${getWdEndpointUri({ config, log })}?action=query&format=json&origin=*&list=search&srsearch=${name}&srlimit=500`;
  log.debug(uri);
  const headers = { 'Accept': 'application/json' };
  // ritorna la promise ottenta dal modulo di gestione delle richieste http asincrone verso opendata
  // return OpenDataAsyncRequest.getPromiseOfWikiDataApiResults( uri, headers );
  return ff(uri, headers);
}

/* wdPlantsByAnyName:   // ex: getAsynchronoslyPlantsFromWikiDataApiActionQuerySearchByName
dato un nome in qualsiasi lingua,
usa le API di wikidata.org con action=query
e dal risultato estrae solo quegli elementi che potrebbero essere piante
quindi restituisce un proprio risultato contenente in nome cercato e le piante
*/
async function getPlantsFromWikiDataApiActionQuerySearchByName({ ff, config, log }, name) {
  if (name === undefined) {
    return { name: undefined, plants: [] };
  } else if (name === null) {
    return { name: null, plants: [] };
  }
  const response = await getPromiseOfWikiDataApiActionQuerySearchByName({ ff, config, log }, name);
  try {
    log.debug(JSON.stringify(response)); // there is a response we can log it.
    if (response.error) {
      return {
        name: name,
        plants: [],
        error: {
          code: response.error.code,
          message: response.error.info
        }
      }
    }

    let plants = response.query.search.filter((item) => {
      // species of plant
      // variety of plants
      return (
        item.snippet.toLowerCase().includes("plant")
        ||
        item.snippet.toLowerCase().includes("cultivar")
      );
    });
    // log.debug('============================');
    // log.debug(name);
    // log.debug(JSON.stringify(plants));
    return {
      "name": name,
      "plants": plants
    };
  } catch (someError) {
    return {
      name: name,
      plants: [],
      error: {
        code: "999",
        message: `unexpected ${someError.message}`
      }
    }
  }
}

/* es: sparqlGetScientificNameByEntityId
data una wikidata entity ( es: Q23501) che dovrebbe essere di un taxon
ne ricava il nome scentifico eseguendo una query spqrql ad un endpoint di wikidata
*/
function getPromiseOfSparqlGetScientificNameByEntityId({ ffSparql, config, log }, entityId) {
  const sparql = `SELECT ?scientificname WHERE {wd:${entityId} wdt:P225 ?scientificname.}`;
  const headers = { 'Accept': 'application/sparql-results+json' };
  // return OpenDataAsyncRequest.getPromiseOfSparqlResults(serviceUri, sparql, headers);
  return ffSparql(getSparqlEndpointUri({ config, log }), sparql, headers);
}

/* 
come sparqlGetScientificNameByEntityId ma con più attribuiti
this function use the left-join semantics, which translates to the OPTIONAL keyword in SPARQL
*/
function getPromiseOfSparqlGetScientificNameAndBasicAttributesByEntityId({ ffSparql, config, log }, entityId) {
  const sparql =
    `SELECT ?scientificname ?taxonrank ?taxonrankLabel ?image WHERE {
      OPTIONAL { wd:${entityId} wdt:P225 ?scientificname. }
      OPTIONAL { wd:${entityId} wdt:P105 ?taxonrank.}
      OPTIONAL { wd:${entityId} wdt:P18 ?image. }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" }
    }`;
  const headers = { 'Accept': 'application/sparql-results+json' };
  // return OpenDataAsyncRequest.getPromiseOfSparqlResults(serviceUri, sparql, headers);
  return ffSparql(getSparqlEndpointUri({ config, log }), sparql, headers);
}

/* 
data una wikidata entity ( es: Q23501) che dovrebbe essere di un taxon
ne ricava il relativo articolo wikimedia species 
*/
function getPromiseOfSparqlGetSpecieArticleByEntityId({ ffSparql, config, log }, entityId) {
  const sparql = `SELECT ?article WHERE { ?article schema:about wd:${entityId}; schema:isPartOf <https://species.wikimedia.org/>. }`;
  const headers = { 'Accept': 'application/sparql-results+json' };
  // return OpenDataAsyncRequest.getPromiseOfSparqlResults(serviceUri, sparql, headers);
  return ffSparql(getSparqlEndpointUri({ config, log }), sparql, headers);
}

/* ex: wdPromise
get a Promise that the name provided will be used to search plants in the opendata
*/
function getPromiseOfPlantResolvedByOpendataByName({ ff, ffSparql, config, log }, name) {
  return new Promise(resolveQuery => {
    const asyncPlants = getPlantsFromWikiDataApiActionQuerySearchByName({ ff, config, log }, name)
      .then((value) => {
        // log.debug(JSON.stringify(value));
        return value;
      });
    asyncPlants.then((responseOfPlantsSearchedByAnyName) => {
      let entities = [];
      (async function loopWDEntities() {
        for (let i = 0; i < responseOfPlantsSearchedByAnyName.plants.length; i++) {
          // log.debug(i);
          const wdEntity = responseOfPlantsSearchedByAnyName.plants[i].title;
          const wdPageId = responseOfPlantsSearchedByAnyName.plants[i].pageid;
          const wdSnippet = responseOfPlantsSearchedByAnyName.plants[i].snippet;
          // log.debug(`wdEntity: ${wdEntity}`);            
          const sparqlQueryScientificName = await getPromiseOfSparqlGetScientificNameAndBasicAttributesByEntityId({ ffSparql, config, log }, wdEntity);
          // DEFENSIVE PROGRAMMING BUT UNUSEFUL [ try {
          log.debug('%s', JSON.stringify(sparqlQueryScientificName.results));
          // } catch(errorLogging) {
          //   log.error(`sparqlQueryScientificName got no results:${errorLogging.message}`);
          // } // DEFENSIVE PROGRAMMING BUT UNUSEFUL ]

          let scientificName;
          try {
            scientificName = sparqlQueryScientificName.results.bindings[0].scientificname.value;
          } catch (e) {
            scientificName = "#ND";
          }
          log.info(scientificName);

          let taxonRankId;
          let taxonRankLabel;
          try {
            taxonRankId = sparqlQueryScientificName.results.bindings[0].taxonrank.value;
            taxonRankLabel = sparqlQueryScientificName.results.bindings[0].taxonrankLabel.value;
          } catch (e) {
            taxonRankId = "#ND";
            taxonRankLabel = "#ND";
          }

          let image;
          try {
            image = sparqlQueryScientificName.results.bindings[0].image.value;
          } catch (e) {
            log.warn(`image #ND, cautch exception message:[${e.message}]`);
          }

          let specieArticle;
          try {
            const sparqlQueryArticle = await getPromiseOfSparqlGetSpecieArticleByEntityId({ ffSparql, config, log }, wdEntity);
            specieArticle = sparqlQueryArticle.results.bindings[0].article.value;
            log.info(specieArticle);
          } catch (e) {
            log.warn(`specieArticle #ND [${e.message}]`);
          }

          entities[i] = {
            wdEntityId: wdEntity,
            wdPageId: wdPageId,
            wdSnippet: wdSnippet,
            scientificName: scientificName,
            taxonRankId: taxonRankId,
            taxonRankLabel: taxonRankLabel,
          };
          if (specieArticle) {
            entities[i]["specieArticle"] = specieArticle;
          }
          if (image) {
            entities[i]["image"] = image;
          }
        }
        resolveQuery({
          name: responseOfPlantsSearchedByAnyName.name,
          plants: entities
        });
      })(); // .catch(e => log.debug("loopWDEntities Caught Error: " + e)); // UNCOVERED ( intentionally left for DEFENSIVE PROGRAMMING )
    }); // closing res.then
  });
}

// https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/
/**
 * This is a description of the Phyto constructor function.
 * @class
 * @classdesc This is a description of the Phyto class.
 */
class Phyto {

    /**
    * @constructor
    * @param {Function} fetch
    * @param {Function} config
    * @param {Function} logger
    */
    constructor(fetch, config, log, logconfig) {
      this._effectiveConfig = (typeof config == 'undefined') ? {isUnderTest: () => false } : config;
      this._effectiveLog = (typeof log == 'undefined') ? new Log((typeof logconfig == 'undefined') ? {isLogVerbose: () => false, isLogSilent: () => true } : logconfig) : log; 


      const _ff = makeGetPromiseOfWikiDataApiResults(fetch, this._effectiveLog);
      const _ffSparql = makeGetPromiseOfSparqlResults(fetch, this._effectiveLog);
      
      this._wdSearchByAnyName = openDataPromisesFactories.makeWdSearchByAnyName(_ff, this._effectiveConfig, this._effectiveLog);
      this._wdPlantsByAnyName = openDataPromisesFactories.makeWdPlantsByAnyName(_ff, this._effectiveConfig, this._effectiveLog);
      this._resolvedPlantsByName = openDataPromisesFactories.makeResolvedPlantsByName(_ff, _ffSparql, this._effectiveConfig, this._effectiveLog);
      this._sparqlScientificNameById = openDataPromisesFactories.makeSparqlScientificNameById( _ffSparql, this._effectiveConfig, this._effectiveLog);

      this._wdEndpointUri = openDataEndpointFactories.makeWdEndpointUri(this._effectiveConfig, this._effectiveLog);
      this._sparqlEndpointUri = openDataEndpointFactories.makeSparqlEndpointUri(this._effectiveConfig, this._effectiveLog);
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

    /**
    * @return {object}
    */
   config() {
    return this._effectiveConfig; 
   }

    /**
    * @return {object}
    */
   logger() {
    console.log(`####:${this._effectiveLog}`);   
    return this._effectiveLog; 
   }

}

export { Phyto };
