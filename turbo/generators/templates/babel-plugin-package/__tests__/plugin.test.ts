import { transformAsync } from '@babel/core'
import { readFile } from 'fs/promises'
import { resolve } from 'path'

import { babelPlugin } from '@/plugin'

describe('babelPlugin', async () => {
  const sourceCode = await readFile(resolve(__dirname, 'fixtures/source-code.js'), 'utf-8')

  test('happy path', async () => {
    const result = await transformAsync(sourceCode, { plugins: [[babelPlugin, {}]] })

    if (result) {
      const { code } = result

      expect(code).toMatchInlineSnapshot()
    }
  })
})
