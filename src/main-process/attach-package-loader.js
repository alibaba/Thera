'use strict';

const path = require('path')
const child_process = require('child_process')
const {dialog, app} = require('electron')
const fs = require('fs')

// link all attach packages with apm

module.exports = function () {
  
  const apmPath = getApmPath();
  const attachPackage = path.join(process.resourcesPath, 'attach-package');
  fs.readdir(
    attachPackage,
    (error, files) => {
      if (!error) {
        files.filter((name) => name!=="." && name!=='..').forEach((name) => {
          if (name !== 'dumplings') {
            child_process.execFile(
              apmPath,
              ['link'],
              {cwd: path.join(attachPackage, name), stdio: 'inherit'}
            );
          }
        });
      } else {
        console.error(error);
      }
    });
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