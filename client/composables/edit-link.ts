import { computed } from 'vue'
import { useData } from '@theme-default/composables/data'

export function useEditLink() {
  const { theme, page } = useData()

  return computed(() => {
    const { text = 'Edit this page', pattern = '' } = theme.value.editLink || {}
    const { relativePath } = page.value
    let url = pattern.replace(/:path/g, relativePath)
    if (theme.value.crowdin) {
      url = url.replace(/:id/g, theme.value.crowdin[relativePath.split('/').slice(1).join('/')])
    }
    return { url, text }
  })
}
