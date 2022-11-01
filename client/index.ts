import { Theme } from 'vitepress'
import { Component, InjectionKey, reactive } from 'vue'
import { ElScrollbar } from 'element-plus'
import { useLocalStorage } from '@vueuse/core'
import VPDoc from '@theme-default/components/VPDoc.vue'
import Badge from './components/badge.vue'
import ChatMessage from './components/chat-message.vue'
import PanelView from './components/chat-panel.vue'
import CodeGroup from './components/code-group.vue'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'

import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-scrollbar.css'
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
  languages?: string[]
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
    app.use(ElScrollbar)
    app.component('Badge', Badge)
    app.component('ChatMessage', ChatMessage)
    app.component('ChatPanel', PanelView)
    app.component('CodeGroup', CodeGroup)

    app.provide(ThemeConfig, {
      layouts: {
        ...config.layouts,
        default: VPDoc,
      },
    })

    app.provide(ClientConfig, createStorage({
      languages: [],
    }))
  },
})
