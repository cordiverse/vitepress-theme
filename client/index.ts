import { EnhanceAppContext, Theme } from 'vitepress'
import { Component, computed, inject, InjectionKey, reactive, toValue } from 'vue'
import { MaybeRefOrGetter, useLocalStorage } from '@vueuse/core'
import ElScrollbar from 'el-scrollbar'
import VPDoc from '@theme-default/components/VPDoc.vue'
import Spoiler from './components/spoiler.vue'
import ChatMessage from './components/chat-message.vue'
import PanelView from './components/chat-panel.vue'
import TabSelect from './components/tab-select.vue'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'

import 'uno.css'

import './styles/aside.scss'
import './styles/code.scss'
import './styles/doc.scss'
import './styles/vars.scss'

export const ThemeConfig: InjectionKey<ThemeConfig> = Symbol.for('theme-config')
export const ClientConfig: InjectionKey<ClientConfig> = Symbol.for('client-config')

export function useActiveTab(keys: MaybeRefOrGetter<string[]>) {
  const config = inject(ClientConfig)
  return computed({
    get: () => {
      const value = toValue(keys)
      return config.tabs.find(name => value.includes(name)) || value[0]
    },
    set: (value) => {
      const index = config.tabs.indexOf(value)
      if (index >= 0) config.tabs.splice(index, 1)
      config.tabs.unshift(value)
    },
  })
}

export interface ThemeConfig {
  layouts?: Record<string, Component>
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

export { Layout }

export const defineTheme = (config: ThemeConfig = {}): Theme => ({
  extends: DefaultTheme,
  Layout,
  enhanceApp(ctx) {
    ctx.app.component('ElScrollbar', ElScrollbar)
    ctx.app.component('Spoiler', Spoiler)
    ctx.app.component('ChatMessage', ChatMessage)
    ctx.app.component('ChatPanel', PanelView)
    ctx.app.component('TabSelect', TabSelect)

    const layouts = { default: VPDoc }
    for (const key in config.layouts) {
      layouts[key.toLowerCase()] = config.layouts[key]
    }

    ctx.app.provide(ThemeConfig, { layouts })
    ctx.app.provide(ClientConfig, createStorage({
      tabs: [],
    }))

    config.enhanceApp?.(ctx)
  },
})
