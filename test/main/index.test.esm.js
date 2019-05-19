"use strict";
import test from 'tape' // var test = require('tape');
import 'isomorphic-fetch';
import logger from 'roarr';
// const log = logger.default;
import { Log } from '../../esm/log' 
import { config } from '../../esm/config'
import { logconfig } from '../../esm/logconfig'

import { Phyto } from '../../esm/index.js'; // the actual package
const log = new Log(logconfig);

test('it should be possible to instatiate a Phyto', function (assert) {
  const phyto = new Phyto(fetch, config, log);
  assert.plan(1);
  assert.ok(phyto, 'the main library loaded');
});

test('it should be possible to instatiate a Phyto without a config and without a log', function (assert) {
  // c is undefined config
  // l is undefined config
  const phyto = new Phyto(fetch, undefined, undefined);
  assert.plan(1);
  assert.ok(phyto, 'the main library loaded');
});

test('it should be possible to instatiate a Phyto with an external logger like roarr without specify a config', function (assert) {
  // c is undefined config
  // logger is a roarr logger
  const phyto = new Phyto(fetch, undefined, logger);
  assert.plan(1);
  assert.ok(phyto, 'the main library loaded');
});

test('it should be possible to instatiate a Phyto with an external logger like roarr', function (assert) {
  // config is a defined config
  // logger is a roarr logger
  const phyto = new Phyto(fetch, config, logger);
  assert.plan(1);
  assert.ok(phyto, 'the main library loaded');
});