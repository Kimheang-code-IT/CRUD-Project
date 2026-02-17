<script lang="ts" setup>
/**
 * Summary card for use on any page — dynamic title, value (or default slot), icon, and color.
 */
withDefaults(
  defineProps<{
    title: string
    /** Display value; use default slot for custom content instead */
    value?: string | number
    icon?: string
    color?: string
  }>(),
  { value: '' }
)
</script>

<template>
  <v-card variant="flat"
    class="flex h-full min-w-0 items-center rounded-xs! border-l-6! border-[#f2a530]! bg-[#2a5a7f]! dark:bg-[#1e3a52]! p-3! sm:p-4!" hover>
    <div class="flex w-full min-w-0 items-center">
      <v-avatar v-if="icon" :color="color ?? '#edc68c'" size="48" variant="tonal"
        class="mr-2 h-10 w-10 shrink-0 rounded-xs! sm:mr-3! sm:h-12! sm:w-12!">
        <v-icon :icon="icon" size="28" />
      </v-avatar>
      <div class="min-w-0 flex-1">
        <div class="mb-0.5 text-xs text-white sm:mb-1 sm:text-sm">{{ title }}</div>
        <div v-if="$slots.default" class="truncate text-sm font-bold text-gray-200 dark:text-gray-300 sm:text-base md:text-xl">
          <slot />
        </div>
        <div v-else class="truncate text-sm font-bold text-gray-200 dark:text-gray-300 sm:text-base md:text-xl">{{ value }}</div>
        <slot name="trend" />
      </div>
    </div>
  </v-card>
</template>
