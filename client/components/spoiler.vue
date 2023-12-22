<script setup lang="ts">
defineProps({
  text: {
    type: String,
  },
})
</script>

<template>
  <span class="spoiler">
    <slot>{{ text }}</slot>
  </span>
</template>

<style lang="scss" scoped>

.spoiler {
  border-radius: 4px;
  padding: 1px 3px;
  margin: 0 3px;
  text-shadow: none;
  transition: color 0.2s linear;
  background-color: var(--vp-custom-block-tip-text);

  &:hover {
    color: var(--vp-c-bg);
  }
}

</style>
