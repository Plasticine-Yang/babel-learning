import { transformAsync } from '@babel/core'
import { readFile } from 'fs/promises'
import { resolve } from 'path'

import { babelPluginInstrument, type BabelPluginInstrumentOptions } from '@/plugin'

describe('babelPluginInstrument', async () => {
  const sourceCode = await readFile(resolve(__dirname, 'fixtures/source-code.js'), 'utf-8')

  test('happy path', async () => {
    const result = await transformAsync(sourceCode, {
      plugins: [[babelPluginInstrument, {} as BabelPluginInstrumentOptions]],
    })

    if (result) {
      const { code } = result

      expect(code).toMatchInlineSnapshot(`
        "function a() {
          console.log('aaa');
        }
        class B {
          bb() {
            return 'bbb';
          }
        }
        const c = () => {
          return 'ccc';
        };
        const d = function () {
          console.log('ddd');
        };
        const e = {
          ee1() {
            console.log('ee1');
          },
          ee2: () => {
            console.log('ee2');
          }
        };"
      `)
    }
  })
})
