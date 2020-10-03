/*
Attenzione il main.js va messo in fondo
perchè importa gli esm che vanno generati prima
questa scelta è stata fatta per mantenere separati i vari moduli
e garantire una elevata coverage dei test
*/
const config = [
	{
		input: 'src/config/config.js',
		external: ['dotenv-flow'],
		// Plugins: [terser()],
		output: {
			file: 'umd/config.js',
			format: 'umd',
			name: 'config',
			esModule: false,
			globals: {
				'dotenv-flow': 'dotenv'
			}
		}
	},
	{
		input: 'src/config/config.js',
		external: ['dotenv-flow'],
		output: {
			file: 'esm/config.js',
			format: 'esm',
			globals: {
				'dotenv-flow': 'dotenv'
			}
		}
	},

	{
		input: 'src/config/logconfig.js',
		external: ['dotenv-flow'],
		// Plugins: [terser()],
		output: {
			file: 'umd/logconfig.js',
			format: 'umd',
			name: 'logconfig',
			esModule: false,
			globals: {
				'dotenv-flow': 'dotenv'
			}
		}
	},
	{
		input: 'src/config/logconfig.js',
		external: ['dotenv-flow'],
		output: {
			file: 'esm/logconfig.js',
			format: 'esm',
			globals: {
				'dotenv-flow': 'dotenv'
			}
		}
	},

	{
		input: 'src/log/log.js',
		// Plugins: [terser()],
		output: {
			file: 'umd/log.js',
			format: 'umd',
			name: 'log',
			esModule: false
		}
	},
	{
		input: 'src/log/log.js',
		output: {
			file: 'esm/log.js',
			format: 'esm'
		}
	},

	{
		external: [
			'dotenv-flow',
			'../esm/config',
			'../esm/logconfig',
			'../esm/log'
		],
		input: 'src/main.js',
		// Plugins: [terser()],
		output: {
			file: 'umd/phyto.js',
			format: 'umd',
			name: 'phyto',
			esModule: false
		}
	},
	{
		external: [
			'dotenv-flow',
			'../esm/config',
			'../esm/logconfig',
			'../esm/log'
		],
		input: 'src/main.js',
		output: {
			file: 'esm/phyto.js',
			format: 'esm'
		}
	}
];

export default config;
