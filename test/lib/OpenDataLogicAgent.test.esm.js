"use strict";

// Dependency Inversion: use Higher-order function factories to get the dependecies to inject 
//  'ff' is the prefix for 'fetch function' , a kind of services to inject into ODLA component 
import 'isomorphic-fetch';
import logger from 'roarr';
const log = logger.default;
import { config } from '../../esm/config'

/*
import { makeGetPromiseOfWikiDataApiResults, makeGetPromiseOfSparqlResults } from '../../lib/OpenDataAsyncFactories.mjs';
const ff = makeGetPromiseOfWikiDataApiResults(fetch);
const ffSparql = makeGetPromiseOfSparqlResults(fetch);
*/ 

// import { makeLogger } from '../../lib/LoggerFactory.mjs';
// const logger = makeLogger(log);

/* snapshots of expected results by functions. naming:
- prefix: `snapshot`
- function name; example:SearchByAnyName
- function arguments; undescore separated list of values; example: _aguria
*/
import tapeNock from 'tape-nock';
import test from 'tape'

/*
// System Under Test module: OpenDataLogicAgent.mjs
import { openDataPromisesFactories } from '../../lib/OpenDataLogicAgent.mjs'  
const wdSearchByAnyName = openDataPromisesFactories.makeWdSearchByAnyName(ff, config, log);
const wdPlantsByAnyName = openDataPromisesFactories.makeWdPlantsByAnyName(ff, config, log);
const resolvedPlantsByName = openDataPromisesFactories.makeResolvedPlantsByName(ff, ffSparql, config, log);
const sparqlScientificNameById = openDataPromisesFactories.makesparqlScientificNameById(ffSparql, config, log);
*/

import { Phyto } from '../../esm/phyto';
const phyto = new Phyto(fetch, config, logger);

// "wild" | "dryrun" | "record" | "lockdown"
var nocktest = tapeNock(test,
  { fixtures: './test/fixture/lib/OpenDataAsyncRequest/__nock-fixtures__', 
  mode: 'record'}); // removed getPromiseOfWikiDataApiResults

// =========================================================  
// SECTION [ wdSearchByAnyName ] ---------------------------

// wdSearchByAnyName should search something by name appropriately using the wikidata api - nock version
import snapshotSearchByAnyName_anguria from '../fixture/lib/OpenDataLogicAgent/wdSearchByAnyName/expected-anguria-snapshot.json' 
nocktest('wdSearchByAnyName_uses_wikidata_api', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  const searchTerm = 'anguria';
  console.log(`search term: \"${searchTerm}\"`)
  // Act
  const queryResult = await phyto.wdSearchByAnyName(searchTerm);  
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult, snapshotSearchByAnyName_anguria, 'wdSearchByAnyName dovrebbe restituire la lista di entità wikidata corrisondente alla stessa lista ottenuta dalla interrogazione alle api esposte da wikidata');
  assert.end();
});

import snapshotSearchByAnyName_bietola_da_coste from '../fixture/lib/OpenDataLogicAgent/wdSearchByAnyName/expected-bietola_da_coste-snapshot.json' 
nocktest('wdSearchByAnyName_could_return_an_empty_list', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  const searchTerm = 'bietola da coste';
  console.log(`search term: \"${searchTerm}\"`)
  // Act
  const queryResult = await phyto.wdSearchByAnyName(searchTerm);
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult, snapshotSearchByAnyName_bietola_da_coste, 'wdSearchByAnyName dovrebbe restituire la lista vuota di entità wikidata corrisondente alla stessa lista ottenuta dalla interrogazione alle api esposte da wikidata');
  assert.end();
});

import snapshotSearchByAnyName_Ангурия from '../fixture/lib/OpenDataLogicAgent/wdSearchByAnyName/expected-Ангурия-snapshot.json' 
nocktest('wdSearchByAnyName_could_be_called_with_terms_in_any_language', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  const searchTerm = 'Ангурия';
  console.log(`search term: \"${searchTerm}\"`)
  // Act
  const queryResult = await phyto.wdSearchByAnyName(searchTerm);
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult, snapshotSearchByAnyName_Ангурия, 'wdSearchByAnyName dovrebbe restituire una lista di entità wikidata corrisondente alla stessa lista ottenuta dalla interrogazione alle api esposte da wikidata che può essere chiamata con un \"vernacular name\" espresso in qualsiasi lingua');
  assert.end();
});

