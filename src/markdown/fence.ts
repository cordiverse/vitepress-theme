import MarkdownIt from 'markdown-it'

export default (md: MarkdownIt) => {
  const fence = md.renderer.rules.fence
  md.renderer.rules.fence = (...args) => {
    let [tokens, index] = args
    const token = tokens[index]
    let prev: any, title = token.info
    const rawCode = fence(...args).replace(/<span class="lang">(.+?)<\/span>/, ($0, $1: string) => {
      const segments = $1.split(/\s+/)
      title = segments[0]
      for (const text of segments.slice(1)) {
        if (text.startsWith('title=')) {
          title = text.slice(6)
        }
      }
      return `<span class="lang">${title}</span>`
    })
    while ((prev = tokens[--index])?.type === 'fence');
    const isCodeGroupItem = prev?.type === 'container_code-group_open'
    if (!isCodeGroupItem) return rawCode
    return `<template #${title}>${rawCode}</template>`
  }
}
