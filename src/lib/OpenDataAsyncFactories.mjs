"use strict";
// DIP: export Higher-order function factories : each of them returns a function as its result.

// Higher-order function: returns a function as its result.
export function makeGetPromiseOfWikiDataApiResults(fetch) { return (uri, headers) => {
    return fetch(encodeURI(uri), { headers }).then(body => body.json());
}; }

// Higher-order function: returns a function as its result.
export function makeGetPromiseOfSparqlResults(fetch) { return (serviceUri, sparql, headers) => {
  const uri = `${serviceUri}/sparql?query=${sparql}`;
  return fetch(encodeURI(uri), { headers }).then(body => body.json());
}; }
