/* eslint-disable @typescript-eslint/no-var-requires */
const { parseExpression } = require('@babel/parser')
const types = require('@babel/types')

const ast = parseExpression('if (a === 1) {}')

console.log(types.isIfStatement(ast))
