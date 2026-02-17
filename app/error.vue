<script lang="ts" setup>
const { t } = useI18n()
const error = useError()

const is404 = computed(() => error.value?.statusCode === 404)
const title = computed(() =>
  is404.value ? t('common.error.pageNotFound') : t('common.error.serverError')
)
const description = computed(() =>
  is404.value
    ? t('common.error.pageNotFoundDescription')
    : t('common.error.serverErrorDescription')
)

function goHome() {
  clearError({ redirect: '/' })
}

function goBack() {
  clearError()
  const router = useRouter()
  if (import.meta.client && window.history.length > 1) {
    router.back()
  } else {
    navigateTo('/')
  }
}
</script>

<template>
  <!-- Standalone full-page error: no main layout (sidebar/header), covers entire viewport -->
  <div class="error-page fixed inset-0 z-9999 flex min-w-0 flex-col items-center justify-center bg-white px-4 py-12 dark:bg-neutral-900">
    <v-card
      variant="flat"
      class="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-600 dark:bg-neutral-800"
    >
      <div class="flex flex-col items-center text-center">
        <v-icon
          :icon="is404 ? 'mdi-page-next-outline' : 'mdi-alert-circle-outline'"
          size="64"
          :color="is404 ? 'primary' : 'error'"
          class="mb-4"
        />
        <h1 class="mb-2 text-xl font-bold text-neutral-800 dark:text-neutral-100">
          {{ title }}
        </h1>
        <p class="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
          {{ description }}
        </p>
        <p
          v-if="!is404 && error?.message"
          class="mb-4 w-full rounded-lg bg-neutral-100 px-3 py-2 text-left text-xs text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300"
        >
          {{ error.message }}
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
