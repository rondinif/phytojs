"use strict";
import tapeNock from 'tape-nock';
import test from 'tape'
import { stub } from "sinon";

import 'isomorphic-fetch';
import { Log } from '../../esm/log'
import { config } from '../../esm/config'
import { logconfig } from '../../esm/logconfig'
const logger = new Log(logconfig);

import { Phyto } from '../../esm/index';

// "wild" | "dryrun" | "record" | "lockdown"
var nocktest = tapeNock(test,
  {
    fixtures: './test/fixture/lib/OpenDataAsyncRequest/__nock-fixtures__',
    mode: 'record'
  });

// =========================================================  
// SECTION [ wdSearchByAnyName ] ---------------------------

// import snapshotSearchByAnyName_with_empty_string from '../fixture/lib/OpenDataLogicAgent/wdSearchByAnyName/expected-error-nosrsearch-snapshot.json' 
nocktest('wdSearchByAnyName_simulated_rejection_TODO_give_a_better_name', async function (assert) {
  // Before All @see https://gist.github.com/MatthewKosloski/0e3a44f49e8ba39d491af644552230c7
  const fakeFetch = stub();
  const fakeResponse = Promise.resolve({
    status: 400,
    json: () => Promise.rejects("simulated rejection")
  });
  fakeFetch.withArgs().returns(fakeResponse);

  const phyto = new Phyto(fakeFetch, config, logger);

  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block

  const searchTerm = 'anguria';
  console.log(`search term: \"${searchTerm}\"`)
  // Act
  const queryResult = await phyto.wdSearchByAnyName(searchTerm);
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.equal(typeof queryResult, 'undefined', 'wdSearchByAnyName non dovrebbe restituire alcun risultato se la fetch alle api di wikidata dovesse venire rigettata');
  assert.end();

  // After All
  // sandbox.restore();
});

/** 
 * wdSearchByAnyName_simulated_error_TODO_give_a_better_name
*/
nocktest('wdSearchByAnyName_simulated_error_TODO_give_a_better_name', async function (assert) {
  // Before All @see https://gist.github.com/MatthewKosloski/0e3a44f49e8ba39d491af644552230c7
  // const sandbox = sinon.createSandbox();
  // sandbox.stub(fetch).value( () => {
  const fakeFetch = stub();
  const fakeResponse = Promise.resolve({
    status: 400,
    json: () => Promise.resolve(
      {
        error: {
          code: 400
        },
        text: "simulated error condition",
        done: false
      })
  });
  fakeFetch.withArgs().returns(fakeResponse);

  const phyto = new Phyto(fakeFetch, config, logger);

  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block

  const searchTerm = 'anguria';
  console.log(`search term: \"${searchTerm}\"`)
  // Act
  const queryResult = await phyto.wdSearchByAnyName(searchTerm);
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.ok(queryResult.error.code, 'wdSearchByAnyName dovrebbe restituire un errore se la fetch alle api di wikidata dovesse restituire un errore sconosciuto');
  assert.end();

  // After All
  // sandbox.restore();
});


// =========================================================
// SECTION [ sparqlScientificNameById ] --------------------


/** 
 * wdSearchByAnyName_simulated_error_TODO_give_a_better_name
*/
nocktest('sparqlScientificNameById_simulated_error_TODO_give_a_better_name', async function (assert) {
  // Before All @see https://gist.github.com/MatthewKosloski/0e3a44f49e8ba39d491af644552230c7
  // const sandbox = sinon.createSandbox();
  // sandbox.stub(fetch).value( () => {

  let fakeFetch = stub();
  const fakeResponse = Promise.resolve({
    status: 400,
    json: () => Promise.rejects("simulated rejection")
  });
  fakeFetch.withArgs().returns(fakeResponse);

  const phyto = new Phyto(fakeFetch, config, logger);
  phyto.getPromiseOfSparqlGetSpecieArticleByEntityId

  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  // console.log(`entity id: \"${entityId}\"`)
  // Act
  const queryResult = await phyto.sparqlScientificNameById();
  console.log(JSON.stringify(queryResult));
  // Assert
  assert.equal(typeof queryResult, 'undefined', 'wdSearchByAnyName non dovrebbe restituire alcun risultato se la fetch alle api di wikidata dovesse venire rigettata');
  // assert.true(queryResult.results.bindings.length == 0, 'the query result has 0 values');
  assert.end();
});

// =========================================================
// SECTION [ resolvedPlantsByName ] --------------------

nocktest('resolvedPlantsByName_simulated_error_TODO_give_a_better_name', async function (assert) {
  // Before All @see https://gist.github.com/MatthewKosloski/0e3a44f49e8ba39d491af644552230c7
  // const sandbox = sinon.createSandbox();
  // sandbox.stub(fetch).value( () => {
  let fakeFetch = stub();
  const fakeResponse = Promise.resolve({
    status: 400,
    json: () => Promise.reject("simulated rejection")
  });
  fakeFetch.withArgs().returns(fakeResponse);

  const phyto = new Phyto(fakeFetch, config, logger);
  // Arrange
  //   ...due to syntax requirements the management of fixtures is outside this code block
  const searchTerm = 'pomodoro';
  console.log(`search term: \"${searchTerm}\"`)
  // Act
  const queryResult = await phyto.resolvedPlantsByName(searchTerm);
  console.log(JSON.stringify(queryResult));
  // Assert
  // assert.equal(typeof queryResult, 'undefined', 'resolvedPlantsByName non dovrebbe restituire alcun risultato se la fetch alle api di wikidata dovesse venire rigettata');
  // assert.ok(queryResult.error.code, 'resolvedPlantsByName dovrebbe restituire un errore se la fetch alle api di wikidata dovesse restituire un errore sconosciuto');
  assert.equal(queryResult.plants.length, 0, 'wdSearchByAnyName non dovrebbe restituire alcuna pianta se la fetch alle api di wikidata dovesse venire rigettata');

  // assert.deepEqual(queryResult, snapshotResolvedPlantsByName_pomodoro, 'resolvedPlantsByName dovrebbe applicare un filtro in modo da restituire una adeguata lista di sole piante in funzione del termine ricercato');

  // resolvedPlantsByNameCommonAssertions(assert, searchTerm, queryResult);
  assert.end();
});
