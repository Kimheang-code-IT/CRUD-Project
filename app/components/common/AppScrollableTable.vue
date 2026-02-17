<script lang="ts" setup>
/**
 * Reusable scrollable table wrapper with dynamic height.
 * Use inside a flex column parent (e.g. flex flex-col min-h-0 flex-1) so the table
 * fills remaining viewport space on any device. Sticky header + horizontal/vertical scroll.
 */
const props = withDefaults(
  defineProps<{
    /** Optional min height (e.g. '200px'). Leave unset to rely on flex only. */
    minHeight?: string
    /** Optional extra class for the scroll container */
    wrapperClass?: string
  }>(),
  { minHeight: undefined, wrapperClass: '' }
)
</script>

<template>
  <div
    class="scrollable-table-wrapper min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    :class="props.wrapperClass"
    :style="props.minHeight ? { minHeight: props.minHeight } : undefined"
  >
    <slot />
  </div>
</template>

<style scoped>
.scrollable-table-wrapper {
  /* Ensures flex child can shrink below content size so scroll works */
  contain: layout;
}
</style>
