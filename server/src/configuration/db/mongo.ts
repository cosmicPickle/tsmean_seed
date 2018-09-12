export const mongoConfig = {
    host: 'ds223019.mlab.com:23019/test_seed',
    user: 'cosmicSeed',
    password: 'csmsd123',
    db: 'test_seed'
}

export const mongoTestingConfig = {
    host: 'ds046677.mlab.com:46677/integration_testing',
    user: 'integrationTester',
    password: 'int123',
    db: 'integration_testing'
}

const connect: string = `mongodb://${mongoConfig.user}:${mongoConfig.password}@${mongoConfig.host}`;
const connectTesting: string = `mongodb://${mongoTestingConfig.user}:${mongoTestingConfig.password}@${mongoTestingConfig.host}`;
export { connect, connectTesting };