'use strict'

const childProcess = require('child_process')
const path = require('path')
const fs = require('fs')

const fsextra = require('fs-extra')
const CONFIG = require('../config')
const ghdownload = require('github-download')
require('colors')

module.exports = function () {

  
  let exist = fs.existsSync(path.join(CONFIG.apmRootPath, 'node_modules/atom-package-manager/lib/cli.js'))
  if (!exist) {
    const apmRepoPath = CONFIG.apmMetadata.repository['url']
    
    const apmPath = path.join(CONFIG.apmRootPath, 'node_modules', 'atom-package-manager')
    // downloadFileFromGithub(apmRepoPath, apmPath)
    var done = false
    console.log(`download code from ${apmRepoPath} to ${apmPath}`)
    fsextra.ensureDirSync(apmPath)
    ghdownload(apmRepoPath, apmPath).on('end', () => {
      done = true
    })

    while(!done) {
      require('deasync').sleep(1000)
      process.stdout.write('.')
    }
    fs.chmodSync(CONFIG.getApmBinPath(), 511)
    fs.chmodSync(CONFIG.getNpmBinPath(), 511)
    console.log(`${CONFIG.getNpmBinPath()} install to ${apmPath}`)
      childProcess.execFileSync(
        CONFIG.getNpmBinPath(),
        ['--global-style', '--loglevel=error', 'install'],
        {env: process.env, cwd: path.join(CONFIG.apmRootPath, 'node_modules', 'atom-package-manager')}
      )

  } else {
    console.log('Apm already installed, Skipping'.gray)
  }
}
