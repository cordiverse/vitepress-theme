<script setup lang="ts">
import { AisHighlight } from "vue-instantsearch/vue3/es/index.js";
import { computed } from "vue";
import { withBase } from "vitepress";

const props = defineProps({
  item: Object,
  origin: String,
});

const title = computed(() =>
  [props.item.lvl1, props.item.lvl2, props.item.lvl3, props.item.lvl4]
    .filter((n) => !!n)
    .map(n => n.trim())
    .join(" > ")
);
</script>

<template>
  <a :href="withBase('/' + props.item.link)">
    <div class="search-item">
      <span class="item-type-icon">{{ item.anchorLink ? "＃" : "☰" }}</span>
      <div class="search-item-content">
        <p v-if="item.anchorLink" class="chapter-header">{{ title }}</p>
        <h3 class="preview"><AisHighlight attribute="sentence" :hit="item" /></h3>
      </div>
      <span class="jump-icon">↪</span>
    </div>
  </a>
</template>

<style scoped lang="scss">
.item-type-icon {
  font-family: none;
  align-self: center;
  padding: 0 1rem 0 0;
  font-size: x-large;
  width: 32px;
}

.jump-icon {
  font-family: none;
  align-self: center;
  font-size: x-large;
  margin-left: 0.5rem;
}

.search-item {
  padding: 0.75rem 1rem;
  margin: 8px 0 0 0;
  border: solid 1px;
  border-radius: 6px;
  display: flex;

  border-color: var(--vp-custom-block-info-border);
  color: var(--vp-custom-block-info-text);
  background-color: var(--vp-custom-block-info-bg);
}

.search-item .chapter-header {
  margin: 0px;
  font-weight: 600;
  font-size: smaller;
  color: var(--vp-c-text-2);
}

.search-item:hover {
  color: var(--vp-button-brand-text);
  background: var(--vp-button-brand-bg);
}

.search-item:hover .chapter-header {
  color: var(--vp-c-text-1);
}

.preview {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-item-content {
  width: 100%;
  overflow: hidden;
  line-height: 18px;
}

</style>
