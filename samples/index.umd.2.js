"use strict"
/* 
Simple demo-program to show how to use phytojs as UMD: Universal Module Definition valid for both AMD and CommonJS compatible contexts
run with: 
 $ node samples/index.umd.js
tested with:
 $ node --version
    v11.10.0
note: 
this sample should give errore when `.env` has inconsistent configuration
for example: Error: log misconfiguration : isLogVerbose:true && isLogSilent:true
*/ 

const chalk = require('chalk');
const fetch = require('isomorphic-fetch');
// const log = require('roarr').default;
const config = require('../umd/config.js').config;

const logconfig = require('../umd/logconfig.js').logconfig;
const loglib = require('../umd/log.js');
const log = new loglib.Log(logconfig);

const lib = require('../umd/phyto');
const phyto = new lib.Phyto(fetch, config, log);

const padr = (s, n) => { return `${s}${(n - s.length > 0) ? ' '.repeat(n - s.length) : ''}` };

const word = 'anguria';
phyto.wdSearchByAnyName(word).then(async res => {
    const a = ['vegetable', 'cultivar', 'plant', 'fruits']
    // console.log(JSON.stringify(queryResult));
    const titles = res.query.search.map((item) => {
        let isInteresting = false;
        if (item.snippet != null) {
            isInteresting = a.map(k => item.snippet.includes(k)).reduce((b, c) => b || c);
        }

        console.log(`${chalk.yellow(padr(item.title, 10))} ${isInteresting ? chalk.green(item.snippet) : chalk.red(item.snippet)}`);
    });
}).catch(error => {
    console.error(`generic error: ${error} \n searching for ${word || 'nothing'}`)
});
