import { transformAsync } from '@babel/core'
import { readFile, writeFile } from 'fs/promises'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

import { babelPluginInstrument, type BabelPluginInstrumentOptions } from '@babel-learning/babel-plugin-instrument'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const transform = async () => {
  const sourceCodePath = resolve(__dirname, 'source-code.js')
  const transformedCodePath = resolve(__dirname, 'transformed-code.js')
  const sourceCode = await readFile(sourceCodePath, 'utf-8')

  const babelFileResult = await transformAsync(sourceCode, {
    plugins: [
      [
        babelPluginInstrument,
        {
          instrumentModulePath: 'plasticine-instrument',
          instrumentModuleName: 'plasticineInstrument',
        } as BabelPluginInstrumentOptions,
      ],
    ],
  })

  if (babelFileResult !== null) {
    if (babelFileResult.code) {
      await writeFile(transformedCodePath, babelFileResult.code)
    } else {
      console.error('transformed code does not exist.')
    }
  }
}

transform()
