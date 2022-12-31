import { DefaultTheme, UserConfig } from 'vitepress'
import { mergeConfig } from 'vite'
import { resolve } from 'path'
import { htmlEscape, slugify } from '@mdit-vue/shared'
import container from './markdown/container'
import highlight from './markdown/highlight'
import fence from './markdown/fence'

export interface ThemeConfig extends Omit<DefaultTheme.Config, 'socialLinks'> {
  socialLinks?: Record<string, string>
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

const git = (() => {
  const branch = process.env.VERCEL_GIT_COMMIT_REF || process.env.GITHUB_REF_NAME || 'main'
  const sha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || ''
  return { branch, sha }
})()

export const defineConfig = async (config: UserConfig<ThemeConfig>): Promise<UserConfig> => ({
  ...config,

  themeConfig: {
    outline: [2, 3],
    outlineTitle: '目录',
    lastUpdatedText: '上次更新',
    ...config.themeConfig,

    socialLinks: Object.entries({
      github: `https://github.com/${getRepoName(config.title)}`,
      ...config.themeConfig.socialLinks,
    }).map(([icon, link]) => ({ icon, link })),

    editLink: {
      text: '编辑此页面',
      pattern: `https://github.com/${getRepoName(config.title)}/edit/${git.branch}/docs/:path`,
      ...config.themeConfig.editLink,
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
  }, config?.vite || {}),
})
