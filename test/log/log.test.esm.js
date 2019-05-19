"use strict";
import test from 'tape'
import sinon from 'sinon'

// import { log } from '../../esm/log' // SUT 
import { Log } from '../../esm/log' 
import { logconfig } from '../../esm/logconfig'
const log = new Log(logconfig);

const spyTrace = sinon.spy(console, 'trace');
const spyDebug = sinon.spy(console, 'debug');
const spyInfo = sinon.spy(console, 'info');
const spyWarn = sinon.spy(console, 'warn');
const spyError = sinon.spy(console, 'error');

const resetSpies = () => { 
  spyTrace.resetHistory(); 
  spyDebug.resetHistory(); 
  spyInfo.resetHistory(); 
  spyWarn.resetHistory(); 
  spyError.resetHistory(); 
  };

test('log library should be loaded.', function (assert) {
  assert.plan(1);
  assert.ok(log, 'the log library loaded');
  assert.end();

});

test('log has functions named: tarce,debug,info,warn,error', function (assert) {
  const sandbox = sinon.createSandbox();
  sandbox.stub(process, 'env').value({IS_LOG_SILENT: false, IS_LOG_VERBOSE: true});
  assert.plan(5);
  assert.equal(typeof log.trace, 'function', 'log.trace should be a function');
  assert.equal(typeof log.debug, 'function', 'log.debug should be a function');
  assert.equal(typeof log.info, 'function', 'log.info should be a function');
  assert.equal(typeof log.warn, 'function', 'log.warn be a function');
  assert.equal(typeof log.error, 'function', 'log.error should be a function');
  assert.end();

  sandbox.restore();
});


test('log.trace should use console.trace when log is verbose', function (assert) {
  const sandbox = sinon.createSandbox();
  sandbox.stub(process, 'env').value({IS_LOG_SILENT: 'false', IS_LOG_VERBOSE: 'true'});

  assert.plan(4);
  resetSpies(); 
  
  // console.trace = () => {};
  log.trace('trace');
  
  assert.true(spyTrace.called, 'console.trace should be called when we call log.trace');
  assert.false(spyDebug.called, 'console.debug should not be called when we call log.trace');
  // intentionally disabled next asserion:
  // assert.false(spyInfo.called, 'console.info should not be called when we call log.trace');
  assert.false(spyWarn.called, 'console.warn should not be called when we call log.trace');
  assert.false(spyError.called, 'console.error should not be called when we call log.trace');
  assert.end();

  sandbox.restore();
}); 

test('log.trace should not use console.trace when log is silent', function (assert) {
  const sandbox = sinon.createSandbox();
  sandbox.stub(process, 'env').value({IS_LOG_SILENT: 'true', IS_LOG_VERBOSE: 'false'});

  assert.plan(5);
  resetSpies(); 
  
  // console.trace = () => {};
  log.trace('trace');
  
  assert.false(spyTrace.called, 'console.trace should be called when we call log.trace');
  assert.false(spyDebug.called, 'console.debug should not be called when we call log.trace');
  // intentionally re-enabled next asserion:
  assert.false(spyInfo.called, 'console.info should not be called when we call log.trace');
  assert.false(spyWarn.called, 'console.warn should not be called when we call log.trace');
  assert.false(spyError.called, 'console.error should not be called when we call log.trace');
  assert.end();

  sandbox.restore();
}); 

test('log.debug should use console.debug when log is verbose', function (assert) {
  const sandbox = sinon.createSandbox();
  sandbox.stub(process, 'env').value({IS_LOG_SILENT: 'false', IS_LOG_VERBOSE: 'true'});

  assert.plan(5);
  resetSpies(); 
  
  log.debug('debug');
  
  assert.false(spyTrace.called, 'console.trace should not be called when we call log.debug');
  assert.true(spyDebug.called, 'console.debug should be called when we call log.debug');
  assert.false(spyInfo.called, 'console.info should not be called when we call log.debug');
  assert.false(spyWarn.called, 'console.warn should not be called when we call log.debug');
  assert.false(spyError.called, 'console.error should not be called when we call log.debug');
  assert.end();

  sandbox.restore();
});

test('log.debug should not use console.debug when log is silent', function (assert) {
  const sandbox = sinon.createSandbox();
  sandbox.stub(process, 'env').value({IS_LOG_SILENT: 'true', IS_LOG_VERBOSE: 'false'});

  assert.plan(5);
  resetSpies(); 
  
  log.debug('debug');
  
  assert.false(spyTrace.called, 'console.trace should not be called when we call log.debug');
  assert.false(spyDebug.called, 'console.debug should be called when we call log.debug');
  assert.false(spyInfo.called, 'console.info should not be called when we call log.debug');
  assert.false(spyWarn.called, 'console.warn should not be called when we call log.debug');
  assert.false(spyError.called, 'console.error should not be called when we call log.debug');
  assert.end();

  sandbox.restore();
});

test('log.info should use console.info when log is verbose', function (assert) {
  const sandbox = sinon.createSandbox();
  sandbox.stub(process, 'env').value({IS_LOG_SILENT: 'false', IS_LOG_VERBOSE: 'true'});

  assert.plan(5);
  resetSpies(); 
  
  log.info('info');
  
  assert.false(spyTrace.called, 'console.trace should not be called when we call log.info');
  assert.false(spyDebug.called, 'console.debug should not be called when we call log.info');
  assert.true(spyInfo.called, 'console.info should be called when we call log.info');
  assert.false(spyWarn.called, 'console.warn should not be called when we call log.info');
  assert.false(spyError.called, 'console.error should not be called when we call log.info');
  assert.end();

  sandbox.restore();
});

