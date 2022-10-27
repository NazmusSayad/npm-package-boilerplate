console.clear()
import fs from 'fs'
import path from 'path'
import cmd from 'child_process'
import lsFiles from 'node-ls-files'
import BuildConfig from './build-config.js'

class Build extends BuildConfig {
  build() {
    this.cleanBuild()
    this.copyFiles()

    this.runCjsBuild()
    this.runMjsBuild()
  }

  cleanBuild() {
    const list = [this.mjsBuildDir, this.cjsBuildDir, this.readmeOutFile]

    list.forEach((item) => {
      if (fs.existsSync(item)) {
        fs.rmSync(item, { recursive: true, force: true })
      }
    })
  }

  copyFiles() {
    fs.copyFileSync(this.readmeFile, path.join(this.packageDir, './README.md'))

    this.addPackageData(this.mjsBuildDir, 'module')
    this.addPackageData(this.cjsBuildDir, 'commonjs')
  }

  runMjsBuild() {
    cmd.execSync(this.mjsCmd)

    const files = lsFiles.sync(this.mjsBuildDir, {
      filter: /\.m?js$/,
    })
    files.forEach((file) => this.prepend__nodeCode(file))
  }

  runCjsBuild() {
    cmd.execSync(this.cjsCmd)
  }

  addPackageData(dir, type) {
    const content = {
      type,
    }
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    const target = path.join(dir, './package.json')
    fs.writeFileSync(target, JSON.stringify(content))
  }

  prepend__nodeCode(file) {
    const data = fs.readFileSync(file, 'utf-8')

    if (data.includes('__filename') || data.includes('__dirname')) {
      fs.writeFileSync(file, this.__nodeCode + data)
    }
  }
}

const build = new Build()
build.build()
