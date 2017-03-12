'use strict'

const childProcess = require('child_process')
const path = require('path')
const fs = require('fs')
const fsextra = require('fs-extra')

const CONFIG = require('../config')
const downloadFileFromGithub = require('./download-file-from-github')
require('colors')

module.exports = function () {

  let exist = fs.existsSync(path.join(CONFIG.apmRootPath, 'node_modules/atom-package-manager/lib/cli.js'))
  if (!exist) {
    const apmRepoPath = CONFIG.apmMetadata.repository['url']
    console.log(`download code from ${apmRepoPath}`)
    const apmPath = path.join(CONFIG.apmRootPath, 'node_modules', 'atom-package-manager')
    fsextra.ensureDirSync(apmPath)
    downloadFileFromGithub(apmRepoPath, apmPath)

    console.log(`${CONFIG.getNpmBinPath()} install ${apmPath}`)
    childProcess.execFileSync(
      CONFIG.getNpmBinPath(),
      ['--global-style', '--loglevel=error', 'install'],
      {env: process.env, cwd: path.join(CONFIG.apmRootPath, 'node_modules', 'atom-package-manager')}
    )
  } else {
    console.log('Apm already installed, Skipping'.gray)
  }
}
