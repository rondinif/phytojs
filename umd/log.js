(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.log = {}));
}(this, function (exports) { 'use strict';

  // import { logFactory } from './log.mjs';  

  const logFactory = {
      makeTraceFunction: (config) => {
          return  (...args) => {
              if (config.isLogVerbose()) {
                  console.trace(...args);
              }
          }},
      makeDebugFunction: (config) => {
          return  (...args) => {
              if (config.isLogVerbose()) {
                  console.debug(...args);
              }
          }},
      makeInfoFunction: (config) => {
          return  (...args) => {
              if (!config.isLogSilent()) {
                  console.info(...args);
              }
          }},
      makeWarnFunction: (config) => {
          return  (...args) => {
              if (!config.isLogSilent()) {
                  console.warn(...args);
              }
          }},
      makeErrorFunction: (config) => {
          return  (...args) => {
              console.error(...args);
          }}
      };

  class Log {
      constructor(config) {
          if ( config.isLogVerbose() && config.isLogSilent() ) {
              throw new Error(`log misconfiguration : isLogVerbose:${config.isLogVerbose()} && isLogSilent:${config.isLogSilent()}`);
          }
          this._trace = logFactory.makeTraceFunction(config);
          this._debug = logFactory.makeDebugFunction(config);
          this._info = logFactory.makeInfoFunction(config);
          this._warn = logFactory.makeWarnFunction(config);
          this._error = logFactory.makeErrorFunction(config);
      }
    
      trace(...args) {
          return this._trace(...args);
        }

      debug(...args) {
          return this._debug(...args);
        }
      
      info(...args) {
          return this._info(...args);
        }

      warn(...args) {
          return this._warn(...args);
        }
        
      error(...args) {
          return this._error(...args);
        }

  }

  /*
  export const log = {
      trace: (...args) => {
          console.trace(...args);
      },

      debug: (...args) => {
          console.debug(...args);
      },

      info: (...args) => {
          console.info(...args);
      },

      warn: (...args) => {
          console.warn(...args);
      },

      error: (...args) => {
          console.error(...args)
      }
  };
  */

  exports.Log = Log;

}));
