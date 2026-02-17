<template>
  <div class="siemreap-regular" :class="{ dark: theme === 'dark' }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import logoUrl from '~/assets/styles/image/logo.png'

const { theme } = storeToRefs(useAppStore())

// Sync .dark to body so teleported overlays (dialogs, menus) get dark mode styles
onMounted(() => {
  const apply = () => document.body.classList.toggle('dark', theme.value === 'dark')
  apply()
  const stop = watch(theme, apply)
  onUnmounted(stop)
})

useHead({
  title: 'អគ្គនាយកដ្ឋានគយនិងរដ្ឋាករកម្ពុជា',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: logoUrl },
  ],
})
</script>
