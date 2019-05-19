"use strict";
import test from 'tape'
import { logconfig } from '../../esm/logconfig'

test('logconfig library should be loaded.', function (assert) {
  assert.plan(1);
  assert.ok(logconfig, 'the logconfig library loaded');
});

test('logconfig has a function named isLogSilent which has no arguments and return a boolean indicating when test features are enabled for the current execution environment.', function (assert) {
  assert.plan(2);
  assert.equal(typeof logconfig.isLogSilent, 'function', 'isLogSilent should be a function');
  assert.equal(typeof logconfig.isLogSilent(), 'boolean', 'isLogSilent() should return a boolean');
});

test('logconfig has a function named isLogVerbose which has no arguments and return a boolean indicating when test features are enabled for the current execution environment.', function (assert) {
  assert.plan(2);
  assert.equal(typeof logconfig.isLogVerbose, 'function', 'isLogVerbose should be a function');
  assert.equal(typeof logconfig.isLogVerbose(), 'boolean', 'isLogVerbose() should return a boolean');
});