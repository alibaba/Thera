'use strict'
const assert = require('assert')
const childProcess = require('child_process')
const electronPackager = require('electron-packager')
const fs = require('fs-extra')
const includePathInPackagedApp = require('./include-path-in-packaged-app')
const getLicenseText = require('./get-license-text')
const path = require('path')
const spawnSync = require('./spawn-sync')
const mkdirp = require('mkdirp')
const glob = require('glob')
require('colors')

const CONFIG = require('../config')

module.exports = function () {
  const appName = getAppName()
  console.log(`Running electron-packager on ${CONFIG.intermediateAppPath} with app name "${appName}"`)
  return runPackager({
    'app-bundle-id': 'com.tmall.thera',
    'app-copyright': `Copyright © 2014-${(new Date()).getFullYear()} GitHub, Inc. All rights reserved.`,
    'app-version': CONFIG.appMetadata.version,
    'arch': process.platform === 'win32' ? 'ia32' : 'x64',
    'asar': {unpack: buildAsarUnpackGlobExpression()},
    'build-version': CONFIG.appMetadata.version,
    'download': {cache: CONFIG.electronDownloadPath},
    'dir': CONFIG.intermediateAppPath,
    'extend-info': path.join(CONFIG.repositoryRootPath, 'resources', 'mac', 'atom-Info.plist'),
    'helper-bundle-id': 'com.github.atom.helper',
    'icon': getIcon(),
    'name': appName,
    'out': CONFIG.buildOutputPath,
    'overwrite': true,
    'platform': process.platform,
    'version': CONFIG.appMetadata.electronVersion,
    'version-string': {
      'CompanyName': 'GitHub, Inc.',
      'FileDescription': 'Atom',
      'ProductName': 'Atom'
    }
  }).then((packagedAppPath) => {
    let bundledResourcesPath
    if (process.platform === 'darwin') {
      bundledResourcesPath = path.join(packagedAppPath, 'Contents', 'Resources')
      setAtomHelperVersion(packagedAppPath)
    } else if (process.platform === 'linux') {
      bundledResourcesPath = path.join(packagedAppPath, 'resources')
      chmodNodeFiles(packagedAppPath)
    } else {
      bundledResourcesPath = path.join(packagedAppPath, 'resources')
    }

    // install attaching packages
    installAttachPackages(packagedAppPath, bundledResourcesPath)

    copyAttachResources(packagedAppPath, bundledResourcesPath)

    copyResourceInPackage(packagedAppPath, bundledResourcesPath)

    return copyNonASARResources(packagedAppPath, bundledResourcesPath).then(() => {
      console.log(`Application bundle created at ${packagedAppPath}`)
      return packagedAppPath
    })
  })
}

function installAttachPackages (packagedAppPath, bundledResourcesPath) {
  console.log('install attaching packages')

  let packageConfig = JSON.parse(fs.readFileSync(path.join(CONFIG.repositoryRootPath, 'package.json')))
  const attachPackage = packageConfig['attach-package']
  if (attachPackage) {
    Object.keys(attachPackage).forEach((key) => {
      if (!attachPackage.hasOwnProperty(key)) return

      let gitPath = attachPackage[key]
      let packagePath = path.join(CONFIG.repositoryRootPath, 'attach-package')

      let attachPackageDesp
      let preVer = 'do not exist'

      if (fs.existsSync(path.join(packagePath, 'node_modules', key))) {
        attachPackageDesp = fs.readJsonSync(path.join(packagePath, 'node_modules', key, 'package.json'))
        preVer = attachPackageDesp._from
      }

      if (gitPath === preVer) {
        console.log(`skip package ${key} install, exist version ${preVer}`.gray)
        return
      }

      try {
        if (gitPath.startsWith('git') || gitPath.startsWith('http')) {
          console.log(`Install package ${key} to ${packagePath} path ${gitPath}, previous version ${preVer}`)
          childProcess.execFileSync(
            CONFIG.getNpmBinPath(),
            ['install', gitPath, '--global-style', '--loglevel=error'],
            {env: process.env, cwd: packagePath, stdio:'inherit'}
          )
        } else {
          console.log(`Install package ${key} to ${packagePath} version ${gitPath}`)
          childProcess.execFileSync(
            CONFIG.getNpmBinPath(),
            ['install', `${key}@${gitPath}`, '--global-style', '--loglevel=error'],
            {env: process.env, cwd: packagePath, stdio:'inherit'}
          )
        }
      } catch (error) {
        console.log(`Npm install ${key} failed, apm install again`)

        childProcess.execFileSync(
          CONFIG.getApmBinPath(),
          ['install', `${key}@${gitPath}`, '--global-style', '--loglevel=error'],
          {env: process.env, cwd: path.join(packagePath, 'node_modules', key), stdio:'inherit'}
        )
      }
    })

    console.log(`Copy attach package from ${path.join(CONFIG.repositoryRootPath, 'attach-package', 'node_modules')} to ${path.join(bundledResourcesPath, 'attach-package')}`)
    mkdirp.sync(path.join(bundledResourcesPath, 'attach-package'))
    fs.copySync(
      path.join(CONFIG.repositoryRootPath, 'attach-package', 'node_modules'),
      path.join(bundledResourcesPath, 'attach-package'),
      {recursive: true},
      (err) => {
        if (err) throw err
      })
  }
}

