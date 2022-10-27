import path from 'path'

class BuildConfig {
  #getCommand(path) {
    return `tsc -p ${path}`
  }

  cjsCmd = 'tsconfig-cjs.json'
  mjsCmd = 'tsconfig-mjs.json'

  readmeFile = './README.md'
  readmeOutFile = './README.md'

  packageDir = './package'
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
}

export default BuildConfig
