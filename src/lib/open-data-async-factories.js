'use strict';
// DIP: export Higher-order function factories : each of them returns a function as its result.
// Higher-order function: returns a function as its result.
export function makeGetPromiseOfWikiDataApiResults(fetch, log) {
	return (uri, headers) => {
		return fetch(encodeURI(uri), {
			headers
		}).then(body => body.json())
			.catch(error => log.error(`ERROR FETCHING DATA: ${error.message}`));
	};
}

// Higher-order function: returns a function as its result.
export function makeGetPromiseOfSparqlResults(fetch, log) {
	return (serviceUri, sparql, headers) => {
		const uri = `${serviceUri}/sparql?query=${sparql}`;
		return fetch(encodeURI(uri), {headers})
			.then(body => body.json())
			.catch(error => log.error(`ERROR FETCHING DATA: ${error.message}`));
	};
}
