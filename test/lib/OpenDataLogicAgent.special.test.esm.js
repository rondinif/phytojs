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

import { Phyto } from '../../esm/index';
const phyto = new Phyto(fetch, config, logger);

// "wild" | "dryrun" | "record" | "lockdown"
var nocktest = tapeNock(test,
  { fixtures: './test/fixture/lib/OpenDataAsyncRequest/__nock-fixtures__', 
  mode: 'record'}); // getPromiseOfWikiDataApiResults

// =========================================================  
// SECTION [ wdSearchByAnyName ] ---------------------------

import snapshotSearchByAnyName_with_empty_string from '../fixture/lib/OpenDataLogicAgent/wdSearchByAnyName/expected-error-nosrsearch-snapshot.json' 
nocktest('wdSearchByAnyName_called_with_empty_string_give_error_nosrsearch', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  const searchTerm = '';
  console.log(`search term: \"${searchTerm}\"`)
  // Act
  const queryResult = await phyto.wdSearchByAnyName(searchTerm);
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult.error.code, snapshotSearchByAnyName_with_empty_string.error.code, 'wdSearchByAnyName dovrebbe restituire lo stesso errore \"nosrsearch\" tipico delle api wikidata quando chimato con una stringa vuota ');
  assert.end();
});

import snapshotSearchByAnyName_without_mandatory_param from '../fixture/lib/OpenDataLogicAgent/wdSearchByAnyName/expected-error-nosrsearch-snapshot.json' 
nocktest('wdSearchByAnyName_called_without_mandatory_param_give_error_nosrsearch', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  console.log(`there is not a search term`)
  // Act
  const queryResult = await phyto.wdSearchByAnyName();
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult.error.code, snapshotSearchByAnyName_with_empty_string.error.code, 'wdSearchByAnyName dovrebbe restituire lo stesso errore \"nosrsearch\" tipico delle api wikidata quando chimato senza passare una stringa obbligatoria');
  assert.end();
});


// =========================================================
// SECTION [ wdPlantsByAnyName ] ---------------------------

// wdPlantsByAnyName has some common requirents for many use case; wdPlantsByAnyNameCommonAssertions collect these requirements so the test case can reuse it
function wdPlantsByAnyNameCommonAssertions(assert, searchTerm, queryResult, hasPlants) {
  assert.equal(queryResult.name,searchTerm,'the json response has a \"name\" key which value equals to the searched term');
  const shouldExpectSomePlants =  (hasPlants !== undefined) ?  hasPlants : true;  // shouldExpectSomePlants by default
  if (shouldExpectSomePlants) {
    assert.ok(queryResult.plants.length > 0,`when searching \"${searchTerm}\" the json response has a non-empty arraylist of \"plants\" when the searched term is a well-know plant`); // well-know plant in here it means that is a name name known by the open-data-base used for searches, for example wikidata
  } else {
    assert.ok(queryResult.plants.length == 0,`when searching \"${searchTerm}\" the json response has an empty arraylist of \"plants\" when the searched term is not a well-know plant`); // well-know plant in here it means that is a name name known by the open-data-base used for searches, for example wikidata
  }
}

import snapshotPlantsByAnyName_with_empty_string from '../fixture/lib/OpenDataLogicAgent/wdPlantsByAnyName/expected-error-nosrsearch-snapshot.json' 
nocktest('wdPlantsByAnyName_with_empty_string', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  const searchTerm = '';
  console.log(`search term: \"${searchTerm}\"`)
  // Act
  const queryResult = await phyto.wdPlantsByAnyName(searchTerm);
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult.plants,[],"..non ritorna alcuna pianta"); 
  assert.ok(queryResult.error,"...ho un errore"); 
  assert.equal(queryResult.error.code,snapshotPlantsByAnyName_with_empty_string.error.code,`..il cui codice è :\"${snapshotPlantsByAnyName_with_empty_string.error.code}\"`); 

  wdPlantsByAnyNameCommonAssertions(assert, searchTerm, queryResult, false);
  assert.end();
});

nocktest('wdPlantsByAnyName_without_mandatory_param', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  console.log(`calling openDataPromises.wdPlantsByAnyName() without mandatory param`);
  // Act
  const queryResult = await phyto.wdPlantsByAnyName();
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult.plants,[],"..non ritorna alcuna pianta"); 
  assert.notOk(queryResult.error,"...non ho un errore"); 
  wdPlantsByAnyNameCommonAssertions(assert, undefined, queryResult, false);
  assert.end();
});

nocktest('wdPlantsByAnyName_with_a_null_param', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  const searchTerm = null;
  console.log(`search term: \"${searchTerm}\"`)
  // Act
  const queryResult = await phyto.wdPlantsByAnyName(searchTerm);
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult.plants,[],"..non ritorna alcuna pianta"); 
  assert.notOk(queryResult.error,"...non ho un errore"); 
  
  wdPlantsByAnyNameCommonAssertions(assert, searchTerm, queryResult, false);
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

/* Notare che rispetto alla risposta di wdSearchByAnyName abbiamo qui la differenza di non avere nessu errore di ritorno ma semolicemente otteniamo una risposta vuota */ 
import snapshotResolvedPlantsByName_with_empty_string from '../fixture/lib/OpenDataLogicAgent/resolvedPlantsByName/expected-empty-result-when-invoked-with-empty-string-snapshot.json' 
nocktest('resolvedPlantsByName_with_empty_string', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  const searchTerm = '';
  console.log(`search term: \"${searchTerm}\"`)
  // Act
  const queryResult = await phyto.resolvedPlantsByName(searchTerm);
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult.plants,[],"..non ritorna alcuna pianta"); 
  assert.notOk(queryResult.error,"...a questo livello non viene riportato alcun errore"); 
  // assert.equal(queryResult.error.code,snapshotResolvedPlantsByName_with_empty_string.error.code,`..il cui codice è :\"${snapshotPlantsByAnyName_with_empty_string.error.code}\"`); 

  resolvedPlantsByNameCommonAssertions(assert, searchTerm, queryResult, false);
  assert.end();
});

