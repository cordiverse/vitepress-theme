// @ts-ignore
import { resolveHeaders, resolveTitle, useActiveAnchor } from '@theme-default/composables/outline'

export { resolveHeaders, resolveTitle, useActiveAnchor }

export function getHeaders(range) {
  const headers = [
    ...document.querySelectorAll('.VPDoc :where(h1,h2,h3,h4,h5,h6)'),
  ]
    .filter((el) => el.id && el.hasChildNodes())
    .map((el) => {
      const level = Number(el.tagName[1])
      return {
        element: el,
        title: serializeHeader(el),
        link: '#' + el.id,
        level,
      }
    })
  return resolveHeaders(headers, range)
}

const blacklist = [
  'badge',
  'VPBadge',
  'header-anchor',
  'ignore-header',
]

function serializeHeader(h) {
  let ret = ''
  for (const node of h.childNodes) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (blacklist.some(name => node.classList.contains(name))) {
        continue
      }
      ret += node.textContent
    } else if (node.nodeType === Node.TEXT_NODE) {
      ret += node.textContent.replace(/(\w+)\(.+?\)(\s|$).*/, '$1()')
    }
  }
  return ret.trim()
}