function copyResourceInPackage (packagedAppPath, bundledResourcesPath) {
  console.log('copyResourceInPackage')
  findAndCopyResourceInPackage(path.join(CONFIG.repositoryRootPath, 'node_modules', '*', 'package.json'), bundledResourcesPath)
  findAndCopyResourceInPackage(path.join(CONFIG.repositoryRootPath, 'attach-package', 'node_modules', '*', 'package.json'), bundledResourcesPath)
}

function findAndCopyResourceInPackage (searchPath, bundledResourcesPath) {
  glob.sync(searchPath)
  .map((packagePath) => {
    return {
      packagePath: packagePath,
      obj: fs.readJsonSync(packagePath)
    } })
  .filter((info) => {
    if (info.obj.attachResource) {
      console.log(`find resource ${info.obj.attachResource}`)
    }
    return info.obj.attachResource !== undefined
  })
  .forEach((info) => {
    let arr = info.packagePath.split(path.sep)
    let dirName = arr[arr.length - 2]

    let fromPath = path.join(path.dirname(info.packagePath), info.obj.attachResource)
    let toPath = path.join(bundledResourcesPath, 'attach-resources', dirName, info.obj.attachResource)
    console.log(`copy ${fromPath} to ${toPath}`)
    fs.copySync(fromPath, toPath, {recursive: true})
  })
}

function copyAttachResources (packagedAppPath, bundledResourcesPath) {
  let fromPath = path.join(CONFIG.repositoryRootPath, 'attach-resources')
  let toPath = path.join(bundledResourcesPath, 'attach-resources')
  console.log(`copy resources from ${fromPath} to ${toPath}`)

  fs.copySync(
    fromPath,
    toPath,
    {recursive: true},
    (err) => {
      if (err) throw err
    }
  )

  // copy package version infos
  fromPath = path.join(CONFIG.repositoryRootPath, 'out', 'app', 'package.json')
  toPath = path.join(bundledResourcesPath, 'attach-resources', 'package.json')
  console.log(`Copying ${fromPath} to "${toPath}"`)
  fs.copySync(fromPath, toPath)
}

function copyNonASARResources (packagedAppPath, bundledResourcesPath) {
  console.log(`Copying non-ASAR resources to ${bundledResourcesPath}`)
  fs.copySync(
    path.join(CONFIG.repositoryRootPath, 'apm', 'node_modules', 'atom-package-manager'),
    path.join(bundledResourcesPath, 'app', 'apm'),
    {filter: includePathInPackagedApp}
  )

  fs.copySync(
    path.join(CONFIG.repositoryRootPath, 'package.json'),
    path.join(path.join(bundledResourcesPath, 'package.json'))
  )

  if (process.platform !== 'win32') {
    // Existing symlinks on user systems point to an outdated path, so just symlink it to the real location of the apm binary.
    // TODO: Change command installer to point to appropriate path and remove this fallback after a few releases.
    fs.symlinkSync(path.join('..', '..', 'bin', 'apm'), path.join(bundledResourcesPath, 'app', 'apm', 'node_modules', '.bin', 'apm'))
    fs.copySync(path.join(CONFIG.repositoryRootPath, 'atom.sh'), path.join(bundledResourcesPath, 'app', 'atom.sh'))
  }
  if (process.platform === 'darwin') {
    fs.copySync(path.join(CONFIG.repositoryRootPath, 'resources', 'mac', 'file.icns'), path.join(bundledResourcesPath, 'file.icns'))
  } else if (process.platform === 'linux') {
    fs.copySync(path.join(CONFIG.repositoryRootPath, 'resources', 'app-icons', CONFIG.channel, 'png', '1024.png'), path.join(packagedAppPath, 'atom.png'))
  } else if (process.platform === 'win32') {
    [ 'atom.cmd', 'atom.sh', 'atom.js', 'apm.cmd', 'apm.sh', 'file.ico' ]
      .forEach(file => fs.copySync(path.join('resources', 'win', file), path.join(bundledResourcesPath, 'cli', file)))
  }
  

  console.log(`Writing LICENSE.md to ${bundledResourcesPath}`)
  return getLicenseText().then((licenseText) => {
    fs.writeFileSync(path.join(bundledResourcesPath, 'LICENSE.md'), licenseText)
  })
}

