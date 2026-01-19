/* eslint-disable @typescript-eslint/naming-convention */

declare module '*.vue' {
  import { DefineComponent } from 'vue'

  const component: DefineComponent
  export default component
}

declare module '*.scss' {}

declare const __VITE_MEILISEARCH_APIKEY__: string
declare const __VITE_MEILISEARCH_HOST__: string
declare const __VITE_MEILISEARCH_INDEX__: string

declare module 'vitepress/dist/client/theme-default/composables/data.js' {
  import { VitePressData } from 'vitepress'

  export function useData<T = any>(): VitePressData<T>
}

declare module 'vitepress/dist/client/theme-default/composables/layout.js' {
  import { ComputedRef } from 'vue'

  export function useLayout(): {
    isHome: ComputedRef<boolean>,
    hasSidebar: ComputedRef<boolean>,
    isSidebarEnabled: ComputedRef<boolean>,
    hasAside: ComputedRef<boolean>,
    leftAside: ComputedRef<boolean>,
    hasLocalNav: ComputedRef<boolean>,
    sidebarGroups: ComputedRef<any>,
  }

  export function registerWatchers(options: { closeSidebar: () => void }): void
}

declare module 'vitepress/dist/client/theme-default/composables/sidebar.js' {
  import { Ref } from 'vue'

  export function useCloseSidebarOnEscape(close: () => void): void

  export function useSidebarControl(): {
    isOpen: Ref<boolean>
    open: () => void
    close: () => void
    toggle: () => void
  }
}
