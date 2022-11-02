// eslint-disable-next-line jest/no-jest-import
import type { Config } from 'jest';

const config: Config = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageDirectory: '../coverage/',
};

export default config;
