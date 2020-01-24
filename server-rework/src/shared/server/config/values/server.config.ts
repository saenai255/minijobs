import ServerConfiguration from "../server.config";

export const serverConfiguration: ServerConfiguration =  {
    production: !!process.env.PRODUCTION,
    basePath: process.env.BASE_PATH || '/'
}