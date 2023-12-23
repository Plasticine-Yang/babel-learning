import type { Node, NodePath, PluginObj } from '@babel/core'

import { resolveOptions } from './helpers'
import { addInstrumentModuleImport, instrumentFunctionCall } from './logics'
import type { Babel, BabelPluginInstrumentOptions, BabelPluginInstrumentState, FunctionCallNode } from './types'

export function babelPluginInstrument(babel: Babel, options: BabelPluginInstrumentOptions): PluginObj {
  const resolvedOptions = resolveOptions(options)

  return {
    name: '@babel-learning/babel-plugin-instrument',
    visitor: {
      Program: {
        enter(path, state) {
          const typedState: BabelPluginInstrumentState = state
          addInstrumentModuleImport(babel, path, typedState, resolvedOptions)
        },
      },
      'FunctionDeclaration|FunctionExpression|ArrowFunctionExpression|ClassMethod|ObjectMethod': {
        enter(path: NodePath<Node | FunctionCallNode>, state) {
          const typedState: BabelPluginInstrumentState = state
          instrumentFunctionCall(babel, path as NodePath<FunctionCallNode>, typedState)
        },
      },
    },
  }
}
