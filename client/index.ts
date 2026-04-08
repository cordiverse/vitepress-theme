import { EnhanceAppContext, Theme, inBrowser } from 'vitepress'
import { Component, computed, inject, InjectionKey, MaybeRefOrGetter, reactive, toValue } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import ElScrollbar from 'el-scrollbar'
import Spoiler from './components/spoiler.vue'
import ChatMessage from './components/chat-message.vue'
import PanelView from './components/chat-panel.vue'
import TabSelect from './components/tab-select.vue'
import DefaultTheme from 'vitepress/theme'

import 'uno.css'

import './styles/aside.scss'
import './styles/code.scss'
import './styles/doc.scss'
import './styles/vars.scss'

export const ClientConfig: InjectionKey<ClientConfig> = Symbol.for('client-config')

export function useActiveTab(keys: MaybeRefOrGetter<string[]>) {
  const config = inject(ClientConfig)!
  return computed({
    get: () => {
      const value = toValue(keys)
      return config.tabs!.find(name => value.includes(name)) || value[0]
    },
    set: (value) => {
      const index = config.tabs!.indexOf(value)
      if (index >= 0) config.tabs!.splice(index, 1)
      config.tabs!.unshift(value)
    },
  })
}

export interface ThemeConfig {
  Layout?: Component
  enhanceApp?: (ctx: EnhanceAppContext) => void
}

export interface ClientConfig {
  version?: number
  tabs?: string[]
}

const version = 1

function createStorage(initial: ClientConfig) {
  const storage = useLocalStorage('koishi.docs.config', {} as ClientConfig)
  if (storage.value.version !== version) {
    storage.value = { ...initial, version }
  } else {
    storage.value = { ...initial, ...storage.value }
  }
  return reactive(storage.value)
}

export const defineTheme = (config: ThemeConfig = {}): Theme => ({
  Layout: config.Layout || DefaultTheme.Layout,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)

    ctx.app.component('ElScrollbar', ElScrollbar)
    ctx.app.component('Spoiler', Spoiler)
    ctx.app.component('ChatMessage', ChatMessage)
    ctx.app.component('ChatPanel', PanelView)
    ctx.app.component('TabSelect', TabSelect)

    ctx.app.provide(ClientConfig, createStorage({
      tabs: [],
    }))

    if (inBrowser) {
      const fallbackLocale = ctx.siteData.value.themeConfig.fallbackLocale
      if (fallbackLocale) {
        const locales = Object.keys(ctx.siteData.value.locales)
        const { pathname } = window.location
        if (!locales.some(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)) {
          ctx.router.go(`/${fallbackLocale}${pathname}`)
        }
      }
    }

    config.enhanceApp?.(ctx)
  },
})
