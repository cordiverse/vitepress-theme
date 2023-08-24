<script setup lang="ts">
import { computed } from 'vue'
import { useData } from '@theme-default/composables/data.js'
import { useLangs } from '@theme-default/composables/langs.js'
import { useSidebar } from '@theme-default/composables/sidebar.js'
import { normalizeLink } from '@theme-default/support/utils.js'
import VPImage from '@theme-default/components/VPImage.vue'

const { site, theme, localeIndex, page } = useData()
const { hasSidebar } = useSidebar()
const { currentLang } = useLangs()

const prefix = computed(() => {
  const path = page.value.filePath.slice(localeIndex.value.length)
  for (const prefix in theme.value.mixins || {}) {
    if (path.startsWith(prefix)) return prefix
  }
})

const link = computed(() => {
  if (prefix.value) return `/${localeIndex.value}${prefix.value}/`
  return theme.value.logoLink ?? normalizeLink(currentLang.value.link)
})

const title = computed(() => {
  if (prefix.value) return theme.value.mixins[prefix.value].title
  return theme.value.siteTitle || site.value.title
})
</script>

<template>
  <div class="VPNavBarTitle" :class="{ 'has-sidebar': hasSidebar }">
    <a class="title" :href="link">
      <slot name="nav-bar-title-before" />
      <VPImage v-if="!prefix && theme.logo" class="logo" :image="theme.logo" />
      {{ title }}
      <slot name="nav-bar-title-after" />
    </a>
  </div>
</template>

<style scoped>
.title {
  display: flex;
  align-items: center;
  border-bottom: 1px solid transparent;
  width: 100%;
  height: var(--vp-nav-height);
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: opacity 0.25s;
}

@media (min-width: 960px) {
  .title {
    flex-shrink: 0;
  }

  .VPNavBarTitle.has-sidebar .title {
    border-bottom-color: var(--vp-c-divider);
  }
}

:deep(.logo) {
  margin-right: 8px;
  height: var(--vp-nav-logo-height);
}
</style>
