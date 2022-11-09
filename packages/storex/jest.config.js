const { defaults: tsjPreset } = require('ts-jest/presets')

module.exports = {
	silent: false,
	collectCoverageFrom: ['src/*.ts'],
	coverageDirectory: 'coverage',
	coveragePathIgnorePatterns: ['/node_modules/'],
	moduleFileExtensions: ['ts', 'js'],
	moduleDirectories: ['node_modules'],
	testEnvironment: 'jsdom',
	watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
	transform: {
		...tsjPreset.transform
	}
}
