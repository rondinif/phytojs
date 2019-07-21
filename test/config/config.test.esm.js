'use strict';
import test from 'tape';
import {config} from '../../esm/config';

test('config library should be loaded.', assert => {
	assert.plan(1);
	assert.ok(config, 'the config library loaded');
});

test('config has a function named isUnderTest which has no arguments and return a boolean indicating when test features are enabled for the current execution environment.', assert => {
	assert.plan(2);
	assert.equal(typeof config.isUnderTest, 'function', 'isUnderTest should be a function');
	assert.equal(typeof config.isUnderTest(), 'boolean', 'isUnderTest() should return a boolean');
});
