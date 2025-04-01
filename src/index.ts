import { DefaultTheme, UserConfig } from 'vitepress'
import { mergeConfig } from 'vite'
import { htmlEscape, slugify } from '@mdit-vue/shared'
import { Dict, isNullable, valueMap } from 'cosmokit'
import yaml from '@maikolib/vite-plugin-yaml'
import unocss from 'unocss/vite'
import mini from 'unocss/preset-mini'
import crowdin from './crowdin'
import container from './markdown/container'
import fence from './markdown/fence'
import { fileURLToPath } from 'url'

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
  crowdin?: Dict
}

export namespace ThemeConfig {
  export interface SocialLink {
    icon: string
    link: string
  }
}

interface Config extends UserConfig<ThemeConfig> {
  fallbackLocale?: string
  locales?: Dict
}

const getRepoName = (title: string) => {
  if (title.startsWith('@')) {
    return title.slice(1)
  } else {
    return 'koishijs/' + title
  }
}

function merge(a: any, b: any) {
  if (isNullable(a)) return b
  if (isNullable(b)) {
    return a
  } else if (typeof b !== 'object') {
    return b
  }
  const result = {}
  for (const key in { ...a, ...b }) {
    result[key] = merge(a[key], b[key])
  }
  return result
}

export const git = (() => {
  const branch = process.env.VERCEL_GIT_COMMIT_REF || process.env.GITHUB_REF_NAME || 'main'
  const sha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || ''
  return { branch, sha }
})()

function transformLocale(prefix: string, source: any) {
  if (typeof source !== 'object') {
    return source
  } else if (Array.isArray(source)) {
    return source.map(item => transformLocale(prefix, item))
  }

  const result: any = {}
  for (const key in source) {
    const value = source[key]
    if (typeof value === 'string') {
      if (key === 'link') {
        result[key] = value.startsWith('/') ? prefix + value : value
      } else if (key === 'activeMatch') {
        result[key] = '^' + prefix + value
      } else {
        result[key] = value
      }
    } else if (key === 'sidebar') {
      if (Array.isArray(value)) {
        result[key] = {
          [prefix + '/']: transformLocale(prefix, value),
        }
      } else {
        result[key] = {}
        for (const prop in value) {
          result[key][prefix + prop] = transformLocale(prefix, value[prop])
        }
      }
    } else {
      result[key] = transformLocale(prefix, value)
    }
  }
  return result
}

export const defineConfig = async (config: Config): Promise<Config> => ({
  ...config,

  locales: config.locales && valueMap(config.locales, (value, locale) => {
    return merge(locales[locale], transformLocale(`/${locale}`, value))
  }),

  themeConfig: {
    outline: [2, 3],
    search: {
      provider: 'local',
      options: {
        detailedView: true,
      },
    },

    ...locales[config.fallbackLocale || 'zh-CN'],
    ...config.themeConfig,

    socialLinks: Object.entries({
      github: `https://github.com/${getRepoName(config.title)}`,
      ...config.themeConfig.socialLinks,
    }).map(([icon, link]) => ({ icon, link })),

    crowdin: process.env.CROWDIN_TOKEN
      ? await crowdin(+process.env.CROWDIN_PROJECT, +process.env.CROWDIN_BRANCH)
      : null,
  },

  markdown: {
    // highlight: await highlight('one-dark-pro'),
    ...config?.markdown,
    languageAlias: {
      npm: 'sh',
      yarn: 'sh',
      pnpm: 'sh',
      bun: 'sh',
      podman: 'sh',
      docker: 'sh',
    },
    theme: {
      light: 'github-light',
      dark: 'one-dark-pro',
    },
    anchor: {
      // https://github.com/vuejs/vitepress/issues/3511#issuecomment-1923139500
      getTokensText(tokens) {
        let text = ''
        for (const t of tokens) {
          if (t.type === 'text' || t.type === 'code_inline') text += t.content
          if (t.type === 'html_inline' && /<badge/i.test(t.content)) return text
        }
        return text
      },
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
        '../composables/edit-link': fileURLToPath(new URL('../client/composables/edit-link', import.meta.url)),
        '../composables/outline': fileURLToPath(new URL('../client/composables/outline', import.meta.url)),
      },
    },

    optimizeDeps: {
      exclude: ['uno.css'],
    },

    server: {
      fs: {
        strict: false,
      },
    },

    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },

    plugins: [
      yaml(),
      unocss({
        presets: [
          mini({
            preflight: false,
          }),
        ],
      }),
    ],
  }, config?.vite || {}),
})
