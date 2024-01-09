<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: 'tip',
  },
  text: {
    type: String,
  },
  vertical: {
    type: String,
  },
})
</script>

<template>
  <span
    class="badge ignore-header"
    :class="type"
    :style="{ verticalAlign: vertical }"
  >
    <slot>{{ text }}</slot>
  </span>
</template>

<style lang="scss" scoped>

.badge {
  display: inline-block;
  font-size: 14px;
  height: 20px;
  line-height: 16px;
  border-radius: 3px;
  padding: 2px 6px;
  color: var(--vp-badge-text);
  vertical-align: baseline;

  @each $type in tip, warning, danger {
    &.#{$type} {
      background-color: var(--vp-badge-#{$type}-bg);
    }
  }

  h1 &, h2 &, h3 &, h4 &, h5 &, h6 & {
    vertical-align: top;
  }

  & + & {
    margin-left: 5px;
  }
}

</style>
