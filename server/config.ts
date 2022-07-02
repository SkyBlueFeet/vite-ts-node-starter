import path from "path";

import YAML from "yaml";

export const NODE_ENV = process.env.NODE_ENV

function resolve(argv:string) {
    return path.resolve(process.cwd(), argv)
}

const fs = require('fs')

const AppConfig = YAML.parse(
    fs.readFileSync(resolve('./config.yml')).toString()
)

const env:Record<string,string> = {
    SERVER_PORT: AppConfig.ServerConfig.Port,
    CLIENT_PORT: AppConfig.ClientConfig.Port,
    CLIENT_DEST: AppConfig.ServerConfig.HtmlDir
}


for (const key of Object.keys(env)) {
    process.env[key] = env[key]
}


export const PORT = Number(process.env.SERVER_PORT);
export const CLIENT_PORT = Number(process.env.CLIENT_PORT);
export const SERVER_PORT = Number(process.env.SERVER_PORT);
export const DEST = process.env.DEST;
export const CLIENT_DEST = process.env.CLIENT_DEST;
