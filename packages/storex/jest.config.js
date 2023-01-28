const { defaults: tsjPreset } = require('ts-jest/presets')

/** @type {import('jest').Config} */
module.exports = {
	silent: false,
	collectCoverageFrom: ['src/*.ts'],
	coverageDirectory: 'coverage',
	coveragePathIgnorePatterns: ['/node_modules/'],
	moduleFileExtensions: ['ts', 'js'],
	moduleDirectories: ['node_modules'],
      testEnvironment: 'jsdom',
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1'
	},
	watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
	transform: {
		...tsjPreset.transform
	}
}
