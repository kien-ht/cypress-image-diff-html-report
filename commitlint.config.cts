import type { UserConfig } from '@commitlint/types'
import rules from '@commitlint/rules'

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'body-max-line-length': (parsed, _when, _value) => {
          const containLinks = /https:\/\//.test(parsed.body ?? '')
          return containLinks
            ? [true]
            : rules['body-max-line-length'](parsed, _when, _value)
        }
      }
    }
  ]
}

export default config
