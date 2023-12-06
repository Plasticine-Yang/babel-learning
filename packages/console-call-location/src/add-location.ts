/* eslint-disable @typescript-eslint/no-unused-vars */
import generate from '@babel/generator'
import { parse } from '@babel/parser'
import { expression } from '@babel/template'
import traverse, { NodePath } from '@babel/traverse'
import { CallExpression, Identifier, arrayExpression, isMemberExpression, stringLiteral } from '@babel/types'

interface AddLocationOptions {
  /**
   * 是否换行插入 console 代码位置
   *
   * @default false
   */
  breakLine?: boolean
}

const TARGET_CONSOLE_METHODS = ['log', 'info', 'error', 'debug']

export function addLocation(sourceCode: string, options?: AddLocationOptions): string {
  const { breakLine = false } = options ?? {}

  const ast = parse(sourceCode, { sourceType: 'unambiguous', plugins: ['jsx'] })

  /** 通过 ast 上的属性判断是否为 console 调用 */
  // @ts-ignore
  const isConsoleCallExpressionByAST = (path: NodePath<CallExpression>) => {
    return (
      isMemberExpression(path.node.callee) &&
      (path.node.callee.object as Identifier).name === 'console' &&
      TARGET_CONSOLE_METHODS.includes((path.node.callee.property as Identifier).name)
    )
  }

  /** 通过 ast 对应的代码来判断是否为 console 调用 */
  // @ts-ignore
  const isConsoleCallExpressionByCode = (code: string) => {
    const targetCalleeName = TARGET_CONSOLE_METHODS.map((method) => `console.${method}`)

    return targetCalleeName.includes(code)
  }

  const insertLocationWithBreakLine = (path: NodePath<CallExpression>) => {
    if ((path.shouldSkip as any).isNew) {
      return
    }

    const loc = path.node.loc

    if (loc) {
      const { line, column } = loc.start
      const newNode = expression(`console.log('[${line}, ${column}]')`)()
      // 对于新创建的节点无需进行遍历
      ;(newNode as any).shouldSkip = true

      if (path.findParent((p) => p.isJSXElement())) {
        path.replaceWith(arrayExpression([newNode, path.node]))
        path.skip()
      } else {
        path.insertBefore(newNode)
      }
    } else {
      console.warn('path.node.loc does not exist.')
    }
  }

  const insertLocation = (path: NodePath<CallExpression>) => {
    const loc = path.node.loc

    if (loc) {
      const { line, column } = loc.start
      path.node.arguments.unshift(stringLiteral(`[${line}, ${column}]`))
    } else {
      console.warn('path.node.loc does not exist.')
    }
  }

  traverse(ast, {
    CallExpression(path) {
      // 通过 AST 来筛选 console 调用
      // if (isConsoleCallExpressionByAST(path)) {
      //   insertLocation(path)
      // }

      // 通过 AST 对应的 code 来筛选 console 调用
      // if (isConsoleCallExpressionByCode(generate(path.node.callee).code)) {
      //   insertLocation(path)
      // }

      // path.get('callee').toString() 等价于 generate(path.node.callee).code
      if (isConsoleCallExpressionByCode(path.get('callee').toString())) {
        if (breakLine) {
          insertLocationWithBreakLine(path)
        } else {
          insertLocation(path)
        }
      }
    },
  })

  const { code } = generate(ast)

  return code
}
