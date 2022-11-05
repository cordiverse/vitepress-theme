import { htmlEscape } from '@mdit-vue/shared'
import MarkdownIt from 'markdown-it'

export default (md: MarkdownIt) => {
  const fence = md.renderer.rules.fence
  md.renderer.rules.fence = (...args) => {
    let [tokens, index] = args
    const token = tokens[index]
    let prev: any, title: string
    const [language, ...rest] = token.info.split(/\s+/g)
    for (const text of rest) {
      if (text.startsWith('title=')) {
        title = text.slice(6)
      }
    }
    const rawCode = fence(...args).replace(/<span class="lang">(.+?)<\/span>/, () => {
      return `<span class="lang">${title || language}</span>`
    })
    while ((prev = tokens[--index])?.type === 'fence');
    const isCodeGroupItem = prev?.type === 'container_tabs_open'
    if (!isCodeGroupItem) return rawCode
    let result = `<template #tab-${language}>${rawCode}</template>`
    if (title) {
      result = `<template #title-${language}>${htmlEscape(title)}</template>` + result
    }
    return result
  }
}
