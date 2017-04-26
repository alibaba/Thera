const childProcess = require('child_process')
const CONFIG = require('../config')
const path = require('path')

module.exports = function () {
  childProcess.spawnSync('python', [path.join(CONFIG.repositoryRootPath, 'script', 'deploy.py')], {cwd: CONFIG.repositoryRootPath, stdio: 'inherit'})
}