import snapshotSearchByAnyName_Surinaamse_wilde_augurk from '../fixture/lib/OpenDataLogicAgent/wdSearchByAnyName/expected-Surinaamse_wilde_augurk-snapshot.json' 
nocktest('wdSearchByAnyName_could_be_called_with_multi_words_terms_in_any_language', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  const searchTerm = 'Surinaamse wilde augurk';
  console.log(`search term: \"${searchTerm}\"`)
  // Act
  const queryResult = await phyto.wdSearchByAnyName(searchTerm);
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult, snapshotSearchByAnyName_Surinaamse_wilde_augurk, 'wdSearchByAnyName dovrebbe restituire una lista di entità wikidata corrisondente alla stessa lista ottenuta dalla interrogazione alle api esposte da wikidata che può essere chiamata con un \"vernacular name\" composto da parole multiple separate da spazi espresso in qualsiasi lingua');
  assert.end();
});

// =========================================================
// SECTION [ wdPlantsByAnyName ] ---------------------------

// wdPlantsByAnyName has some common requirents for many use case; wdPlantsByAnyNameCommonAssertions collect these requirements so the test case can reuse it
function wdPlantsByAnyNameCommonAssertions(assert, searchTerm, queryResult, hasPlants) {
  assert.equal(queryResult.name,searchTerm,'the json response has a \"name\" key which value equals to the searched term');
  const shouldExpectSomePlants =  (hasPlants !== undefined) ?  hasPlants : true;  // shouldExpectSomePlants by default
  if (shouldExpectSomePlants) {
    assert.ok(queryResult.plants.length > 0,`when searching \"${searchTerm}\" the json response has a non-empty arraylist of \"plants\" when the searched \"vernacular name\" is a well-know plant`); // well-know plant in here it means that is a name name known by the open-data-base used for searches, for example wikidata
  } else {
    assert.ok(queryResult.plants.length == 0,`when searching \"${searchTerm}\" the json response has an empty arraylist of \"plants\" when the searched \"vernacular name\" is not a well-know plant`); // well-know plant in here it means that is a name name known by the open-data-base used for searches, for example wikidata
  }
}

// wdPlantsByAnyName should filter the wikidata api results so that the final result contains only useful entities possibly in the domain of plants
import snapshotPlantsByAnyName_anguria from '../fixture/lib/OpenDataLogicAgent/wdPlantsByAnyName/expected-anguria-snapshot.json' 
nocktest('wdPlantsByAnyName_uses_wikidata_api_filtering_possible_plants', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  const searchTerm = 'anguria';
  console.log(`search term: \"${searchTerm}\"`)
  // Act
  const queryResult = await phyto.wdPlantsByAnyName(searchTerm);
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult, snapshotPlantsByAnyName_anguria, 'wdPlantsByAnyName dovrebbe applicare un filtro in modo da restituire una lista di entità wikidata che possibilmente siano piante per il \"vernacular name\" ricercato');

  wdPlantsByAnyNameCommonAssertions(assert, searchTerm, queryResult);
  assert.end();
});

import snapshotPlantsByAnyName_bietola_da_coste from '../fixture/lib/OpenDataLogicAgent/wdPlantsByAnyName/expected-bietola_da_coste-snapshot.json' 
nocktest('wdPlantsByAnyName_could_return_an_empty_list', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  const searchTerm = 'bietola da coste';
  console.log(`search term: \"${searchTerm}\"`)
  // Act
  const queryResult = await phyto.wdPlantsByAnyName(searchTerm);
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult, snapshotPlantsByAnyName_bietola_da_coste, 'wdPlantsByAnyName dovrebbe restituire una lista vuota quando non esistono entità wikidata che possibilmente siano piante per il \"vernacular name\" ricercato');
  
  wdPlantsByAnyNameCommonAssertions(assert, searchTerm, queryResult, false);
  assert.end();
});

import snapshotPlantsByAnyName_Ангурия from '../fixture/lib/OpenDataLogicAgent/wdPlantsByAnyName/expected-Ангурия-snapshot.json' 
nocktest('wdPlantsByAnyName_uses_wikidata_api_filtering_possible_plants_in_any_language', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  const searchTerm = 'Ангурия';
  console.log(`search term: \"${searchTerm}\"`)
  // Act
  const queryResult = await phyto.wdPlantsByAnyName(searchTerm);
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult, snapshotPlantsByAnyName_Ангурия, 'wdPlantsByAnyName dovrebbe applicare un filtro in modo da restituire una lista di entità wikidata che possibilmente siano piante per il \"vernacular name\" ricercato in qualsiasi lingua');
  
  wdPlantsByAnyNameCommonAssertions(assert, searchTerm, queryResult);
  assert.end();
});

