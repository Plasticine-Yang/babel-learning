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

  test('should add instrument code for function call', async () => {
    const sourceCode = await readFile(resolve(__dirname, 'fixtures/should-add-instrument.js'), 'utf-8')
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
        function a() {
          _instrument();
          console.log('aaa');
        }
        class B {
          bb1() {
            _instrument();
            return 'bb1';
          }
          bb2() {
            _instrument();
            return 'bb2';
          }
        }
        const c = () => {
          _instrument();
          return 'ccc';
        };
        const d = function () {
          _instrument();
          console.log('ddd');
        };
        const e = {
          ee1() {
            _instrument();
            console.log('ee1');
          },
          ee2: () => {
            _instrument();
            console.log('ee2');
          }
        };"
      `)
    }
  })

  test('should add instrument code for implicit return arrow function', async () => {
    const sourceCode = await readFile(
      resolve(__dirname, 'fixtures/should-add-instrument-for-implicit-return-arrow-function.js'),
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
        "import _instrument from \\"instrument\\";
        const foo = () => {
          _instrument();
          return 'foo';
        };"
      `)
    }
  })
})
