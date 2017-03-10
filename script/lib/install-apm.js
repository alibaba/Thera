'use strict'

const childProcess = require('child_process')
const path = require('path')
const fs = require('fs')

const CONFIG = require('../config')

module.exports = function () {

  let exist = fs.existsSync(path.join(CONFIG.apmRootPath, 'node_modules/atom-package-manager/lib/cli.js'))
  if (!exist) {
    childProcess.execFileSync(
      CONFIG.getNpmBinPath(),
      ['--global-style', '--loglevel=error', 'install'],
      {env: process.env, cwd: CONFIG.apmRootPath}
    )

    childProcess.execFileSync(
      CONFIG.getNpmBinPath(),
      ['--global-style', '--loglevel=error', 'install'],
      {env: process.env, cwd: path.join(CONFIG.apmRootPath, 'node_modules', 'atom-package-manager')}
    )
  } else {
    console.log('Skipping apm install')
  }
}
