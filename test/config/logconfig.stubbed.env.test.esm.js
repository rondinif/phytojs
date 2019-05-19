"use strict";
import test from 'tape'
import sinon from 'sinon'
import { logconfig as config , DEFAULT_IS_LOG_SILENT, DEFAULT_IS_LOG_VERBOSE } from '../../esm/logconfig'

test('isLogSilent() should respond even if`IS_LOG_SILENT` environment setting is missing.', function (assert) {
  const sandbox = sinon.createSandbox();
  sandbox.stub(process, 'env').value({});
  assert.equal(config.isLogSilent(), DEFAULT_IS_LOG_SILENT, 'when IS_LOG_SILENT is not present in the environment  isLogSilent() returns DEFAULT_IS_LOG_SILENT');

  assert.equal(DEFAULT_IS_LOG_SILENT, true, 'when IS_LOG_SILENT is not present in the environment isLogSilent() returns DEFAULT_IS_LOG_SILENT that is true');

  assert.end();
  sandbox.restore();
});

test('isLogVerbose() should respond even if`IS_LOG_VERBOSE` environment setting is missing.', function (assert) {
  const sandbox = sinon.createSandbox();
  sandbox.stub(process, 'env').value({});
  assert.equal(config.isLogVerbose(), DEFAULT_IS_LOG_VERBOSE, 'when IS_LOG_VERBOSE is not present in the environment isLogVerbose() returns DEFAULT_IS_LOG_VERBOSE');

  assert.equal(DEFAULT_IS_LOG_VERBOSE, false, 'when IS_LOG_VERBOSE is not present in the environment isLogVerbose() returns DEFAULT_IS_LOG_VERBOSE that is false');

  assert.end();
  sandbox.restore();
});


test('isLogSilent() should respond consistently with `IS_LOG_SILENT` environment setting.', function (assert) {
  const sandbox = sinon.createSandbox();
  // assert.plan(6);
  sandbox.stub(process.env, 'IS_LOG_SILENT').value(true);
  assert.equal(config.isLogSilent(), true, 'when IS_LOG_SILENT equals true isLogSilent() returns true');

  sandbox.stub(process.env, 'IS_LOG_SILENT').value(false);
  assert.equal(config.isLogSilent(), false, 'when IS_LOG_SILENT equals false isLogSilent() returns false');

  sandbox.stub(process.env, 'IS_LOG_SILENT').value(1);
  assert.equal(config.isLogSilent(), true, 'when IS_LOG_SILENT is 1 isLogSilent() should returns true');

  sandbox.stub(process.env, 'IS_LOG_SILENT').value(0);
  assert.equal(config.isLogSilent(), false, 'when IS_LOG_SILENT is 0 isLogSilent() should return false');

  sandbox.stub(process.env, 'IS_LOG_SILENT').value(-1);
  assert.equal(config.isLogSilent(), true, 'when IS_LOG_SILENT is a negative number isLogSilent() should return true');

  sandbox.stub(process.env, 'IS_LOG_SILENT').value(9);
  assert.equal(config.isLogSilent(), true, 'when IS_LOG_SILENT is a number different than 0 the isLogSilent() should return true');

  sandbox.stub(process.env, 'IS_LOG_SILENT').value("TrUE");
  assert.equal(config.isLogSilent(), true, 'when IS_LOG_SILENT is a case insentitive TRUE string the isLogSilent() should return true');

  sandbox.stub(process.env, 'IS_LOG_SILENT').value("FaLsE");
  assert.equal(config.isLogSilent(), false, 'when IS_LOG_SILENT is a case insentitive  FALSE the isLogSilent() string should return false');

  sandbox.stub(process.env, 'IS_LOG_SILENT').value("  FaLsE");
  assert.equal(config.isLogSilent(), false, 'when IS_LOG_SILENT is a case insentitive FALSE string the isLogSilent() should return false even when there are leading spaces in its value');

  sandbox.stub(process.env, 'IS_LOG_SILENT').value(" TRue ");
  assert.equal(config.isLogSilent(), true, 'when IS_LOG_SILENT is a case insentitive FALSE string the isLogSilent() should return true even when there are leading spaces in its value');

  sandbox.stub(process.env, 'IS_LOG_SILENT').value("YES");
  assert.throws(() => config.isLogSilent(), new TypeError(), 'when IS_LOG_SILENT has a string value that in neigher  TRUE  or FALSE, less that case sensivity and possibly traling or leading spaces , nor a number, then should throw an exception not to lead to ambiguous decisions');

  assert.end();
  sandbox.restore();
});
