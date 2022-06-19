/**
 * @description 在根目录启动本文件
 * @author skyblueFeet
 */
const {exec} = require('shelljs')

/**
 * @type import('consola').Consola
 */
const consola = require('consola')
const path = require('path')


const destServer = path.resolve(process.env.DEST, process.env.SERVER_DEST);
exports.buildServerByTsc = async function buildServerPack() {
    consola.info('start Server Pack Build', '...')
    return new Promise((resolve, reject) => {
        exec(
            'npx tsc -p ./tsconfig.server.json --outDir ' + destServer,
            (code, stdout, stderr) => {
                if (stderr) {
                    if (stderr) consola.error((stderr))
                    reject(stderr)
                } else {
                    if (stdout) consola.info(stdout)
                    resolve()
                }
            }
        )
    })
}