// eslint-disable-next-line jest/no-jest-import
import type { Config } from 'jest';

const config: Config = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageDirectory: '../coverage/',
    setupFiles: ['./.jest/setEnvVars.ts', './.jest/mockUtils.ts'],
};

export default config;
