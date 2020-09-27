'use strict';
import dotenv from 'dotenv-flow';

dotenv.config();
/*
Usage in programs:
    import { config } from './lib/config.mjs';
to check the effective configuration:
    @see ../config.checher.mjs

WARNING: to avoid circular reference this module **MUST** not import moduled that consumes configuration, such as:
 - <module-that-use-config-here>.mjs

Coding Conventions: before each configuration a comment SHOULD be written; the comment also shows the names of the environment variables that can influence the effective configuration value. When present this comment MUST be updated also in the config.checker.mjs program.
*/

export const DEFAULT_IS_LOG_VERBOSE = false;
export const DEFAULT_IS_LOG_SILENT = true;

const castToBoolen = anyValue => {
	// Console.log(`castToBoolen::anyValue: ${anyValue}`);
	// console.log(`castToBoolen::anyValue:typeof: ${typeof anyValue}`);
	// if (typeof anyValue === "string") {
	anyValue = anyValue.trim().toLowerCase();
	// } else {  console.log('branch never reached in tests'); }
	switch (anyValue) {
		case 'true': {
			return true;
		}

		case 'false': {
			return false;
		}

		default: {
			const value = Number.parseInt(anyValue, 10);
			if (Number.isNaN(value)) {
				throw new TypeError('{anyValue} is not acceptable value for boolean configurable options');
			}

			console.log(`castToBoolen::value: ${value}`);
			return value !== 0;
		}
	}
};

export const logconfig = {
	/*
    The log is verbose enabed
    affected by .env IS_LOG_VERBOSE
    */
	isLogVerbose() {
		return process.env.IS_LOG_VERBOSE ?
			castToBoolen(process.env.IS_LOG_VERBOSE) :
			DEFAULT_IS_LOG_VERBOSE;
	},
	/*
    The log is verbose enabed
    affected by .env IS_LOG_VERBOSE
    */
	isLogSilent() {
		return process.env.IS_LOG_SILENT ?
			castToBoolen(process.env.IS_LOG_SILENT) :
			DEFAULT_IS_LOG_SILENT;
	}
};
