'use strict';
import test from 'tape';
import fetch from 'isomorphic-fetch';
import logger from 'roarr';
// ? const log = logger.default;
import {Log} from '../../esm/log.js';
import {config} from '../../esm/config';
import {logconfig} from '../../esm/logconfig';

import {Phyto} from '../../esm/phyto.js';

const log = new Log(logconfig);

// NOT_USED? var test = require('tape');

test('it should be possible to instatiate a Phyto', assert => {
	const phyto = new Phyto(fetch, config, log);
	assert.plan(1);
	assert.ok(phyto, 'the main PhytoJS lib is loaded');
});

test('it should be possible to instatiate a Phyto without a config and without a log', assert => {
	const phyto = new Phyto(fetch, undefined, undefined, undefined);
	assert.plan(1);
	assert.ok(phyto, 'the main PhytoJS lib loaded with the specified fetch only ');
});

test('it should be possible to instatiate a Phyto with the fetch only', assert => {
	const phyto = new Phyto(fetch);
	const isLogSilent = phyto.logger().getLogConfig().isLogSilent();
	assert.plan(2);
	assert.ok(phyto, 'the main PhytoJS lib loaded with the specified fetch only ');
	assert.true(isLogSilent, 'the main PhytoJS lib loaded without specifying the logger assumes the log is silent');
});

test('it should be possible to instatiate a Phyto with an external logger like roarr without specify a config', assert => {
	const phyto = new Phyto(fetch, undefined, logger);
	assert.plan(1);
	assert.ok(phyto, 'the main PhytoJS lib loaded with the specified logger and without a config');
});

test('when instatiate a Phyto with an external logger like roarr without specify a config', assert => {
	const phyto = new Phyto(fetch, undefined, logger);
	const isUnderTest = phyto.config().isUnderTest();
	assert.plan(2);
	assert.ok(phyto, 'the main PhytoJS lib loaded with the specified logger and without a config');
	assert.false(isUnderTest, 'when loaded without a config we assume the PhytoJS lib is not under test');
});

test('it should be possible to instatiate a Phyto with an external logger like roarr', assert => {
	const phyto = new Phyto(fetch, config, logger);
	assert.plan(1);
	assert.ok(phyto, 'the main PhytoJS lib loaded whit the specidied fetch, config and logger');
});

test('it should be possible to instatiate a Phyto without an external logger but passing a logging config', assert => {
	const phyto = new Phyto(fetch, config, undefined, logconfig);
	assert.plan(1);
	assert.ok(phyto, 'the main PhytoJS lib loaded with the specified logconfig, without a logger');
});
