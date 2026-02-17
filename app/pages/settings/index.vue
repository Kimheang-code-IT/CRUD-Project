<script lang="ts" setup>
const { t } = useI18n()
const route = useRoute()

const categories = [
  {
    to: '/settings/general',
    icon: 'mdi-cog-outline',
    titleKey: 'common.settings.general',
  },
  {
    to: '/settings/profile',
    icon: 'mdi-account-outline',
    titleKey: 'common.settings.profile',
  },
]

function isActive(to: string) {
  if (to === '/settings') return false
  return route.path === to || route.path.startsWith(to + '/')
}

// Default: show General when visiting /settings
onMounted(() => {
  if (route.path === '/settings') {
    navigateTo('/settings/general', { replace: true })
  }
})
</script>

<template>
  <div class="settings-page flex min-h-0 min-w-0 flex-col">
    <div class="mb-4 shrink-0 md:mb-6">
      <h1 class="text-xl font-bold text-neutral-800 dark:text-neutral-100 md:text-2xl">
        {{ t('common.settings.title') }}
      </h1>
    </div>

    <div class="settings-layout grid min-h-0 min-w-0 flex-1 gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
      <!-- Category cards grid -->
      <div class="settings-categories-grid grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:max-w-[320px]">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.to"
          :to="cat.to"
          class="settings-category-card flex flex-col items-center justify-center gap-2 rounded-xl border-2 bg-white p-4 transition-colors dark:bg-neutral-800"
          :class="isActive(cat.to)
            ? 'border-primary text-primary dark:border-primary dark:text-primary'
            : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-600 dark:hover:border-neutral-500'"
        >
          <v-icon :icon="cat.icon" size="28" class="shrink-0" />
          <span class="text-center text-sm font-medium">{{ t(cat.titleKey) }}</span>
        </NuxtLink>
      </div>

      <!-- Detail panel -->
      <div class="settings-detail min-h-0 min-w-0 overflow-auto rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-600 dark:bg-neutral-800">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-category-card {
  text-decoration: none;
}
</style>
