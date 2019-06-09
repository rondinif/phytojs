'use strict';
// Import { logFactory } from './log.mjs';

const logFactory = {
	makeTraceFunction: config => {
		return (...args) => {
			if (config.isLogVerbose()) {
				console.trace(...args);
			}
		};
	},
	makeDebugFunction: config => {
		return (...args) => {
			if (config.isLogVerbose()) {
				console.debug(...args);
			}
		};
	},
	makeInfoFunction: config => {
		return (...args) => {
			if (!config.isLogSilent()) {
				console.info(...args);
			}
		};
	},
	makeWarnFunction: config => {
		return (...args) => {
			if (!config.isLogSilent()) {
				console.warn(...args);
			}
		};
	},
	makeErrorFunction: () => {
		return (...args) => {
			console.error(...args);
		};
	}
};

export class Log {
	constructor(config) {
		if (config.isLogVerbose() && config.isLogSilent()) {
			throw new Error(`log misconfiguration : isLogVerbose:${config.isLogVerbose()} && isLogSilent:${config.isLogSilent()}`);
		}

		this._trace = logFactory.makeTraceFunction(config);
		this._debug = logFactory.makeDebugFunction(config);
		this._info = logFactory.makeInfoFunction(config);
		this._warn = logFactory.makeWarnFunction(config);
		this._error = logFactory.makeErrorFunction(config);

		this._config = config;
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

	getLogConfig() {
		return this._config;
	}
}
