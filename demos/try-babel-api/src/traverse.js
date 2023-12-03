/* eslint-disable @typescript-eslint/no-var-requires */
const { parse } = require('@babel/parser')
const { default: traverse } = require('@babel/traverse')

const ast = parse("const foo = 'foo'")

traverse(ast, {
  // Declaration(path, state) {
  //   console.log(path, state)
  // },

  Declaration: {
    enter(path, state) {
      console.log('enter', path, state)
      path.state = { foo: 'foo' }
    },
    exit(path, state) {
      console.log('exit', path, state)
    },
  },
})
