/*
this is a `JavaScript configuration file` to be used by `jsdoc`
@see https://jsdoc.app/about-configuring-jsdoc.html 
@see https://jsdoc.app/plugins-markdown.html

*/
'use strict';

module.exports = {
		"plugins": [
			"plugins/markdown",
			"plugins/summarize"
		],
		"markdown": {
			"idInHeadings": true,
			"tags": [
				"comment",
				"params"
			]
		},
    "recurseDepth": 10,
    "source": {
        "include": ["package.json" ],
        "includePattern": ".+\\.js(doc|x)?$",
        "excludePattern": "(^|\\/|\\\\)_"
    },
    "sourceType": "module",
    "tags": {
        "allowUnknownTags": true,
        "dictionaries": ["jsdoc","closure"]
    },
    "templates": {
        "cleverLinks": false,
        "monospaceLinks": false
    }
};
