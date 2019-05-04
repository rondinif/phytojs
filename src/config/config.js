"use strict";
import dotenv from 'dotenv-flow'
dotenv.config()
/* 
usage in programs: 
    import { config } from './lib/config.mjs';
to check the effective configuration:
    @see ../config.checher.mjs

WARNING: to avoid circular reference this module **MUST** not import moduled that consumes configuration, such as:
 - <module-that-use-config-here>.mjs  

Coding Conventions: before each configuration a comment SHOULD be written; the comment also shows the names of the environment variables that can influence the effective configuration value. When present this comment MUST be updated also in the config.checker.mjs program.
*/

export const DEFAULT_IS_UNDER_TEST = false;

const castToBoolen = (anyValue) => {
    // console.log(`castToBoolen::anyValue: ${anyValue}`);
    // console.log(`castToBoolen::anyValue:typeof: ${typeof anyValue}`);
    if (typeof anyValue === "string") {
        anyValue = anyValue.trim().toLowerCase();
        // console.log(`castToBoolen::anyValue: ${anyValue}`);
    }
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
}

export const config = {
    /* 
    the test features are enabed
    affected by .env IS_FILESTORE_WRITING_ENABLED
    */
   isUnderTest: function () {
        return process.env.IS_UNDER_TEST ?
            castToBoolen(process.env.IS_UNDER_TEST) :
            DEFAULT_IS_UNDER_TEST;
    }
}
