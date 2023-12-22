import type { NodePath, types } from '@babel/core'
import { addDefault } from '@babel/helper-module-imports'

import type { ResolvedBabelPluginInstrumentOptions } from '@/types'

/** 插入 import AST 节点，并返回插入后的导入语句的模块 id */
export function addInstrumentModuleImportAST(
  path: NodePath<types.Program>,
  options: ResolvedBabelPluginInstrumentOptions,
): string {
  const { instrumentModulePath, instrumentModuleName } = options

  const identifier = addDefault(path, instrumentModulePath, { nameHint: instrumentModuleName })
  const { name } = identifier

  return name
}
