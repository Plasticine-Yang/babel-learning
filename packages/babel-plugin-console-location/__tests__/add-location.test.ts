import dedent from 'dedent'

import { addLocation } from '@/add-location'

describe('addLocation', () => {
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

  test('should add location inline', () => {
    const result = addLocation(sourceCode)

    expect(result).toMatchInlineSnapshot(`
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

  test('should add location break line', () => {
    const result = addLocation(sourceCode, { breakLine: true })

    expect(result).toMatchInlineSnapshot(`
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
