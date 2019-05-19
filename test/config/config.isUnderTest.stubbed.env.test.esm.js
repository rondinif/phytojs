"use strict";
import test from 'tape'
import sinon from 'sinon'
import { config , DEFAULT_IS_UNDER_TEST } from '../../esm/config'

test('isUnderTest() should respond even if`IS_UNDER_TEST` environment setting is missing.', function (assert) {
  const sandbox = sinon.createSandbox();
  sandbox.stub(process, 'env').value({});
  assert.equal(config.isUnderTest(), DEFAULT_IS_UNDER_TEST, 'when IS_UNDER_TEST is not present in the environment  isUnderTest() returns DEFAULT_IS_UNDER_TEST');

  assert.equal(DEFAULT_IS_UNDER_TEST, false, 'when IS_UNDER_TEST is not present in the environment  isUnderTest() returns DEFAULT_IS_UNDER_TEST that is false');

  assert.end();
  sandbox.restore();
});

test('isUnderTest() should respond consistently with `IS_UNDER_TEST` environment setting.', function (assert) {
  const sandbox = sinon.createSandbox();
  // assert.plan(6);
  sandbox.stub(process.env, 'IS_UNDER_TEST').value(true);
  assert.equal(config.isUnderTest(), true, 'when IS_UNDER_TEST equals true isUnderTest() returns true');

  sandbox.stub(process.env, 'IS_UNDER_TEST').value(false);
  assert.equal(config.isUnderTest(), false, 'when IS_UNDER_TEST equals false isUnderTest() returns false');

  sandbox.stub(process.env, 'IS_UNDER_TEST').value(1);
  assert.equal(config.isUnderTest(), true, 'when IS_UNDER_TEST is 1 isUnderTest() should returns true');

  sandbox.stub(process.env, 'IS_UNDER_TEST').value(0);
  assert.equal(config.isUnderTest(), false, 'when IS_UNDER_TEST is 0 isUnderTest() should return false');

  sandbox.stub(process.env, 'IS_UNDER_TEST').value(-1);
  assert.equal(config.isUnderTest(), true, 'when IS_UNDER_TEST is a negative number isUnderTest() should return true');

  sandbox.stub(process.env, 'IS_UNDER_TEST').value(9);
  assert.equal(config.isUnderTest(), true, 'when IS_UNDER_TEST is a number different than 0 the isUnderTest() should return true');

  sandbox.stub(process.env, 'IS_UNDER_TEST').value("TrUE");
  assert.equal(config.isUnderTest(), true, 'when IS_UNDER_TEST is a case insentitive TRUE string the isUnderTest() should return true');

  sandbox.stub(process.env, 'IS_UNDER_TEST').value("FaLsE");
  assert.equal(config.isUnderTest(), false, 'when IS_UNDER_TEST is a case insentitive  FALSE the isUnderTest() string should return false');

  sandbox.stub(process.env, 'IS_UNDER_TEST').value("  FaLsE");
  assert.equal(config.isUnderTest(), false, 'when IS_UNDER_TEST is a case insentitive FALSE string the isUnderTest() should return false even when there are leading spaces in its value');

  sandbox.stub(process.env, 'IS_UNDER_TEST').value(" TRue ");
  assert.equal(config.isUnderTest(), true, 'when IS_UNDER_TEST is a case insentitive FALSE string the isUnderTest() should return true even when there are leading spaces in its value');

  sandbox.stub(process.env, 'IS_UNDER_TEST').value("YES");
  assert.throws(() => config.isUnderTest(), new TypeError(), 'when IS_UNDER_TEST has a string value that in neigher  TRUE  or FALSE, less that case sensivity and possibly traling or leading spaces , nor a number, then should throw an exception not to lead to ambiguous decisions');

  assert.end();
  sandbox.restore();
});
