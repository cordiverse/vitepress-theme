import { Theme } from 'vitepress'
import { Component, InjectionKey } from 'vue'
import { ElScrollbar } from 'element-plus'
import VPDoc from '@theme-default/components/VPDoc.vue'
import Badge from './components/badge.vue'
import ChatMessage from './components/chat-message.vue'
import PanelView from './components/chat-panel.vue'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'

import 'element-plus/es/components/scrollbar/style/css'
import './styles/aside.scss'
import './styles/code.scss'
import './styles/doc.scss'
import './styles/vars.scss'

export interface ClientConfig {
  layouts?: Record<string, Component>
}

export const ClientConfig: InjectionKey<ClientConfig> = Symbol('config')

export const defineTheme = (config: ClientConfig = {}): Theme => ({
  ...DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.use(ElScrollbar)
    app.component('Badge', Badge)
    app.component('ChatMessage', ChatMessage)
    app.component('ChatPanel', PanelView)
    app.provide(ClientConfig, {
      layouts: {
        ...config.layouts,
        default: VPDoc,
      },
    })
  },
})
