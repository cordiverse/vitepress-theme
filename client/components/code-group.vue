<template>
  <div class="code-group">
    <div class="header">
      <span
        v-for="(_, key) in slots"
        :key="key"
        :class="{ active: active === key }"
        @click="setActive(key)"
      >{{ key }}</span>
    </div>
    <slot :name="active"></slot>
  </div>
</template>

<script lang="ts" setup>

import { computed, inject, useSlots } from 'vue'
import { ClientConfig } from '..'

const slots = useSlots()

const config = inject(ClientConfig)
const active = computed(() => {
  return config.languages.find(lang => lang in slots) || Object.keys(slots)[0]
})

function setActive(lang: any) {
  const index = config.languages.indexOf(lang)
  if (index >= 0) config.languages.splice(index, 1)
  config.languages.unshift(lang)
}

</script>

<style lang="scss">

.code-group {
  margin-top: 16px;

  .header {
    @media (max-width: 639px) {
      margin: 0 -24px;
    }

    span {
      display: inline-block;
      padding: 4px 16px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      color: var(--vp-code-lang);
      background-color: var(--vp-code-block-bg);
      border-bottom: 1px solid var(--vp-c-bg);

      &.active {
        color: var(--vp-code-block-color);
      }

      &:first-child {
        border-top-left-radius: 8px;
      }

      &:last-child {
        border-top-right-radius: 8px;
      }
    }

    span + span {
      border-left: 1px solid var(--vp-c-bg);
    }
  }

  .header + div {
    margin-top: 0 !important;
    border-top-left-radius: 0 !important;

    span.lang {
      display: none;
    }
  }
}

</style>
