/* eslint-disable @typescript-eslint/naming-convention */

declare module '*.vue' {
  import { DefineComponent } from 'vue'

  const component: DefineComponent
  export default component
}

declare const __VITE_MEILISEARCH_APIKEY__: string
declare const __VITE_MEILISEARCH_HOST__: string
declare const __VITE_MEILISEARCH_INDEX__: string
