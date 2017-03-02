'use strict'

const childProcess = require('child_process')
const path = require('path')
const fs = require('fs')

const CONFIG = require('../config')

module.exports = function () {

  let stats = fs.statSync(path.join(CONFIG.apmRootPath, 'node_modules/atom-package-manager/lib/cli.js'))
  if (!stats.isFile()) {
    childProcess.execFileSync(
      CONFIG.getTnpmBinPath(),
      ['--global-style', '--loglevel=error', 'install'],
      {env: process.env, cwd: CONFIG.apmRootPath}
    )

    childProcess.execFileSync(
      CONFIG.getTnpmBinPath(),
      ['--global-style', '--loglevel=error', 'install'],
      {env: process.env, cwd: path.join(CONFIG.apmRootPath, 'node_modules', 'atom-package-manager')}
    )
  } else {
    console.log('Skipping apm install')
  }
}
