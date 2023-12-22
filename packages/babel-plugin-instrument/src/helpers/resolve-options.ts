import { DEFAULT_INSTRUMENT_MODULE_NAME } from '@/constants'
import { BabelPluginInstrumentOptions, ResolvedBabelPluginInstrumentOptions } from '@/types'

export function resolveOptions(options: BabelPluginInstrumentOptions): ResolvedBabelPluginInstrumentOptions {
  const { instrumentModulePath, instrumentModuleName } = options

  return {
    instrumentModulePath,
    instrumentModuleName: instrumentModuleName ?? DEFAULT_INSTRUMENT_MODULE_NAME,
  }
}
