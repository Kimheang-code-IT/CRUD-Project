<script lang="ts" setup>
/**
 * Main footer for all pages. Used in default layout.
 */
const { t } = useI18n()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="mt-auto border-l border-[#e8eef2] dark:border-neutral-600 bg-[#2a5a7f] dark:bg-[#1e3a52] px-3 py-2 sm:px-4 sm:py-3">
    <div class="flex flex-nowrap items-center justify-between gap-2 overflow-hidden text-xs text-[#f2a530] sm:text-sm">
      <span class="min-w-0 truncate font-medium">{{ t('common.footer.organization') }}</span>
      <span class="min-w-0 truncate text-right">{{ t('common.footer.copyright', { year: currentYear, name: 'Moeng Kimheang' }) }}</span>
    </div>
  </footer>
</template>
