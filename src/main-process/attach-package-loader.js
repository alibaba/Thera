'use strict';

const path = require('path')
const child_process = require('child_process')
const {dialog, app} = require('electron')
const fs = require('fs')
const atomPaths = require('../atom-paths')

// link all attach packages with apm

module.exports = function () {
  atomPaths.setAtomHome(app.getPath('home'))
  const apmPath = getApmPath();
  const attachPackage = path.join(process.resourcesPath, 'attach-package');
  const _this = this;
  fs.exists(attachPackage, (exists) => {
    if (exists) {
      fs.readdir(
        attachPackage,
        (error, files) => {
          if (!error) {
            const linktoPath = path.join(process.env.ATOM_HOME, 'packages');
            files.filter((name) => name!=="." && name!=='..' && name !== 'dumplings').forEach((name) => {
                // fs.exists(path.join(linktoPath, name), (hasThatPackage) => {
                //   // skip packages already installed
                //   if (!hasThatPackage) {
                    _this.linkPackage(apmPath, path.join(attachPackage, name));
                //   }
                // })
            });
          } else {
            console.error(error);
          }
      });
    } else {
      console.warn(`escape attach package install, cause ${attachPackage} not exists.`);
    }
  })
}

function linkPackage(apmPath, packagePath) {
  child_process.execFile(
    apmPath,
    ['link'],
    {cwd: packagePath, stdio: 'inherit'}
  );
}

function getApmPath() {
  let commandName = 'apm';
  if (process.platform === 'win32') {
    commandName += '.cmd';
  }
  let apmRoot = path.join(process.resourcesPath, 'app', 'apm');
  let apmPath = path.join(apmRoot, 'bin', commandName);
  
  try {
    if (!fs.statSync(apmPath)) {
      apmPath = path.join(apmRoot, 'node_modules', 'atom-package-manager', 'bin', commandName);
    }
  } catch (e) {
    // apmPath not exist
    if (e.code === 'ENOENT') {
        apmPath = path.join(apmRoot, 'node_modules', 'atom-package-manager', 'bin', commandName);
    }
  }

  return apmPath;
}