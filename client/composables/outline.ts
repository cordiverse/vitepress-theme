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
      if (el.textContent && el.id) {
        updatedHeaders.push({
          level: +el.tagName[1],
          title: el.innerText
            .replace(/\s+#\s*$/, '')
            .replace(/(\w+)\(.+?\)(\s|$).*/, '$1()'),
          link: `#${el.id}`,
        })
      }
    })
  return resolveHeaders(updatedHeaders, pageOutline)
}
