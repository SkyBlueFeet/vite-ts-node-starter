/**
 * @description 在根目录启动本文件
 * @author skyblueFeet
 */

const {build: buildVite} = require('vite')
const {writeFile, stat, mkdir} = require('fs/promises')
const {cp} = require('shelljs')

/**
 * @type import('consola').Consola
 */
const consola = require('consola')
const path = require('path')

require('./env')

const {existsSync} = require('fs')

const {clean} = require('./clean')

const package = require('../package.json')
const {buildServerByWebpack} = require("./build.webpack");
const {buildServerByTsc} = require("./build.tsc");
const _ = require("lodash");

const scriptArgv = process.argv.slice(2)

const useWebpack = scriptArgv.includes('--webpack')

const pm2ConfigData = {
    name: package.name,
    script: './server/index.js',
    interpreter_args: "-r tsconfig-paths/register"
}
const pm2ConfigName = './app.config.json'

const destRoot = path.resolve(process.env.DEST)
const CopyFiles = _.get(process.env, 'CopyFiles', '').split(',')
const isRun = scriptArgv.includes('-r')

async function copyProject() {
    consola.info('start Copy Required File', '...')
    if (existsSync(destRoot)) {
        const fileStat = await stat(destRoot)

        if (!fileStat.isDirectory()) {
            await mkdir(destRoot)
        } else {
            await clean(path.resolve(destRoot, '*'))
        }
    } else {
        await mkdir(destRoot)
    }

    package.devDependencies = undefined

    package.scripts = {
        start: 'pm2 start' + ` ${pm2ConfigName}`,
        stop: 'pm2 stop' + ` ${pm2ConfigName}`,
        restart: 'pm2 restart' + ` ${pm2ConfigName}`,
        uninstall: 'pm2 kill',
        info: 'pm2 info' + ` ${pm2ConfigName}`,
    }

    await writeFile(
        path.resolve(destRoot, 'package.json'),
        JSON.stringify(package, null, 2)
    )

    await writeFile(
        path.resolve(destRoot, pm2ConfigName),
        JSON.stringify(pm2ConfigData, null, 2)
    )

    cp('-rf', CopyFiles, destRoot)

    // await promisify(copy)(['config.yml'], destRoot)
}

if (isRun) {
    copyProject()
        .then(() => {
            return useWebpack ? buildServerByWebpack() : buildServerByTsc()
        })
        .then(info => {
            if (info) consola.info(info)
            consola.success('Server Pack Build complete!')

            return buildVite()
        })
        .then(rout => {
            consola.success('Pack Success')
        })
        .catch(err => {
            consola.error(err)
        })

}

