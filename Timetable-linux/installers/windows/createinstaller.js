const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'release-builds')

  return Promise.resolve({
    appDirectory: /*path.join(rootPath)*/'/tmp/build/installer64',
    authors: 'Anthonym',
    noMsi: true,
    outputDirectory: /*path.join(outPath)*/'/tmp/build/installer64',
    exe: 'Timetable.exe',
    setupExe: 'timetable_setup.exe',
    //setupIcon: path.join(rootPath, 'assets', 'icons', 'icon.ico')
  })
}