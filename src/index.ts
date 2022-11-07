import { DefaultTheme, UserConfig } from 'vitepress'
import { mergeConfig } from 'vite'
import { resolve } from 'path'
import { htmlEscape, slugify } from '@mdit-vue/shared'
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
        type: 'tabs',
        before: info => `<tab-select class="${info}">`,
        after: () => '</tab-select>',
      })
      md.use(container, {
        type: 'tab',
        before(info) {
          const name = info.split(/\s+/, 1)[0]
          const title = info.slice(name.length).trim()
          let result = `<template #tab-${name}>`
          if (title) {
            result = `<template #title-${name}>${htmlEscape(title)}</template>` + result
          }
          return result
        },
        after: () => '</template>',
      })
      config?.markdown?.config?.(md)
    },
  },

  vite: mergeConfig({
    resolve: {
      alias: {
        '@theme-default': 'vitepress/dist/client/theme-default',
        '../composables/outline.js': resolve(__dirname, '../client/composables/outline'),
        '../composables/prev-next.js': resolve(__dirname, '../client/composables/prev-next'),
      },
    },
  }, config?.vite || {}),
})
