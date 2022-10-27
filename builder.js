import fs from 'fs'
import path from 'path'
import cmd from 'child_process'
import lsFiles from 'node-ls-files'

class Build {
  #getCommand(path) {
    return `tsc -p ${path}`
  }

  cjsCmd = 'tsconfig-cjs.json'
  mjsCmd = 'tsconfig-mjs.json'

  readmeFile = './README.md'
  readmeOutFile = './README.md'

  packageDir = './dist'
  mjsBuildDir = './mjs'
  cjsBuildDir = './cjs'

  __nodeCode = `// CommonJs module feature 
import{fileURLToPath as ______file___URL___To___Path______}from'url';
let __filename=______file___URL___To___Path______(import.meta.url);
let __dirname=______file___URL___To___Path______(new URL('.',import.meta.url));
`

  constructor() {
    this.cjsCmd = this.#getCommand(this.cjsCmd)
    this.mjsCmd = this.#getCommand(this.mjsCmd)

    this.packageDir = path.resolve(this.packageDir)
    this.cjsBuildDir = path.join(this.packageDir, this.cjsBuildDir)
    this.mjsBuildDir = path.join(this.packageDir, this.mjsBuildDir)
  }

  build() {
    this.cleanBuild()
    this.copyFiles()

    this.runCjsBuild()
    this.runMjsBuild()
  }

  cleanBuild() {
    const list = [this.mjsBuildDir, this.cjsBuildDir]

    list.forEach((item) => {
      if (fs.existsSync(item)) {
        fs.rmSync(item, { recursive: true, force: true })
      }
    })
  }

  copyFiles() {
    this.addPackageData(this.packageDir, 'commonjs')
    this.addPackageData(this.cjsBuildDir, 'commonjs')
    this.addPackageData(this.mjsBuildDir, 'module')
  }

  runCjsBuild() {
    cmd.execSync(this.cjsCmd)
  }

  runMjsBuild() {
    cmd.execSync(this.mjsCmd)

    const files = lsFiles.sync(this.mjsBuildDir, {
      filter: /\.m?js$/,
    })
    files.forEach((file) => this.prepend__nodeCode(file))
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

export default new Build()