nocktest('resolvedPlantsByName_without_mandatory_param', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  console.log(`calling openDataPromises.resolvedPlantsByName() without mandatory param`);
  // Act
  const queryResult = await phyto.resolvedPlantsByName();
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult.plants,[],"..non ritorna alcuna pianta"); 
  assert.notOk(queryResult.error,"...non ho un errore"); 
  resolvedPlantsByNameCommonAssertions(assert, undefined, queryResult, false);
  assert.end();
});

nocktest('resolvedPlantsByName_with_a_null_param', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  const searchTerm = null;
  console.log(`search term: \"${searchTerm}\"`)
  // Act
  const queryResult = await phyto.resolvedPlantsByName(searchTerm);
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult.plants,[],"..non ritorna alcuna pianta"); 
  assert.notOk(queryResult.error,"...non ho un errore"); 
  
  resolvedPlantsByNameCommonAssertions(assert, searchTerm, queryResult, false);
  assert.end();
});

// =========================================================
// SECTION [ sparqlScientificNameById ] --------------------

// Entity does not exist (Z123456789)
import snapshotScientificNameById_Z123456789 from '../fixture/lib/OpenDataLogicAgent/sparqlScientificNameById/expected-empty-result-snapshot.json' 
nocktest('sparqlScientificNameById_empty_for_entity_id_that_isnt_an_entity', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  const entityId = 'Z123456789';
  console.log(`entity id: \"${entityId}\"`)
  // Act
  const queryResult = await phyto.sparqlScientificNameById(entityId);
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult, snapshotScientificNameById_Z123456789,`snapshotScientificNameById(\"${entityId}\") ,dove ${entityId} di fatto non esiste, dovrebbe restituire un risultato coerente con la snapshot: ${JSON.stringify(snapshotScientificNameById_Z123456789)}`);
  assert.equal(queryResult.head.vars[0],'scientificname','the query result has a variable named \"scientificname\"');
  assert.true(queryResult.results.bindings.length == 0, 'the query result has 0 values');
  assert.end();
});

import snapshotScientificNameById_for_empty_string from '../fixture/lib/OpenDataLogicAgent/sparqlScientificNameById/expected-empty-result-snapshot.json' 
nocktest('sparqlScientificNameById_when_receive_an_empty_string_as_entity_id', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  const entityId = '';
  console.log(`entity id: \"${entityId}\"`)
  // Act
  const queryResult = await phyto.sparqlScientificNameById(entityId);
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult, snapshotScientificNameById_for_empty_string,`snapshotScientificNameById(\"${entityId}\") dovrebbe restituire un risultato coerente con la snapshot: ${JSON.stringify(snapshotScientificNameById_for_empty_string)}`);
  assert.equal(queryResult.head.vars[0],'scientificname','the query result has a variable named \"scientificname\"');
  assert.true(queryResult.results.bindings.length == 0, 'the query result has 0 values');
  assert.end();
});

import snapshotScientificNameById_for_null_string from '../fixture/lib/OpenDataLogicAgent/sparqlScientificNameById/expected-empty-result-snapshot.json' 
nocktest('sparqlScientificNameById_when_receive_a_null_string_as_entity_id', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  const entityId = null;
  console.log(`entity id: \"${entityId}\"`)
  // Act
  const queryResult = await phyto.sparqlScientificNameById(entityId);
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult, snapshotScientificNameById_for_null_string,`snapshotScientificNameById(${entityId}) dovrebbe restituire un risultato coerente con la snapshot: ${JSON.stringify(snapshotScientificNameById_for_null_string)}`);
  assert.equal(queryResult.head.vars[0],'scientificname','the query result has a variable named \"scientificname\"');
  assert.true(queryResult.results.bindings.length == 0, 'the query result has 0 values');
  assert.end();
});

import snapshotScientificNameById_for_undefined_string from '../fixture/lib/OpenDataLogicAgent/sparqlScientificNameById/expected-empty-result-snapshot.json' 
nocktest('sparqlScientificNameById_when_receive_an_undefined_string_as_entity_id', async function (assert) {
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  // console.log(`entity id: \"${entityId}\"`)
  // Act
  const queryResult = await phyto.sparqlScientificNameById();
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.deepEqual(queryResult, snapshotScientificNameById_for_undefined_string,`snapshotScientificNameById() dovrebbe restituire un risultato coerente con la snapshot: ${JSON.stringify(snapshotScientificNameById_for_undefined_string)}`);
  assert.equal(queryResult.head.vars[0],'scientificname','the query result has a variable named \"scientificname\"');
  assert.true(queryResult.results.bindings.length == 0, 'the query result has 0 values');
  assert.end();
});

/*
Aggiungere il caso con #ND per soecificare cosa ritorna quando non trova il nome scentifico

{"name":"pomodoro","entities":[{"id":"Q23501","scientificName":"Solanum lycopersicum"},{"id":"Q4930177","scientificName":"#ND"},{"id":"Q6540634","scientificName":"Solanum lycopersicum var. cerasiforme"}]}
*/



/* 
TODO:
Nella documentazione descrivere la motivazione della scelta per cui si è scelto di posizionare la  __nock-fixtures__ non in './test/fixture/lib/OpenDataAsyncRequest/getPromiseOfWikiDataApiResults/__nock-fixtures__ ma in ./test/fixture/lib/OpenDataAsyncRequest/
in quanto abbiamo due endpoint diversi a seconda del metodo api o sparql ... etc. etc.. 
*/