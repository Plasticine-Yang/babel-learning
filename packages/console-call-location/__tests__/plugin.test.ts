import { transformAsync } from '@babel/core'
import dedent from 'dedent'

import { ConsoleCallLocationPluginOptions, consoleCallLocationPlugin } from '@/plugin'

describe('consoleCallLocationPlugin', () => {
  let sourceCode: string

  beforeEach(() => {
    sourceCode = dedent`
      console.log(1);

      function foo() {
        console.info(2);
      }

      export default class Foo {
        say() {
          console.debug(3)
        }

        render() {
          return <div>{console.error(4)}</div>
        }
      }
    `
  })

  test('should add location inline', async () => {
    const result = await transformAsync(sourceCode, {
      parserOpts: {
        sourceType: 'unambiguous',
        plugins: ['jsx'],
      },
      plugins: [[consoleCallLocationPlugin, { breakLine: false } as ConsoleCallLocationPluginOptions]],
    })

    expect(result?.code).toMatchInlineSnapshot(`
      "console.log(\\"[1, 0]\\", 1);
      function foo() {
        console.info(\\"[4, 2]\\", 2);
      }
      export default class Foo {
        say() {
          console.debug(\\"[9, 4]\\", 3);
        }
        render() {
          return <div>{console.error(\\"[13, 17]\\", 4)}</div>;
        }
      }"
    `)
  })

  test('should add location break line', async () => {
    const result = await transformAsync(sourceCode, {
      parserOpts: {
        sourceType: 'unambiguous',
        plugins: ['jsx'],
      },
      plugins: [[consoleCallLocationPlugin, { breakLine: true } as ConsoleCallLocationPluginOptions]],
    })

    expect(result?.code).toMatchInlineSnapshot(`
      "console.log('[1, 0]')
      console.log(1);
      function foo() {
        console.log('[4, 2]')
        console.info(2);
      }
      export default class Foo {
        say() {
          console.log('[9, 4]')
          console.debug(3);
        }
        render() {
          return <div>{[console.log('[13, 17]'), console.error(4)]}</div>;
        }
      }"
    `)
  })
})
