require('./env')
const rimraf = require('rimraf')
const {promisify} = require('util')
const path = require('path')

/**
 * @type import('consola').Consola
 */
const consola = require('consola')

function clean(rootPath) {
    return promisify(rimraf)(rootPath).then(() => {
        consola.info(rootPath + ' 已删除!')
    })
}

exports.clean = clean


if (process.argv.includes('-d')) {
    clean(path.resolve(process.env.DEST))
}

if (process.argv.includes('-p')) {
    clean(path.resolve(process.env.DATABASE_DIR, "*"))
}