test('log.info should not use console.info when log is silent', function (assert) {
  const sandbox = sinon.createSandbox();
  sandbox.stub(process, 'env').value({IS_LOG_SILENT: 'true', IS_LOG_VERBOSE: 'false'});

  assert.plan(5);
  resetSpies(); 
  
  log.info('info');
  
  assert.false(spyTrace.called, 'console.trace should not be called when we call log.info');
  assert.false(spyDebug.called, 'console.debug should not be called when we call log.info');
  assert.false(spyInfo.called, 'console.info should be called when we call log.info');
  assert.false(spyWarn.called, 'console.warn should not be called when we call log.info');
  assert.false(spyError.called, 'console.error should not be called when we call log.info');
  assert.end();

  sandbox.restore();
});

test('log.info should not use console.info when log is silent', function (assert) {
  const sandbox = sinon.createSandbox();
  sandbox.stub(process, 'env').value({IS_LOG_SILENT: 'true', IS_LOG_VERBOSE: 'false'});

  assert.plan(5);
  resetSpies(); 
  
  log.info('info');
  
  assert.false(spyTrace.called, 'console.trace should not be called when we call log.info');
  assert.false(spyDebug.called, 'console.debug should not be called when we call log.info');
  assert.false(spyInfo.called, 'console.info should be called when we call log.info');
  assert.false(spyWarn.called, 'console.warn should not be called when we call log.info');
  assert.false(spyError.called, 'console.error should not be called when we call log.info');
  assert.end();

  sandbox.restore();
});

test('log.warn should use console.warn when log is verbose', function (assert) {
  const sandbox = sinon.createSandbox();
  sandbox.stub(process.env, 'IS_LOG_SILENT').value(false); 
  sandbox.stub(process.env, 'IS_LOG_VERBOSE').value(true); 


  assert.plan(5);
  resetSpies(); 
  
  log.warn('warn');
  
  assert.false(spyTrace.called, 'console.trace should not be called when we call log.warn');
  assert.false(spyDebug.called, 'console.debug should not be called when we call log.warn');
  assert.false(spyInfo.called, 'console.info should not be called when we call log.warn');
  assert.true(spyWarn.called, 'console.warn should be called when we call log.warn');
  assert.false(spyError.called, 'console.error should not be called when we call log.warn');
  assert.end();

  sandbox.restore();
});

test('log.warn should not use console.warn when log is silent', function (assert) {
  const sandbox = sinon.createSandbox();
  sandbox.stub(process, 'env').value({IS_LOG_SILENT: 'true', IS_LOG_VERBOSE: 'false'});

  assert.plan(5);
  resetSpies(); 
  
  log.warn('warn');
  
  assert.false(spyTrace.called, 'console.trace should not be called when we call log.warn');
  assert.false(spyDebug.called, 'console.debug should not be called when we call log.warn');
  assert.false(spyInfo.called, 'console.info should not be called when we call log.warn');
  assert.false(spyWarn.called, 'console.warn should be called when we call log.warn');
  assert.false(spyError.called, 'console.error should not be called when we call log.warn');
  assert.end();

  sandbox.restore();
});


test('log.error should use console.error', function (assert) {
  const sandbox = sinon.createSandbox();
  sandbox.stub(process, 'env').value({IS_LOG_SILENT: 'false', IS_LOG_VERBOSE: 'true'});

  assert.plan(5);
  resetSpies(); 
  
  log.error('error');
  
  assert.false(spyTrace.called, 'console.trace should not be called when we call log.error');
  assert.false(spyDebug.called, 'console.debug should not be called when we call log.error');
  assert.false(spyInfo.called, 'console.info should not be called when we call log.error');
  assert.false(spyWarn.called, 'console.warn should not be called when we call log.error');
  assert.true(spyError.called, 'console.error should be called when we call log.error');
  assert.end();

  sandbox.restore();
});

test('log.error should use console.error even if logsilent is true', function (assert) {
  const sandbox = sinon.createSandbox();
  sandbox.stub(process, 'env').value({IS_LOG_SILENT: 'true', IS_LOG_VERBOSE: 'false'});

  assert.plan(5);
  resetSpies(); 
  
  log.error('error');
  
  assert.false(spyTrace.called, 'console.trace should not be called when we call log.error');
  assert.false(spyDebug.called, 'console.debug should not be called when we call log.error');
  assert.false(spyInfo.called, 'console.info should not be called when we call log.error');
  assert.false(spyWarn.called, 'console.warn should not be called when we call log.error');
  assert.true(spyError.called, 'console.error should be called when we call log.error');
  assert.end();

  sandbox.restore();
});






test('isLogSilent() and isLogVerbove cannot be both true.', function (assert) {
  const sandbox = sinon.createSandbox();
  // assert.plan(6);
  sandbox.stub(process.env, 'IS_LOG_SILENT').value(true);
  sandbox.stub(process.env, 'IS_LOG_VERBOSE').value(true);
  
  assert.throws(() => new Log(logconfig), new Error(), 'when both IS_LOG_SILENT and IS_LOG_VERBOSE are true then should throw an exception not to lead to ambiguous decisions')

  assert.end();
  sandbox.restore();
});
