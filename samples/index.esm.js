// ESM : execute command: 
//    `$ node -r esm samples/index.esm.js`
import 'isomorphic-fetch';
import chalk from 'chalk';

import logger from 'roarr';
import { config } from '../esm/config'
import { Phyto } from '../esm/phyto';

const phyto = new Phyto(fetch, config, logger);

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

