import type * as BabelNamespace from '@babel/core'

type Babel = typeof BabelNamespace

export interface BabelPluginInstrumentOptions {
  /** 插桩模块的路径 - 可以是一个 npm 包 or 一个路径 */
  instrumentModulePath: string
}

export function babelPluginInstrument(babel: Babel, options: BabelPluginInstrumentOptions): BabelNamespace.PluginObj {
  const { instrumentModulePath } = options

  return {
    name: '@babel-learning/babel-plugin-instrument',
    visitor: {},
  }
}
