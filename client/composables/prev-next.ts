import { computed } from 'vue'
import { useData } from 'vitepress'
// @ts-ignore
import { isActive } from '@theme-default/support/utils.js'
// @ts-ignore
import { getFlatSideBarLinks, getSidebar } from '@theme-default/support/sidebar.js'

export function usePrevNext() {
  const { page, theme, frontmatter } = useData()

  return computed(() => {
    const sidebar = getSidebar(theme.value.sidebar, page.value.relativePath)
    const candidates = getFlatSideBarLinks(sidebar)

    const index = candidates.findIndex((link) => {
      return isActive(page.value.relativePath, link.link)
    })

    return {
      prev: frontmatter.value.prev ?? candidates[index - 1],
      next: frontmatter.value.next ?? candidates[index + 1],
    }
  })
}
