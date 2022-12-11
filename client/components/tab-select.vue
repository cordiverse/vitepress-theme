<template>
  <div class="tab-select">
    <div class="header">
      <span
        v-for="key in keys"
        :key="key"
        :class="{ active: active === key }"
        @click="active = key"
      >
        <slot :name="'title-' + key">{{ key }}</slot>
      </span>
    </div>
    <slot :name="'tab-' + active"></slot>
  </div>
</template>

<script lang="ts" setup>

import { computed, useSlots } from 'vue'
import { useActiveTab } from '..'

const slots = useSlots()

const keys = computed(() => {
  return Object.keys(slots)
    .filter(key => key.startsWith('tab-'))
    .map(key => key.slice(4))
})

const active = useActiveTab(keys)

</script>

<style lang="scss">

.tab-select {
  margin-top: 16px;

  .header {
    span {
      display: inline-block;
      padding: 4px 16px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      user-select: none;
      color: var(--vp-c-text-2);
      background-color: var(--vp-code-block-bg);
      border-bottom: 1px solid var(--vp-c-bg);

      &.active {
        color: var(--vp-c-text-1);
      }

      &:first-child {
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
      }

      &:last-child {
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
      }
    }

    span + span {
      border-left: 1px solid var(--vp-c-bg);
    }
  }

  &.code .header {
    @media (max-width: 639px) {
      margin: 0 -24px;
    }

    span {
      &:first-child {
        border-bottom-left-radius: 0;
      }

      &:last-child {
        border-bottom-right-radius: 0;
      }
    }

    + div {
      margin-top: 0 !important;
      border-top-left-radius: 0 !important;

      span.lang {
        display: none;
      }
    }
  }
}

</style>
