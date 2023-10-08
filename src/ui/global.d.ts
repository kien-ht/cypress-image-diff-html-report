import { InjectedData } from '@commonTypes'

export {}
declare global {
  interface Window {
    __injectedData__: InjectedData
  }
}
