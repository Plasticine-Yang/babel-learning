/* eslint-disable @typescript-eslint/no-var-requires */
const parser = require('@babel/parser')

const ast = parser.parse(
  `
import bar from 'bar';
const foo = 'foo';
`,
  { sourceType: 'unambiguous' },
)

ast
