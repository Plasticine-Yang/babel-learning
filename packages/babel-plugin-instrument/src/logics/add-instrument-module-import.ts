import type { NodePath, types } from '@babel/core'

import { addInstrumentModuleImportAST, checkInstrumentModuleHasImported } from '@/helpers'
import type { Babel, BabelPluginInstrumentState, ResolvedBabelPluginInstrumentOptions } from '@/types'

export function addInstrumentModuleImport(
  babel: Babel,
  path: NodePath<types.Program>,
  state: BabelPluginInstrumentState,
  options: ResolvedBabelPluginInstrumentOptions,
) {
  const { template } = babel

  // 寻找已有的 import 语句中是否导入过埋点模块，是的话则更新 state
  const importedInstrumentModuleName = checkInstrumentModuleHasImported(path, options)

  if (importedInstrumentModuleName !== '') {
    state.instrumentImportName = importedInstrumentModuleName
  }

  // 没有导入过 instrumentModulePath 的话就添加一个导入节点
  if (!state.instrumentImportName) {
    const name = addInstrumentModuleImportAST(path, options)

    state.instrumentImportName = name
    state.instrumentCallAST = template.statement(`${name}()`)()
  }
}