import snapshotPlantsByAnyName_Surinaamse_wilde_augurk from '../fixture/lib/OpenDataLogicAgent/wdPlantsByAnyName/expected-Surinaamse_wilde_augurk-snapshot.json' 
nocktest('wdPlantsByAnyName_uses_wikidata_api_filtering_possible_plants_searched_for_multi_words_terms_in_any_language', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  const searchTerm = 'Surinaamse wilde augurk';
  console.log(`search term: \"${searchTerm}\"`)
  // Act
  const queryResult = await phyto.wdPlantsByAnyName(searchTerm);
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult, snapshotPlantsByAnyName_Surinaamse_wilde_augurk, 'wdPlantsByAnyName dovrebbe applicare un filtro in modo da restituire una lista di entità wikidata che possibilmente siano piante per il \"vernacular name\" ricercato in qualsiasi lingua');

  wdPlantsByAnyNameCommonAssertions(assert, searchTerm, queryResult);
  assert.end();
});

// =========================================================
// SECTION [ resolvedPlantsByName ] ------------------------

// resolvedPlantsByName has some common requirents for many use case; resolvedPlantsByNameCommonAssertions collect these requirements so the test case can reuse it
function resolvedPlantsByNameCommonAssertions(assert, searchTerm, queryResult, hasPlants) {
  assert.equal(queryResult.name,searchTerm,'the json response has a \"name\" key which value equals to the searched term');
  const shouldExpectSomePlants =  (hasPlants !== undefined) ?  hasPlants : true;  // shouldExpectSomePlants by default
  if (shouldExpectSomePlants) {
    assert.ok(queryResult.plants.length > 0,`when searching \"${searchTerm}\" the json response has a non-empty arraylist of \"plants\" when the searched term is a well-know plant`); // well-know plant in here it means that is a name name known by the open-data-base used for searches, for example wikidata
  } else {
    assert.ok(queryResult.plants.length == 0,`when searching \"${searchTerm}\" the json response has an empty arraylist of \"plants\" when the searched term is not a well-know plant`); // well-know plant in here it means that is a name name known by the open-data-base used for searches, for example wikidata
  }
}

// resolvedPlantsByName should filter the the results so that it contains only useful entities possibly in the domain of plants
import snapshotResolvedPlantsByName_pomodoro from '../fixture/lib/OpenDataLogicAgent/resolvedPlantsByName/expected-pomodoro-snapshot.json' 
nocktest('resolvedPlantsByName_returns_plants_only', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  const searchTerm = 'pomodoro';
  console.log(`search term: \"${searchTerm}\"`)
  // Act
  const queryResult = await phyto.resolvedPlantsByName(searchTerm);
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult, snapshotResolvedPlantsByName_pomodoro, 'resolvedPlantsByName dovrebbe applicare un filtro in modo da restituire una adeguata lista di sole piante in funzione del termine ricercato');

  resolvedPlantsByNameCommonAssertions(assert, searchTerm, queryResult);
  assert.end();
});

import snapshotResolvedPlantsByName_endivia from '../fixture/lib/OpenDataLogicAgent/resolvedPlantsByName/expected-endivia-snapshot.json' 
nocktest('resolvedPlantsByName_can_return_plants_with_an_undefined_image', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  const searchTerm = 'endivia';
  console.log(`search term: \"${searchTerm}\"`)
  // Act
  const queryResult = await phyto.resolvedPlantsByName(searchTerm);
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult, snapshotResolvedPlantsByName_endivia, 'resolvedPlantsByName potrebbe ritornare alcune piante per le quali la image non è definita');

  resolvedPlantsByNameCommonAssertions(assert, searchTerm, queryResult);
  assert.end();
});

import snapshotResolvedPlantsByName_bietola_da_coste from '../fixture/lib/OpenDataLogicAgent/resolvedPlantsByName/expected-bietola_da_coste-snapshot.json' 
nocktest('resolvedPlantsByName_could_return_an_empty_list', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  const searchTerm = 'bietola da coste';
  console.log(`search term: \"${searchTerm}\"`)
  // Act
  const queryResult = await phyto.resolvedPlantsByName(searchTerm);
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult, snapshotResolvedPlantsByName_bietola_da_coste, 'resolvedPlantsByName dovrebbe restituire un risultato con una lista senza alcuna entità quando non vengono trovate piante per il \"vernacular name\" ricercato'); // resolvedPlantsByName should provide a list with no entity when no plants are found for the searched term
  
  resolvedPlantsByNameCommonAssertions(assert, searchTerm, queryResult, false);
  assert.end();
});

