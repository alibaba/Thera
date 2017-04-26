const downloadFileFromGithub = require('./download-file-from-github')
const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const spawnSync = require('./spawn-sync')
const CONFIG = require('../config')

// sign using local certificate
// codesign -s '3rd Party Mac Developer Application: Zhejiang Taobao Mall Technology Co,Ltd. (EAA28CVMQM)' --deep --force Thera.app --verbose 
module.exports = function (packagedAppPath) {
  // const keychain = '/Library/Keychains/System.keychain'

  // Cause of permission issue, cannot add cer to keychain automaticaly.
  // Open certificate manually, if not exist in keychain
  try { 
    // const codeSignPath = path.join(CONFIG.repositoryRootPath, 'sign', 'mac.cer')

    console.log(`Code-signing application at ${packagedAppPath}`)
    spawnSync('codesign', [
      '--deep', '--force', '--verbose',
      '--sign', '3rd Party Mac Developer Application: Zhejiang Taobao Mall Technology Co,Ltd. (EAA28CVMQM)', packagedAppPath
    ], {stdio: 'inherit'})

    // double sign package, cause helper makes sign failed.
    // TODO solve this issue later.
    console.log(`Code-signing application at ${packagedAppPath} second time.`)
    spawnSync('codesign', [
      '--deep', '--force', '--verbose',
      '--sign', '3rd Party Mac Developer Application: Zhejiang Taobao Mall Technology Co,Ltd. (EAA28CVMQM)', packagedAppPath
    ], {stdio: 'inherit'})

    // check sign result
    spawnSync('codesign', [
      '-vv', packagedAppPath
    ], {stdio: 'inherit'})

  } catch (err) {
    throw err
  }
}
