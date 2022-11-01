<script lang="ts" setup>
import { nextTick, ref, watchPostEffect } from 'vue'
// @ts-ignore
import { useSidebar } from '@theme-default/composables/sidebar.js'
import VPSidebarGroup from '@theme-default/components/VPSidebarGroup.vue'
const { sidebar, hasSidebar } = useSidebar()
const props = defineProps<{
  open: boolean
}>()
// a11y: focus Nav element when menu has opened
const navEl = ref<{ wrap$: HTMLElement } | null>(null)
watchPostEffect(async () => {
  if (props.open) {
    await nextTick()
    navEl.value?.wrap$.focus()
  }
})
</script>

<template>
  <ElScrollbar
    tag="aside"
    v-if="hasSidebar"
    class="vp-sidebar"
    view-class="vp-sidebar-view"
    :class="{ open }"
    ref="navEl"
    @click.stop
  >
    <nav class="vp-sidebar-nav" id="VPSidebarNav" aria-labelledby="sidebar-aria-label" tabindex="-1">
      <span class="visually-hidden" id="sidebar-aria-label">
        Sidebar Navigation
      </span>

      <div v-for="group in sidebar" :key="group.text" class="vp-sidebar-group">
        <VPSidebarGroup
          :text="group.text"
          :items="group.items"
          :collapsible="group.collapsible"
          :collapsed="group.collapsed"
        />
      </div>
    </nav>
  </ElScrollbar>
</template>

<style lang="scss">
.vp-sidebar {
  position: fixed !important;
  padding: 0 32px;
  top: var(--vp-layout-top-height, 0px);
  bottom: 0;
  left: 0;
  z-index: var(--vp-z-index-sidebar);
  width: calc(100vw - 64px);
  max-width: 320px;
  background-color: var(--vp-c-bg);
  opacity: 0;
  box-shadow: var(--vp-c-shadow-3);
  overflow-x: hidden;
  overflow-y: auto;
  transform: translateX(-100%);
  transition: opacity 0.5s, transform 0.25s ease;
}
.vp-sidebar-view {
  padding: 32px 0 64px;
}
.vp-sidebar.open {
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
  transition: opacity 0.25s,
              transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}
.dark .vp-sidebar {
  box-shadow: var(--vp-shadow-1);
}
@media (min-width: 960px) {
  .vp-sidebar {
    z-index: 1;
    width: var(--vp-sidebar-width);
    max-width: 100%;
    background-color: var(--vp-c-bg-alt);
    opacity: 1;
    visibility: visible;
    box-shadow: none;
    transform: translateX(0);
  }
  .vp-sidebar-view {
    padding-top: var(--vp-nav-height-desktop);
    padding-bottom: 32px;
  }
}
@media (min-width: 1440px) {
  .vp-sidebar {
    padding-left: max(32px, calc((100% - (var(--vp-layout-max-width) - 64px)) / 2));
    width: calc((100% - (var(--vp-layout-max-width) - 64px)) / 2 + var(--vp-sidebar-width) - 32px);
  }
}
.vp-sidebar-nav {
  outline: 0;
}

.vp-sidebar-group + .vp-sidebar-group {
  margin-top: 16px;
  border-top: 1px solid var(--vp-c-divider-light);
  padding-top: 16px;
}

@media (min-width: 960px) {
  .vp-sidebar-group {
    padding-top: 16px;
    width: calc(var(--vp-sidebar-width) - 64px);
  }
  .vp-sidebar-group + .vp-sidebar-group {
    margin-top: 16px;
  }
}

</style>
