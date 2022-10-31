import { DefaultTheme, UserConfig } from 'vitepress'
import { mergeConfig } from 'vite'
import highlight from './markdown/highlight'
import fence from './markdown/fence'

export interface ThemeConfig extends DefaultTheme.Config {}

export const defineConfig = async (config: UserConfig<ThemeConfig>): Promise<UserConfig<ThemeConfig>> => ({
  ...config,

  markdown: {
    highlight: await highlight('one-dark-pro'),
    ...config?.markdown,
    config(md) {
      md.use(fence)
      config?.markdown?.config?.(md)
    },
  },

  vite: mergeConfig({
    resolve: {
      alias: {
        '@theme-default': 'vitepress/dist/client/theme-default',
      },
    },
  }, config?.vite || {}),
})
