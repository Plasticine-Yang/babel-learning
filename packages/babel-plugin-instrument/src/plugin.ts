import type { PluginObj } from '@babel/core'

import { resolveOptions } from './helpers'
import { addInstrumentModuleImport } from './logics'
import { Babel, BabelPluginInstrumentOptions, BabelPluginInstrumentState } from './types'

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
    },
  }
}
