/* eslint-disable @typescript-eslint/no-var-requires */
const { default: template } = require('@babel/template')
const { default: generator } = require('@babel/generator')
const types = require('@babel/types')

const node = template("const name = 'NAME'")({ NAME: types.stringLiteral('foo') })

const { code, map } = generator(node, { sourceMaps: true })

code

map
