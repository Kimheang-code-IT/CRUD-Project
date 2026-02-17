<script lang="ts" setup>
/**
 * Card wrapper for charts — use on any page with dynamic title, subtitle, and chart height.
 */
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    /** Chart area height (default 280px). Use for dynamic layout on all pages. */
    chartHeight?: string
  }>(),
  { chartHeight: '280px' }
)
</script>

<template>
  <v-card variant="flat" class="flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 shadow-sm">
    <v-card-item v-if="title || $slots.subtitle" class="pb-1">
      <v-card-title class="pb-1 text-base font-medium text-neutral-800 dark:text-neutral-100">
        {{ title }}
      </v-card-title>
      <v-card-subtitle v-if="subtitle" class="text-sm text-neutral-500 dark:text-neutral-400">
        {{ subtitle }}
      </v-card-subtitle>
      <slot name="subtitle" />
    </v-card-item>
    <v-divider v-if="title" class="border-neutral-200 dark:border-neutral-600" />
    <v-card-text class="min-h-0 flex-1 p-3">
      <div class="chart-container relative w-full" :style="{ height: chartHeight }">
        <slot />
      </div>
    </v-card-text>
  </v-card>
</template>
