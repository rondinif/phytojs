"use strict";
export const openDataPromisesFactories = {
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
}

// TODO: usare costanti per le url come ad esempio: 'http://127.0.0.1:6568'
// TODO: programmazione difensiva? check valditità delle deps?
// TODO: vedi lib/dataloader.mjs ... capire se ha senso implementare qui, rimuovere dataloader.mjs

/* wdSearchByAnyName:
dato un nome generico nome di pianta espresso in qualsiasi lingua
ritorna una lista di `wikidata entities`
[1.0.1 BUG FIX]: added `origin=*`
*/
function getPromiseOfWikiDataApiActionQuerySearchByName({ ff, config, log }, name) {
  name = (name === undefined) ? "" : name;
  const serviceUri = config.isUnderTest() ? 'http://127.0.0.1:6568' : 'https://www.wikidata.org';
  const uri = `${serviceUri}/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${name}&srlimit=500`;
  log.trace(uri);
  const headers = { 'Accept': 'application/json' };
  // ritorna la promise ottenta dal modulo di gestione delle richieste http asincone verso opendata
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
  log.trace(JSON.stringify(response));
  if (response.error) {
    return {
      name: name,
      plants: [],
      error: {
        code: response.error.code,
        message: response.error.info,
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
  // log.trace('============================');
  // log.trace(name);
  // log.trace(JSON.stringify(plants));
  return {
    "name": name,
    "plants": plants
  };
}

/* es: sparqlGetScientificNameByEntityId
data una wikidata entity ( es: Q23501) che dovrebbe essere di un taxon
ne ricava il nome scentifico eseguendo una query spqrql ad un endpoint di wikidata
*/
function getPromiseOfSparqlGetScientificNameByEntityId({ ffSparql, config, log }, entityId) {
  const serviceUri = config.isUnderTest() ? 'http://127.0.0.1:6569' : 'https://query.wikidata.org';
  const sparql = `SELECT ?scientificname WHERE {wd:${entityId} wdt:P225 ?scientificname.}`
  const headers = { 'Accept': 'application/sparql-results+json' };
  // return OpenDataAsyncRequest.getPromiseOfSparqlResults(serviceUri, sparql, headers);
  return ffSparql(serviceUri, sparql, headers);
}

/* 
come sparqlGetScientificNameByEntityId ma con più attribuiti
this function use the left-join semantics, which translates to the OPTIONAL keyword in SPARQL
*/
function getPromiseOfSparqlGetScientificNameAndBasicAttributesByEntityId({ ffSparql, config, log }, entityId) {
  const serviceUri = config.isUnderTest() ? 'http://127.0.0.1:6569' : 'https://query.wikidata.org';
  const sparql =
    `SELECT ?scientificname ?taxonrank ?taxonrankLabel ?image WHERE {
      OPTIONAL { wd:${entityId} wdt:P225 ?scientificname. }
      OPTIONAL { wd:${entityId} wdt:P105 ?taxonrank.}
      OPTIONAL { wd:${entityId} wdt:P18 ?image. }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" }
    }`;
  const headers = { 'Accept': 'application/sparql-results+json' };
  // return OpenDataAsyncRequest.getPromiseOfSparqlResults(serviceUri, sparql, headers);
  return ffSparql(serviceUri, sparql, headers);
}

/* 
data una wikidata entity ( es: Q23501) che dovrebbe essere di un taxon
ne ricava il relativo articolo wikimedia species 
*/
function getPromiseOfSparqlGetSpecieArticleByEntityId({ ffSparql, config, log }, entityId) {
  const serviceUri = config.isUnderTest() ? 'http://127.0.0.1:6569' : 'https://query.wikidata.org';
  const sparql = `SELECT ?article WHERE { ?article schema:about wd:${entityId}; schema:isPartOf <https://species.wikimedia.org/>. }`;
  const headers = { 'Accept': 'application/sparql-results+json' };
  // return OpenDataAsyncRequest.getPromiseOfSparqlResults(serviceUri, sparql, headers);
  return ffSparql(serviceUri, sparql, headers);
}

/* ex: wdPromise
get a Promise that the name provided will be used to search plants in the opendata
*/
function getPromiseOfPlantResolvedByOpendataByName({ ff, ffSparql, config, log }, name) {
  return new Promise(resolveQuery => {
    const asyncPlants = getPlantsFromWikiDataApiActionQuerySearchByName({ ff, config, log }, name)
      .then((value) => {
        // log.trace(JSON.stringify(value));
        return value;
      });
    asyncPlants.then((responseOfPlantsSearchedByAnyName) => {
      let entities = [];
      (async function loopWDEntities() {
        for (let i = 0; i < responseOfPlantsSearchedByAnyName.plants.length; i++) {
          //log.trace(i);
          const wdEntity = responseOfPlantsSearchedByAnyName.plants[i].title;
          const wdPageId = responseOfPlantsSearchedByAnyName.plants[i].pageid;
          const wdSnippet = responseOfPlantsSearchedByAnyName.plants[i].snippet;
          //log.trace(`wdEntity: ${wdEntity}`);            
          const sparqlQueryScientificName = await getPromiseOfSparqlGetScientificNameAndBasicAttributesByEntityId({ ffSparql, config, log }, wdEntity);
          if (sparqlQueryScientificName.results) {
            try {
              log.trace('%s', JSON.stringify(sparqlQueryScientificName.results));
            } catch(errorLogging) {
              log.error(errorLogging.message);
            }
          } else {
            console.error("sparqlQueryScientificName" + JSON.stringify(sparqlQueryScientificName));
          }

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
            const sparqlQueryArticle = await getPromiseOfSparqlGetSpecieArticleByEntityId({ ffSparql, config }, wdEntity);
            try {
              specieArticle = sparqlQueryArticle.results.bindings[0].article.value;
              log.info(specieArticle);
            } catch (e) {
              log.warn(`specieArticle #ND [${e.message}]`);
            }
          } catch (eo) {
            log.error(eo.message);
          }

          entities[i] = {
            wdEntityId: wdEntity,
            wdPageId: wdPageId,
            wdSnippet: wdSnippet,
            scientificName: scientificName,
            taxonRankId: taxonRankId,
            taxonRankLabel: taxonRankLabel,
          }
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
      })().catch(e => log.trace("loopWDEntities Caught Error: " + e));
    }); // closing res.then
  });
}

/*
draft for potentially next queries
private/README-wikimedia-api.md
private/README-wikidata-sparql.md
*/