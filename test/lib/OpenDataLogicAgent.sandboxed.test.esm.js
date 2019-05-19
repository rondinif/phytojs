"use strict";
import tapeNock from 'tape-nock';
import test from 'tape'
import sinon from 'sinon'

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

nocktest('getWdEndpointUri should return a live wikidata.org public cloud API service when running in production (i.e: not IS_UNDER_TEST=false)', async function (assert) {
  // Arrange 
  const sandbox = sinon.createSandbox();
  // NB: this is not possible => sandbox.stub(phyto, 'getPromiseOfSparqlGetSpecieArticleByEntityId').returns(Promise.rejects("simulated rejection"));
  sandbox.stub(config, 'isUnderTest').value(() => false);
  const phyto = new Phyto(fetch, config, logger);

  // Act
  const svcUri = phyto.getWikiDataApiEndpointUri(); 
  console.log(JSON.stringify(svcUri));

  // Assert 
  assert.true(svcUri.toLowerCase().includes('https'), 'in production mode the wikidata should use an `https` protocol channel');
  assert.true(svcUri.toLowerCase().includes('wikidata.org'), 'wikidata.org should be part of the public wikidata API service uri');
  assert.end();

  sandbox.restore();
});

nocktest('getWdEndpointUri should return the test double `virtual service` (ie: mountebank 127.0.0.1:6568), when not running in production mode (i.e: IS_UNDER_TEST=true)', async function (assert) {
  // Arrange 
  const sandbox = sinon.createSandbox();
  // NB: this is not possible => sandbox.stub(phyto, 'getPromiseOfSparqlGetSpecieArticleByEntityId').returns(Promise.rejects("simulated rejection"));
  sandbox.stub(config, 'isUnderTest').value(() => true);
  const phyto = new Phyto(fetch, config, logger);

  // Act
  const svcUri = phyto.getWikiDataApiEndpointUri(); 
  console.log(JSON.stringify(svcUri));

  // Assert 
  assert.true(svcUri.toLowerCase().includes('http'), 'the test double of the wikidata API service consists of a virtual service (ie: mountebank) that should use an `http` protocol channel');
  assert.true(svcUri.includes('127.0.0.1:6568'), 'the test double of the wikidata API service consists of a virtual service (ie: mountebank) that should use port `6568` on local ip `127.0.0.1`');

  assert.end();

  sandbox.restore();
});

nocktest('getSparqlEndpointUri should return a live cloud `Wikidata Query Service` when running in production (i.e: not IS_UNDER_TEST=false)', async function (assert) {
  // Arrange 
  const sandbox = sinon.createSandbox();
  // NB: this is not possible => sandbox.stub(phyto, 'getPromiseOfSparqlGetSpecieArticleByEntityId').returns(Promise.rejects("simulated rejection"));
  sandbox.stub(config, 'isUnderTest').value(() => false);
  const phyto = new Phyto(fetch, config, logger);

  // Act
  const svcUri = phyto.getSparqlEndpointUri(); 
  console.log(JSON.stringify(svcUri));

  // Assert 
  assert.true(svcUri.toLowerCase().includes('https'), 'in production mode the `Wikidata Query Service` should use an `https` protocol channel');
  assert.true(svcUri.toLowerCase().includes('query.wikidata.org'), 'query.wikidata.org should be part of the wikidata service uri');
  assert.end();

  sandbox.restore();
});

nocktest('getSparqlEndpointUri should return the test double `virtual service` (ie: mountebank 127.0.0.1:6568), when not running in production mode (i.e: IS_UNDER_TEST=true)', async function (assert) {
  // Arrange 
  const sandbox = sinon.createSandbox();
  // NB: this is not possible => sandbox.stub(phyto, 'getPromiseOfSparqlGetSpecieArticleByEntityId').returns(Promise.rejects("simulated rejection"));
  sandbox.stub(config, 'isUnderTest').value(() => true);
  const phyto = new Phyto(fetch, config, logger);

  // Act
  const svcUri = phyto.getSparqlEndpointUri(); 
  console.log(JSON.stringify(svcUri));

  // Assert 
  assert.true(svcUri.toLowerCase().includes('http'), 'the test double of the wikidata service consists of a virtual service (ie: mountebank) that should use an `http` protocol channel');
  assert.true(svcUri.includes('127.0.0.1:6569'), 'the test double of the wikidata service consists of a virtual service (ie: mountebank) that should use port `6569` on local ip `127.0.0.1`');

  assert.end();

  sandbox.restore();
});
