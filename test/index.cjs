console.clear()
const { default: local } = require('../package/build/cjs/index.js')
console.log({ local })

console.log('-----------------------')

const { default: npm } = require('@nazmussayad/npm')
console.log({ npm })
