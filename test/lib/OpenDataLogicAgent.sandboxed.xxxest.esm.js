"use strict";
import tapeNock from 'tape-nock';
import test from 'tape'
import sinon from 'sinon'

import 'isomorphic-fetch';
import { Log } from '../../esm/log'
import { config } from '../../esm/config'
import { logconfig } from '../../esm/logconfig'
const logger = new Log(logconfig);

import { Phyto } from '../../esm/phyto';

// "wild" | "dryrun" | "record" | "lockdown"
var nocktest = tapeNock(test,
  {
    fixtures: './test/fixture/lib/OpenDataAsyncRequest/__nock-fixtures__',
    mode: 'record'
  });

  nocktest('wdSearchByAnyName_simulated_rejection_TODO_give_a_better_name', async function (assert) {
    /*
    // Before All @see https://gist.github.com/MatthewKosloski/0e3a44f49e8ba39d491af644552230c7
    const fakeFetch = stub();
    const fakeResponse = Promise.resolve({
      status: 400,
      json: () => Promise.rejects("simulated rejection")
    });
    fakeFetch.withArgs().returns(fakeResponse);
    */
   const sandbox = sinon.createSandbox();
   // sandbox.stub(process, 'env').value({});
   sandbox.stub(phyto, 'getPromiseOfSparqlGetSpecieArticleByEntityId').returns(Promise.rejects("simulated rejection")); 
   
   const phyto = new Phyto(fetch, config, logger);
   
   const searchTerm = 'endivia';
   const queryResult = await phyto.resolvedPlantsByName(searchTerm);
   console.log(JSON.stringify(queryResult));
   
    assert.equal(queryResult, {}, 'this fail');
    assert.end();
    sandbox.restore();
});
