(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('dotenv-flow')) :
   typeof define === 'function' && define.amd ? define(['exports', 'dotenv-flow'], factory) :
   (global = global || self, factory(global.logconfig = {}, global.dotenv));
}(this, function (exports, dotenv) { 'use strict';

   dotenv = dotenv && dotenv.hasOwnProperty('default') ? dotenv['default'] : dotenv;

   dotenv.config();
   /* 
   usage in programs: 
       import { config } from './lib/config.mjs';
   to check the effective configuration:
       @see ../config.checher.mjs

   WARNING: to avoid circular reference this module **MUST** not import moduled that consumes configuration, such as:
    - <module-that-use-config-here>.mjs  

   Coding Conventions: before each configuration a comment SHOULD be written; the comment also shows the names of the environment variables that can influence the effective configuration value. When present this comment MUST be updated also in the config.checker.mjs program.
   */

   const DEFAULT_IS_LOG_VERBOSE = false;
   const DEFAULT_IS_LOG_SILENT = true;

   const castToBoolen = (anyValue) => {
       // console.log(`castToBoolen::anyValue: ${anyValue}`);
       // console.log(`castToBoolen::anyValue:typeof: ${typeof anyValue}`);
       // if (typeof anyValue === "string") {
           anyValue = anyValue.trim().toLowerCase();
       // } else {  console.log('branch never reached in tests'); }
       switch (anyValue) {
           case 'true':
               return true;
           case 'false':
               return false;
           default:
               const value = parseInt(anyValue);
               if (isNaN(value)) {
                   throw new TypeError(`{anyValue} is not acceptable value for boolean configurable options`); 
               }
               console.log(`castToBoolen::value: ${value}`);
               return value !== 0 ? true : false;
       }
   };

   const logconfig = {
       /* 
       the log is verbose enabed
       affected by .env IS_LOG_VERBOSE
       */
      isLogVerbose: function () {
           return process.env.IS_LOG_VERBOSE ?
               castToBoolen(process.env.IS_LOG_VERBOSE) :
               DEFAULT_IS_LOG_VERBOSE;
       },
       /* 
       the log is verbose enabed
       affected by .env IS_LOG_VERBOSE
       */
       isLogSilent: function () {
           return process.env.IS_LOG_SILENT ?
               castToBoolen(process.env.IS_LOG_SILENT) :
               DEFAULT_IS_LOG_SILENT;
       }
   };

   exports.DEFAULT_IS_LOG_SILENT = DEFAULT_IS_LOG_SILENT;
   exports.DEFAULT_IS_LOG_VERBOSE = DEFAULT_IS_LOG_VERBOSE;
   exports.logconfig = logconfig;

}));
