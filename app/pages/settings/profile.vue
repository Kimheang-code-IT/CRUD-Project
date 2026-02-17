<script lang="ts" setup>
const { t } = useI18n()
const appStore = useAppStore()
const name = ref('')
const email = ref('')

function onSave() {
  appStore.notifySuccess(t('common.notify.updated'))
}
</script>

<template>
  <div class="settings-detail-content">
    <h2 class="mb-1 text-lg font-semibold text-neutral-800 dark:text-neutral-100">
      {{ t('common.settings.profile') }}
    </h2>
    <p class="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
      {{ t('common.settings.profileSubtitle') }}
    </p>

    <div class="space-y-8">
      <!-- Section: Avatar -->
      <div class="settings-section">
        <label class="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {{ t('common.settings.profile') }} picture
        </label>
        <p class="mb-3 text-sm text-neutral-500 dark:text-neutral-400">
          Your profile photo is shown in the header and on your account.
        </p>
        <div class="flex items-center gap-4">
          <v-avatar color="primary" size="80" class="shrink-0 rounded-full">
            <v-icon icon="mdi-account" size="40" />
          </v-avatar>
          <v-btn variant="outlined" size="small" rounded="lg">
            Change
          </v-btn>
        </div>
      </div>

      <!-- Section: Name -->
      <div class="settings-section">
        <label class="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {{ t('common.settings.name') }}
        </label>
        <p class="mb-3 text-sm text-neutral-500 dark:text-neutral-400">
          Your display name used across the application.
        </p>
        <v-text-field
          v-model="name"
          :label="t('common.settings.name')"
          density="compact"
          hide-details
          variant="outlined"
          class="max-w-md"
        />
      </div>

      <!-- Section: Email -->
      <div class="settings-section">
        <label class="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {{ t('common.settings.email') }}
        </label>
        <p class="mb-3 text-sm text-neutral-500 dark:text-neutral-400">
          Email address for notifications and account recovery.
        </p>
        <v-text-field
          v-model="email"
          :label="t('common.settings.email')"
          type="email"
          density="compact"
          hide-details
          variant="outlined"
          class="max-w-md"
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
