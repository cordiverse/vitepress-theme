import { DefaultTheme } from 'vitepress'
// @ts-ignore
import { MenuItem, resolveHeaders, resolveTitle, useActiveAnchor } from '@theme-default/composables/outline'

export { resolveHeaders, resolveTitle, useActiveAnchor }

export function getHeaders(pageOutline: DefaultTheme.Config['outline']) {
  if (pageOutline === false) return []
  const updatedHeaders: MenuItem[] = []
  document
    .querySelectorAll<HTMLHeadingElement>('h2, h3, h4, h5, h6')
    .forEach((el) => {
      if (!el.textContent || !el.id) return
      let innerText = ''
      function pushText(el: HTMLElement) {
        if (el.classList.contains('badge')) return
        for (let i = 0; i < el.childNodes.length; i++) {
          const node = el.childNodes[i]
          if (node.nodeType === Node.TEXT_NODE) {
            innerText += node.textContent
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            pushText(node as HTMLElement)
          }
        }
      }
      pushText(el)
      updatedHeaders.push({
        level: +el.tagName[1],
        title: innerText
          .replace(/\s+#\s*$/, '')
          .replace(/(\w+)\(.+?\)(\s|$).*/, '$1()'),
        link: `#${el.id}`,
      })
    })
  return resolveHeaders(updatedHeaders, pageOutline)
}
