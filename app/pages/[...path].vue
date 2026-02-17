<script lang="ts" setup>
/**
 * Catch-all route: shows 404 UI for any URL that doesn't match another page.
 * Uses empty layout so the 404 is a standalone full page (no sidebar, no header).
 */
definePageMeta({ layout: 'empty' })

const { t } = useI18n()

function goHome() {
  navigateTo('/')
}

function goBack() {
  if (import.meta.client && window.history.length > 1) {
    useRouter().back()
  } else {
    navigateTo('/')
  }
}
</script>

<template>
  <div class="flex min-w-0 flex-col items-center justify-center px-4 py-12">
    <v-card
      variant="flat"
      class="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-600 dark:bg-neutral-800"
    >
      <div class="flex flex-col items-center text-center">
        <v-icon
          icon="mdi-page-next-outline"
          size="64"
          color="primary"
          class="mb-4"
        />
        <h1 class="mb-8 text-xl font-bold text-neutral-800 dark:text-neutral-100">
          {{ t('common.error.pageNotFound') }}
        </h1>
        <p class="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
          {{ t('common.error.pageNotFoundDescription') }}
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <v-btn color="primary" variant="flat" rounded="lg" @click="goHome">
            <v-icon start icon="mdi-home" />
            {{ t('common.error.goHome') }}
          </v-btn>
          <v-btn variant="outlined" rounded="lg" @click="goBack">
            <v-icon start icon="mdi-arrow-left" />
            {{ t('common.error.goBack') }}
          </v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>
