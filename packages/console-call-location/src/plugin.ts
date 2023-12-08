import type * as BabelNamespace from '@babel/core'
import { TARGET_CONSOLE_METHODS } from './constants'

type Babel = typeof BabelNamespace

export interface ConsoleCallLocationPluginOptions {
  /**
   * 是否换行插入 console 代码位置
   *
   * @default false
   */
  breakLine?: boolean
}

export function consoleCallLocationPlugin(babel: Babel): BabelNamespace.PluginObj {
  const { types: t, template } = babel

  /** 通过 ast 对应的代码来判断是否为 console 调用 */
  const isConsoleCallExpression = (code: string) => {
    const targetCalleeName = TARGET_CONSOLE_METHODS.map((method) => `console.${method}`)

    return targetCalleeName.includes(code)
  }

  const insertLocationWithBreakLine = (path: BabelNamespace.NodePath<BabelNamespace.types.CallExpression>) => {
    if ((path.shouldSkip as any).isNew) {
      return
    }

    const loc = path.node.loc

    if (loc) {
      const { line, column } = loc.start
      const newNode = template.expression(`console.log('[${line}, ${column}]')`)()
      // 对于新创建的节点无需进行遍历
      ;(newNode as any).shouldSkip = true

      if (path.findParent((p) => p.isJSXElement())) {
        path.replaceWith(t.arrayExpression([newNode, path.node]))
        path.skip()
      } else {
        path.insertBefore(newNode)
      }
    } else {
      console.warn('path.node.loc does not exist.')
    }
  }

  const insertLocation = (path: BabelNamespace.NodePath<BabelNamespace.types.CallExpression>) => {
    const loc = path.node.loc

    if (loc) {
      const { line, column } = loc.start
      path.node.arguments.unshift(t.stringLiteral(`[${line}, ${column}]`))
    } else {
      console.warn('path.node.loc does not exist.')
    }
  }

  return {
    visitor: {
      CallExpression(path, { opts }) {
        const options: ConsoleCallLocationPluginOptions = opts || {}
        const { breakLine } = options

        if (isConsoleCallExpression(path.get('callee').toString())) {
          if (breakLine) {
            insertLocationWithBreakLine(path)
          } else {
            insertLocation(path)
          }
        }
      },
    },
  }
}
