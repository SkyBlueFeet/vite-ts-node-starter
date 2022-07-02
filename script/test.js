const ts = require("typescript")
const shelljs = require('shelljs');
const fs = require('fs')
const {
    ChildProcess,
    exec,
    spawn
} = require("child_process");

const {
    
} = require('child_process');

const formatHost = {
    getCanonicalFileName: path => path,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine
};

function watchMain(afterCompiler) {
    const configPath = ts.findConfigFile(
        /*searchPath*/
        "../",
        ts.sys.fileExists,
        "tsconfig.dev.json"
    );
    if (!configPath) {
        throw new Error("Could not find a valid 'tsconfig.json'.");
    }

    // TypeScript 可以使用几种不同的程序创建“策略”：
    // * ts.createEmitAndSemanticDiagnosticsBuilderProgram
    // * ts.createSemanticDiagnosticsBuilderProgram
    // * ts.createAbstractBuilder

    // 前两个 API 产生“生成器程序”。
    // 它们使用增量策略仅重新检查和发出文件，这些文件内容可能已经更改
    // 或者其依赖项可能发生改变，这些更改可能会影响先前的类型检查和发出结果的更改
    // 最后一个 API 会在每个更改后都会执行完整的类型检查。
    // 在 `createEmitAndSemanticDiagnosticsBuilderProgram` 和 `createSemanticDiagnosticsBuilderProgram` 唯一的区别是不会 emit
    // 对于纯类型检查场景，或者当另一个工具/进程处理发出时，使用 `createSemanticDiagnosticsBuilderProgram` 获取会更可取
    const createProgram = ts.createSemanticDiagnosticsBuilderProgram;

    // 注意，`createWatchCompilerHost` 还有一个重载，它需要一组根文件。
    const host = ts.createWatchCompilerHost(
        configPath, {
            module: 'commonjs'
        },
        ts.sys,
        createProgram,
        reportDiagnostic,


        /**
         * 每次监视状态更改时，都会打印出诊断信息
         * 这主要用于例如 “开始编译” 或 “编译完成” 之类的消息。
         * @params {{ts.Diagnostic}} disgnostic
         */
        function reportWatchStatusChanged(diagnostic) {
            console.info(ts.formatDiagnostic(diagnostic, formatHost));
            afterCompiler(arguments)
        }
    );

    // 从技术上讲，你可以覆盖主机上的任何给定钩子函数，尽管你可能不需要这样做。
    // 注意，我们假设 `origCreateProgram` 和 `origPostProgramCreate` 根本不使用 `this`。
    const origCreateProgram = host.createProgram
    /**
     * 
     * @param {ReadonlyArray<string>} rootNames 
     * @param {*} options 
     * @param {*} host 
     * @param {*} oldProgram 
     * @returns 
     */
    host.createProgram = (rootNames, options, host, oldProgram) => {
        console.log("** We're about to create the program! **");
        return origCreateProgram(rootNames, options, host, oldProgram);
    };

    const origPostProgramCreate = host.afterProgramCreate;
    host.afterProgramCreate = program => {
        console.log("** We finished making the program! **");
        origPostProgramCreate(program);
    };

    // `createWatchProgram` 创建一个初始程序、监视文件，并随着时间的推移更新更新程序。
    ts.createWatchProgram(host);
}

/**
 * 
 * @param {ts.Diagnostic} diagnostic 
 */
function reportDiagnostic(diagnostic) {

    console.error("Error", diagnostic.code, ":", ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine()));
}

/**
 * 每次监视状态更改时，都会打印出诊断信息
 * 这主要用于例如 “开始编译” 或 “编译完成” 之类的消息。
 * @params {{ts.Diagnostic}} disgnostic
 */
function reportWatchStatusChanged(diagnostic) {
    console.log('reportWatchStatusChanged')
    console.info(ts.formatDiagnostic(diagnostic, formatHost));
}

function runServer() {
    const out = fs.openSync('./out.log', 'a'); // Capture output stream
    const err = fs.openSync('./out.log', 'a');

    return exec('node -r tsconfig-paths/register server/index.js')
}

function exit(pid) {
    shelljs.exec(`taskkill /pid ${pid}  -t  -f`)
}


let lastPid=0
/**
 * @type {fs.ChildProcessWithoutNullStreams }
 */
let lastProcess

watchMain((argv) => {
    if (argv[0].messageText.indexOf('Watching for file changes') > 0) {

        if (lastProcess) {
            // exit(lastProcess)
            console.info('start restore process')
            // lastProcess.pid
            lastProcess = runServer()

        } else {
            lastProcess = runServer()
            // process.kill(lastProcess.pid,'SIGHUP')
        }


    }
    // console.count('watch')
    // 
})