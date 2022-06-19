const path = require('path')
const _ = require('lodash')
const YAML = require('yaml')

const NODE_ENV = process.env.NODE_ENV

function resolve(argv) {
    return path.resolve(process.cwd(), argv)
}

const fs = require('fs')

const buildConfig = YAML.parse(
    fs.readFileSync(resolve('./build.yml')).toString()
)

const AppConfig = YAML.parse(
    fs.readFileSync(resolve('./config.yml')).toString()
)

const env = {
    SERVER_PORT: AppConfig.ServerConfig.Port,
    CLIENT_PORT: AppConfig.ClientConfig.Port,
}

_.assign(env, buildConfig)

for (const key of Object.keys(env)) {
    process.env[key] = env[key]
}

module.exports = {
    ...env
}
