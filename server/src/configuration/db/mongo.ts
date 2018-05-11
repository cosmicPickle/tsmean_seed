export const mongoConfig = {
    host: 'ds223019.mlab.com:23019/test_seed',
    user: 'cosmicSeed',
    password: 'csmsd123',
    db: 'test_seed'
}

const connect: string = `mongodb://${mongoConfig.user}:${mongoConfig.password}@${mongoConfig.host}`;

export { connect };