import type * as BabelNamespace from '@babel/core'
import type { PluginPass, types } from '@babel/core'

export interface BabelPluginInstrumentOptions {
  /** 插桩模块的路径 - 可以是一个 npm 包 or 一个路径 */
  instrumentModulePath: string

  /**
   * 插桩模块导入后的模块名，会自动加上 `_` 前缀
   *
   * 比如 `instrument` 会变成 `import _instrument from 'xxx'`
   *
   * @default instrument
   */
  instrumentModuleName?: string
}

export type Babel = typeof BabelNamespace

export type ResolvedBabelPluginInstrumentOptions = Required<BabelPluginInstrumentOptions>

export type BabelPluginInstrumentCustomState = {
  /** 导入的埋点模块名 */
  instrumentImportName?: string

  /** 调用埋点函数的 AST，用于在需要插入埋点的时候可以直接使用 AST，无需重复创建 */
  instrumentCallAST?: any
}

export type BabelPluginInstrumentState = BabelPluginInstrumentCustomState & PluginPass

export type FunctionCallNode =
  | types.FunctionDeclaration
  | types.FunctionExpression
  | types.ArrowFunctionExpression
  | types.ClassMethod
  | types.ObjectMethod
