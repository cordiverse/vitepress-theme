import { DefaultTheme, UserConfig } from 'vitepress'
import { mergeConfig } from 'vite'
import { resolve } from 'path'
import { slugify } from '@mdit-vue/shared'
import container from './markdown/container'
import highlight from './markdown/highlight'
import fence from './markdown/fence'

export interface ThemeConfig extends DefaultTheme.Config {}

export const defineConfig = async (config: UserConfig<ThemeConfig>): Promise<UserConfig<ThemeConfig>> => ({
  ...config,

  markdown: {
    highlight: await highlight('one-dark-pro'),
    ...config?.markdown,
    anchor: {
      slugify: str => slugify(str.replace(/\(.+\)(?=\s|$)/, '')),
      ...config?.markdown?.anchor,
    },
    config(md) {
      md.use(fence)
      md.use(container, {
        type: 'code-group',
        before() {
          return `<code-group>`
        },
        after() {
          return '</code-group>'
        },
      })
      config?.markdown?.config?.(md)
    },
  },

  vite: mergeConfig({
    resolve: {
      alias: {
        '@theme-default': 'vitepress/dist/client/theme-default',
        '../composables/outline.js': resolve(__dirname, '../client/composables/outline'),
      },
    },
  }, config?.vite || {}),
})
