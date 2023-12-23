import type { NodePath } from '@babel/core'

import type { Babel, BabelPluginInstrumentState, FunctionCallNode } from '@/types'

export function instrumentFunctionCall(
  babel: Babel,
  path: NodePath<FunctionCallNode>,
  state: BabelPluginInstrumentState,
) {
  const { template } = babel
  const bodyPath = path.get('body')

  if (bodyPath.isBlockStatement()) {
    // 有函数体的话在开始插入埋点代码
    bodyPath.node.body.unshift(state.instrumentCallAST)
  } else {
    // 没有函数体说明是 implicit return arrow function，即 `() => 'foo'` 这种，需要加上函数体后再进行插桩
    const ast = template.statement(`{${state.instrumentImportName}();return PREV_BODY;}`)({ PREV_BODY: bodyPath.node })
    bodyPath.replaceWith(ast)
  }
}
