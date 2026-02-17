<script lang="ts" setup>
const { t } = useI18n()
const appStore = useAppStore()

const language = ref('en')
const theme = computed({
  get: () => appStore.theme,
  set: (value: 'light' | 'dark') => appStore.setTheme(value),
})

const languageOptions = computed(() => [
  { title: t('common.app.langEnglish'), value: 'en' },
  { title: t('common.app.langKhmer'), value: 'km' },
])
const themeOptions = computed(() => [
  { title: t('common.settings.themeLight'), value: 'light' },
  { title: t('common.settings.themeDark'), value: 'dark' },
])

function onSave() {
  appStore.notifySuccess(t('common.notify.updated'))
}
</script>

<template>
  <div class="settings-detail-content">
    <h2 class="mb-1 text-lg font-semibold text-neutral-800 dark:text-neutral-100">
      {{ t('common.settings.general') }}
    </h2>
    <p class="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
      {{ t('common.settings.generalSubtitle') }}
    </p>

    <div class="space-y-8">
      <!-- Section: Language -->
      <div class="settings-section">
        <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
          <label class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {{ t('common.settings.language') }}
          </label>
        </div>
        <p class="mb-3 text-sm text-neutral-500 dark:text-neutral-400">
          Choose your preferred language for the application.
        </p>
        <v-select
          v-model="language"
          :items="languageOptions"
          item-title="title"
          item-value="value"
          density="compact"
          hide-details
          variant="outlined"
          class="max-w-xs"
        />
      </div>

      <!-- Section: Theme -->
      <div class="settings-section">
        <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
          <label class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {{ t('common.settings.theme') }}
          </label>
        </div>
        <p class="mb-3 text-sm text-neutral-500 dark:text-neutral-400">
          Switch between light and dark appearance.
        </p>
        <v-select
          v-model="theme"
          :items="themeOptions"
          item-title="title"
          item-value="value"
          density="compact"
          hide-details
          variant="outlined"
          class="max-w-xs"
        />
      </div>
    </div>

    <div class="mt-8">
      <v-btn color="primary" size="large" rounded="lg" @click="onSave">
        {{ t('common.actions.save') }}
      </v-btn>
    </div>
  </div>
</template>