function setAtomHelperVersion (packagedAppPath) {
  const frameworksPath = path.join(packagedAppPath, 'Contents', 'Frameworks')
  const helperPListPath = path.join(frameworksPath, 'Atom Helper.app', 'Contents', 'Info.plist')
  console.log(`Setting Atom Helper Version for ${helperPListPath}`)
  spawnSync('/usr/libexec/PlistBuddy', ['-c', `Add CFBundleVersion string ${CONFIG.appMetadata.version}`, helperPListPath])
  spawnSync('/usr/libexec/PlistBuddy', ['-c', `Add CFBundleShortVersionString string ${CONFIG.appMetadata.version}`, helperPListPath])
}

function chmodNodeFiles (packagedAppPath) {
  console.log(`Changing permissions for node files in ${packagedAppPath}`)
  childProcess.execSync(`find "${packagedAppPath}" -type f -name *.node -exec chmod a-x {} \\;`)
}

function buildAsarUnpackGlobExpression () {
  const unpack = [
    '*.node',
    'ctags-config',
    'ctags-darwin',
    'ctags-linux',
    'ctags-win32.exe',
    path.join('**', 'node_modules', 'spellchecker', '**'),
    path.join('**', 'resources', 'atom.png')
  ]

  return `{${unpack.join(',')}}`
}

function getAppName () {
  if (process.platform === 'darwin') {
    return CONFIG.channel === 'beta' ? 'Thera Beta' : 'Thera'
  } else {
    return 'thera'
  }
}

function getIcon () {
  switch (process.platform) {
    case 'darwin':
      return path.join(CONFIG.repositoryRootPath, 'resources', 'app-icons', CONFIG.channel, 'thera.icns')
    case 'linux':
      // Don't pass an icon, as the dock/window list icon is set via the icon
      // option in the BrowserWindow constructor in atom-window.coffee.
      return null
    default:
      return path.join(CONFIG.repositoryRootPath, 'resources', 'app-icons', CONFIG.channel, 'thera.ico')
  }
}

function runPackager (options) {
  let immediateID = setImmediate(() => console.log('packaging...'), 5 * 60 * 1000)
  return new Promise((resolve, reject) => {
    electronPackager(options, (err, packageOutputDirPaths) => {
      clearImmediate(immediateID)
      if (err) {
        reject(err)
        throw new Error(err)
      } else {
        assert(packageOutputDirPaths.length === 1, 'Generated more than one electron application!')
        const packagedAppPath = renamePackagedAppDir(packageOutputDirPaths[0])
        resolve(packagedAppPath)
      }
    })
  })
}

function renamePackagedAppDir (packageOutputDirPath) {
  let packagedAppPath
  if (process.platform === 'darwin') {
    const appBundleName = getAppName() + '.app'
    packagedAppPath = path.join(CONFIG.buildOutputPath, appBundleName)
    if (fs.existsSync(packagedAppPath)) fs.removeSync(packagedAppPath)
    fs.renameSync(path.join(packageOutputDirPath, appBundleName), packagedAppPath)
  } else if (process.platform === 'linux') {
    const appName = CONFIG.channel === 'beta' ? 'thera-beta' : 'thera'
    let architecture
    if (process.arch === 'ia32') {
      architecture = 'i386'
    } else if (process.arch === 'x64') {
      architecture = 'amd64'
    } else {
      architecture = process.arch
    }
    packagedAppPath = path.join(CONFIG.buildOutputPath, `${appName}-${CONFIG.appMetadata.version}-${architecture}`)
    if (fs.existsSync(packagedAppPath)) fs.removeSync(packagedAppPath)
    fs.renameSync(packageOutputDirPath, packagedAppPath)
  } else {
    const appName = CONFIG.channel === 'beta' ? 'Thera Beta' : 'Thera'
    packagedAppPath = path.join(CONFIG.buildOutputPath, appName)
    if (fs.existsSync(packagedAppPath)) fs.removeSync(packagedAppPath)
    fs.renameSync(packageOutputDirPath, packagedAppPath)
  }
  return packagedAppPath
}
