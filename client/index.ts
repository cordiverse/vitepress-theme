import { Theme } from 'vitepress'
import { Component, InjectionKey, reactive } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import ElScrollbar from 'el-scrollbar'
import VPDoc from '@theme-default/components/VPDoc.vue'
import Badge from './components/badge.vue'
import ChatMessage from './components/chat-message.vue'
import PanelView from './components/chat-panel.vue'
import TabSelect from './components/tab-select.vue'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'

import './styles/aside.scss'
import './styles/code.scss'
import './styles/doc.scss'
import './styles/vars.scss'

export const ThemeConfig: InjectionKey<ThemeConfig> = Symbol('theme-config')
export const ClientConfig: InjectionKey<ClientConfig> = Symbol('clinet-config')

export interface ThemeConfig {
  layouts?: Record<string, Component>
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
  ...DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('ElScrollbar', ElScrollbar)
    app.component('Badge', Badge)
    app.component('ChatMessage', ChatMessage)
    app.component('ChatPanel', PanelView)
    app.component('TabSelect', TabSelect)

    app.provide(ThemeConfig, {
      layouts: {
        ...config.layouts,
        default: VPDoc,
      },
    })

    app.provide(ClientConfig, createStorage({
      tabs: [],
    }))
  },
})
