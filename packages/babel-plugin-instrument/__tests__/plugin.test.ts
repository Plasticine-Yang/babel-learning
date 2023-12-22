import { transformAsync } from '@babel/core'
import { readFile } from 'fs/promises'
import { resolve } from 'path'

import { babelPluginInstrument } from '@/plugin'
import type { BabelPluginInstrumentOptions } from '@/types'

describe('babelPluginInstrument', async () => {
  test('should add instrument module import', async () => {
    const sourceCode = await readFile(resolve(__dirname, 'fixtures/should-add-instrument-module-import.js'), 'utf-8')
    const result = await transformAsync(sourceCode, {
      plugins: [
        [
          babelPluginInstrument,
          { instrumentModulePath: 'instrument', instrumentModuleName: 'instrument' } as BabelPluginInstrumentOptions,
        ],
      ],
    })

    if (result) {
      const { code } = result

      expect(code).toMatchInlineSnapshot(`
        "import _instrument from \\"instrument\\";
        import foo from 'foo';
        import { bar } from 'bar';
        import * as bazNamespace from 'baz';"
      `)
    }
  })

  test('should not add instrument module import', async () => {
    const sourceCode = await readFile(
      resolve(__dirname, 'fixtures/should-not-add-instrument-module-import.js'),
      'utf-8',
    )
    const result = await transformAsync(sourceCode, {
      plugins: [
        [
          babelPluginInstrument,
          { instrumentModulePath: 'instrument', instrumentModuleName: 'instrument' } as BabelPluginInstrumentOptions,
        ],
      ],
    })

    if (result) {
      const { code } = result

      expect(code).toMatchInlineSnapshot(`
        "import instrument from 'instrument';
        import { foo } from 'instrument';
        import * as bar from 'instrument';"
      `)
    }
  })
})
