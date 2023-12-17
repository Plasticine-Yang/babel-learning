import type * as BabelNamespace from '@babel/core'

type Babel = typeof BabelNamespace

export function babelPlugin(babel: Babel): BabelNamespace.PluginObj {
  return {
    name: '@babel-learning/babel-plugin-{{kebabCase packageName}}',
    visitor: {},
  }
}
