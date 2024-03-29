import ServerConfiguration from '../types/server.config';

export const serverConfiguration: ServerConfiguration = {
    production: !!process.env.PRODUCTION,
    basePath: process.env.BASE_PATH || '/',
    serverless: !!process.env.SERVERLESS || false,
    environment: process.env.PRODUCTION ? 'production' : 'dev',
    runningCI: !!process.env.CI,
    runningTests: false,
    runningLocally: true
};
