import { DefaultTheme, LocaleConfig, UserConfig } from 'vitepress'
import { mergeConfig } from 'vite'
import { resolve } from 'path'
import { htmlEscape, slugify } from '@mdit-vue/shared'
import { isNullable, valueMap } from 'cosmokit'
import search from './search'
import container from './markdown/container'
import highlight from './markdown/highlight'
import fence from './markdown/fence'

const locales = {
  'de-DE': require('../locales/de-DE'),
  'en-US': require('../locales/en-US'),
  'fr-FR': require('../locales/fr-FR'),
  'ja-JP': require('../locales/ja-JP'),
  'ru-RU': require('../locales/ru-RU'),
  'zh-CN': require('../locales/zh-CN'),
}

export interface ThemeConfig extends Omit<DefaultTheme.Config, 'socialLinks' | 'algolia'> {
  indexName?: string
  socialLinks?: Record<string, string>
  docsearch?: Partial<DefaultTheme.AlgoliaSearchOptions>
}

export namespace ThemeConfig {
  export interface SocialLink {
    icon: string
    link: string
  }
}

const getRepoName = (title: string) => {
  if (title.startsWith('@')) {
    return title.slice(1)
  } else {
    return 'koishijs/' + title
  }
}

const getIndexName = (title: string) => {
  if (title.startsWith('@koishijs/')) {
    return title.slice(10)
  } else if (title.startsWith('koishi-plugin-')) {
    return title.slice(14)
  }
}

function deepMerge(a: any, b: any) {
  if (isNullable(a)) return b
  if (isNullable(b)) {
    return a
  } else if (typeof b !== 'object') {
    return b
  }
  const result = {}
  for (const key in { ...a, ...b }) {
    result[key] = deepMerge(a[key], b[key])
  }
  return result
}

const git = (() => {
  const branch = process.env.VERCEL_GIT_COMMIT_REF || process.env.GITHUB_REF_NAME || 'main'
  const sha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || ''
  return { branch, sha }
})()

export const defineLocale = (config: LocaleConfig<ThemeConfig>[string]): LocaleConfig<ThemeConfig>[string] => config

export const defineConfig = async (config: UserConfig<ThemeConfig>): Promise<UserConfig<ThemeConfig>> => ({
  ...config,

  locales: config.locales ? valueMap(config.locales, (value, key) => deepMerge(locales[key], value)) : null,

  themeConfig: {
    outline: [2, 3],
    ...locales['zh-CN'],
    ...config.themeConfig,

    socialLinks: Object.entries({
      github: `https://github.com/${getRepoName(config.title)}`,
      ...config.themeConfig.socialLinks,
    }).map(([icon, link]) => ({ icon, link })),

    editLink: !config.themeConfig.editLink ? null : {
      ...locales['zh-CN'].themeConfig.editLink,
      pattern: `https://github.com/${getRepoName(config.title)}/edit/${git.branch}/docs/:path`,
    },
  },

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
      dedupe: ['vue'],
      alias: {
        '@theme-default': 'vitepress/dist/client/theme-default',
        '../composables/outline.js': resolve(__dirname, '../client/composables/outline'),
        '../composables/prev-next.js': resolve(__dirname, '../client/composables/prev-next'),
        '../support/socialIcons.js': resolve(__dirname, '../client/support/social-icons'),
      },
    },

    optimizeDeps: {
      include: ['vue'],
    },

    server: {
      fs: {
        strict: false,
      },
    },

    plugins: [
      ...process.env.MEILISEARCH_HOST ? [search({
        host: process.env.MEILISEARCH_HOST,
        readKey: process.env.MEILISEARCH_READ_KEY,
        writeKey: process.env.MEILISEARCH_WRITE_KEY,
        indexName: config.themeConfig.indexName ?? getIndexName(config.title),
      })] : [],
    ],
  }, config?.vite || {}),
})
