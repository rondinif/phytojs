import { terser } from 'rollup-plugin-terser';
export default [
    {
        input: 'src/main.js',
        // plugins: [terser()],
        output: {
            file: 'umd/phyto.js',
            format: 'umd',
            name: 'phyto',
            esModule: false
        }
    },
    {
        input: 'src/main.js',
        output: {
            file: 'esm/index.js',
            format: 'esm'
        }
    },
    {
        input: 'src/config/config.js',
        // plugins: [terser()],
        output: {
            file: 'umd/config.js',
            format: 'umd',
            name: 'config',
            esModule: false
        }
    },
    {
        input: 'src/config/config.js',
        output: {
            file: 'esm/config.js',
            format: 'esm'
        }
    }
];