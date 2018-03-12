// node autoRestart.js server.js

const fs = require('fs')
const shell = require("shelljs")
const chalk = require('chalk')
const log = console.log.bind(console)
const logVip = (...args) => log(chalk.green.bgBlack.bold(...args))

const watch = (watchPath, entryPath, thread=null) => {
  const run = () => {
    thread && thread.kill()
    thread = shell.exec('node ' + 'index.js', {async: false, silent: false})
    const date = new Date().toLocaleString()
    logVip(date, '*** File changed, restart! ***')
    thread = shell.exec('node ' + entryPath, {async: true, silent: false})
  }
  run()
  fs.watch(watchPath, run)
}

const main = () => {
  const watchPath = process.argv[2]
  const entryPath = process.argv[3]
  watch(watchPath, entryPath)
}

main()
