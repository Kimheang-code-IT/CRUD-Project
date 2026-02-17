<script lang="ts" setup>
import { useDisplay } from 'vuetify'

const appStore = useAppStore()
const { mobile } = useDisplay()

useAppTheme()

// Mobile: sidebar drawer closed (overlay). Desktop: drawer open. State lives in AppStore.
watch(mobile, (isMobile) => {
  appStore.setDrawer(!isMobile)
}, { immediate: true })

// On mobile, chatbot open = full screen (no side-by-side)
const chatbotFullScreen = computed(() =>
  appStore.chatbotFullMain || (mobile.value && appStore.menuRight.drawer)
)
</script>

<template>
  <v-app class="layout-app fill-height">
    <AppToast />
    <AppConfirmDialog />
    <NavItem>
      <AppSlidebar />
      <v-main class="layout-main flex min-h-0 flex-1 flex-col fill-height">
        <AppBar />
        <v-divider color="secondary" />
        <div
          class="layout-content-row flex min-h-0 flex-1 flex-row"
          :class="appStore.menuRight.drawer ? 'overflow-x-auto' : 'overflow-x-hidden'"
        >
          <!-- Main content: hidden when chatbot full screen (desktop full or mobile open) -->
          <div
            v-show="!chatbotFullScreen"
            class="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-auto transition-[width] duration-200"
            :class="appStore.menuRight.drawer && !mobile ? 'w-[70%]' : 'w-full'"
          >
            <div class="min-h-0 min-w-0 flex-1 overflow-auto">
              <v-sheet class="min-h-full min-w-0 elevation-0">
                <v-container fluid class="min-w-0 px-2! py-2!">
                  <NuxtPage />
                </v-container>
              </v-sheet>
            </div>
            <footer class="shrink-0">
              <AppFooter />
            </footer>
          </div>
          <!-- Chatbot panel: full screen on mobile when open; else 30% or 100% (full main) -->
          <div
            v-show="appStore.menuRight.drawer"
            class="layout-chatbot-wrapper flex min-h-0 shrink-0 flex-col border-l border-[#e8eef2] dark:border-neutral-600 transition-[width] duration-200"
            :class="[
              chatbotFullScreen ? 'w-full' : 'w-[30%]',
              chatbotFullScreen ? 'layout-chatbot-full' : '',
              mobile && appStore.menuRight.drawer ? 'layout-chatbot-mobile-full' : ''
            ]"
          >
            <ChatbotPanel />
          </div>
        </div>
      </v-main>
    </NavItem>
  </v-app>
</template>

<style scoped>
.layout-app {
  min-height: 100dvh;
  height: 100%;
}
.layout-main {
  min-height: 0;
}
.layout-content-row {
  min-height: 0;
}
.layout-chatbot-wrapper {
  height: 100%;
  min-height: 0;
}
/* Full-screen chatbot: fill viewport on any device (100dvh = mobile address-bar safe) */
.layout-chatbot-full {
  min-height: 100vh; /* fallback */
  min-height: 100dvh;
}

/* Mobile: chatbot as fixed overlay so it truly fills the screen */
.layout-chatbot-mobile-full {
  position: fixed;
  inset: 0;
  z-index: 30;
  height: 100vh;
  height: 100dvh;
  max-height: 100dvh;
  border-left: none;
}
</style>
