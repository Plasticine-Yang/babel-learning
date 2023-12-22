import type { NodePath, types } from '@babel/core'

import type { ResolvedBabelPluginInstrumentOptions } from '@/types'

/** 遍历检查代码中是否已经导入过埋点模块 */
export function checkInstrumentModuleHasImported(
  path: NodePath<types.Program>,
  options: ResolvedBabelPluginInstrumentOptions,
) {
  const { instrumentModulePath } = options
  let importedInstrumentModuleName: string = ''

  path.traverse({
    ImportDeclaration(currentPath) {
      const importedPath = currentPath.get('source').node.value

      // 代码中已经导入过埋点模块，仅更新状态，不插入导入节点
      if (importedPath === instrumentModulePath) {
        const specifierPath = currentPath.get('specifiers.0') as NodePath<types.Node>

        if (
          specifierPath.isImportSpecifier() ||
          specifierPath.isImportDefaultSpecifier() ||
          specifierPath.isImportNamespaceSpecifier()
        ) {
          importedInstrumentModuleName = (
            specifierPath as NodePath<
              types.ImportSpecifier | types.ImportDefaultSpecifier | types.ImportNamespaceSpecifier
            >
          ).get('local').node.name
        }

        // 更新完状态后就无需继续遍历了
        path.stop()
      }
    },
  })

  return importedInstrumentModuleName
}
