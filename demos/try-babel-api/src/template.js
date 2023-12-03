/* eslint-disable @typescript-eslint/no-var-requires */
const { default: template } = require('@babel/template')
const types = require('@babel/types')

const node = template('if (a === 1) {}')()

console.log(types.isIfStatement(node))
