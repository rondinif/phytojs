"use strict";
import test from 'tape' // var test = require('tape');
import 'isomorphic-fetch';
import logger from 'roarr';
const log = logger.default;
import { config } from '../../esm/config'
import { Phyto } from '../../esm/index.js'; // the actual package
const phyto = new Phyto(fetch, config, log);

test('main', function (assert) {
  assert.plan(1);
  assert.ok(phyto, 'the main library loaded');
});