import snapshotResolvedPlantsByName_Ангурия from '../fixture/lib/OpenDataLogicAgent/resolvedPlantsByName/expected-Ангурия-snapshot.json' 
nocktest('resolvedPlantsByName_looks_for_names_in_any_language', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  const searchTerm = 'Ангурия';
  console.log(`search term: \"${searchTerm}\"`)
  // Act
  const queryResult = await phyto.resolvedPlantsByName(searchTerm);
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult, snapshotResolvedPlantsByName_Ангурия, 'resolvedPlantsByName dovrebbe restituire una lista di piante in funzione di un \"vernacular name\" ricercato in qualsiasi lingua');
  
  resolvedPlantsByNameCommonAssertions(assert, searchTerm, queryResult);
  assert.end();
});

import snapshotResolvedPlantsByName_Surinaamse_wilde_augurk from '../fixture/lib/OpenDataLogicAgent/resolvedPlantsByName/expected-Surinaamse_wilde_augurk-snapshot.json' 
nocktest('resolvedPlantsByName_looks_for_plants_being_able_to_search_multi_words_terms_in_any_language', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  const searchTerm = 'Surinaamse wilde augurk';
  console.log(`search term: \"${searchTerm}\"`)
  // Act
  const queryResult = await phyto.resolvedPlantsByName(searchTerm);
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult, snapshotResolvedPlantsByName_Surinaamse_wilde_augurk, 'resolvedPlantsByName dovrebbe restituire una lista di piante in funzione di un \"vernacular name\" composto da più parole');

  resolvedPlantsByNameCommonAssertions(assert, searchTerm, queryResult);
  assert.end();
});


// =========================================================
// SECTION [ sparqlScientificNameById ] --------------------

// Solanum tuberosum (Q10998)
import snapshotScientificNameById_Q10998 from '../fixture/lib/OpenDataLogicAgent/sparqlScientificNameById/expected-Q10998-snapshot.json' 
nocktest('sparqlScientificNameById_return_proper_scientific_name_for_a_valid_entity_id', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  const entityId = 'Q10998';
  console.log(`entity id: \"${entityId}\"`)
  // Act
  const queryResult = await phyto.sparqlScientificNameById(entityId);
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult, snapshotScientificNameById_Q10998,`snapshotScientificNameById(\"${entityId}\") , per entità che rappresentano taxon,  dovrebbe restituire un risultato coerente con la snapshot: ${JSON.stringify(snapshotScientificNameById_Q10998)}`);

  assert.equal(queryResult.head.vars[0],'scientificname','the query result has a variable named \"scientificname\"');

  assert.equal(queryResult.results.bindings[0][ queryResult.head.vars[0] ].type, 'literal', 'the value of \"scientificname\" is a \"literal\"');

  assert.true((
    queryResult.results.bindings[0][ queryResult.head.vars[0] ].value.includes("Solanum") && 
    queryResult.results.bindings[0][ queryResult.head.vars[0] ].value.includes("tuberosum")),
    `the value of \"scientificname\" for ${entityId}  contains \"Solanum\" and \"tuberosum\"`);

  assert.end();
});


// Arnaldo Pomodoro (Q594368)
import snapshotScientificNameById_Q594368 from '../fixture/lib/OpenDataLogicAgent/sparqlScientificNameById/expected-empty-result-snapshot.json' 
nocktest('sparqlScientificNameById_empty_for_entity_id_that_isnt_a_taxon', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  const entityId = 'Q594368';
  console.log(`entity id: \"${entityId}\"`)
  // Act
  const queryResult = await phyto.sparqlScientificNameById(entityId);
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult, snapshotScientificNameById_Q594368,`snapshotScientificNameById(\"${entityId}\") , per entità che non non rappresentano taxon , dovrebbe restituire un risultato coerente con la snapshot: ${JSON.stringify(snapshotScientificNameById_Q594368)}`);

  assert.equal(queryResult.head.vars[0],'scientificname','the query result has a variable named \"scientificname\"');

  assert.true(queryResult.results.bindings.length == 0, 'the query result has 0 values');

  assert.end();
});


/* 
TODO:
Nella documentazione descrivere la motivazione della scelta per cui si è scelto di posizionare la  __nock-fixtures__ non in './test/fixture/lib/OpenDataAsyncRequest/getPromiseOfWikiDataApiResults/__nock-fixtures__ ma in ./test/fixture/lib/OpenDataAsyncRequest/
in quanto abbiamo due endpoint diversi a seconda del metodo api o sparql ... etc. etc.. 
*/
