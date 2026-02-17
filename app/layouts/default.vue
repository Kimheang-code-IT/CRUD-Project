<script lang="ts" setup>
import { useDisplay } from 'vuetify'

const appStore = useAppStore()
const { mobile } = useDisplay()

useAppTheme()

// Mobile: sidebar drawer closed (overlay). Desktop: drawer open. State lives in AppStore.
watch(mobile, (isMobile) => {
  appStore.setDrawer(!isMobile)
}, { immediate: true })
</script>

<template>
  <v-app>
    <AppToast />
    <AppConfirmDialog />
    <NavItem>
      <AppSlidebar />
      <v-main class="flex min-h-0 flex-1 flex-col fill-height ">
        <AppBar />
        <v-divider color="secondary" />
        <div
          class="flex min-h-0 flex-1 flex-row"
          :class="appStore.menuRight.drawer ? 'overflow-x-auto' : 'overflow-x-hidden'"
        >
          <!-- Main content: hidden when chatbot full main, else 70% (chatbot open) or 100% -->
          <div
            v-show="!appStore.chatbotFullMain"
            class="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-auto transition-[width] duration-200"
            :class="appStore.menuRight.drawer ? 'w-[70%]' : 'w-full'"
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
          <!-- Chatbot panel: 30% or 100% when full main -->
          <div
            v-show="appStore.menuRight.drawer"
            class="flex h-full min-w-0 shrink-0 flex-col border-l border-[#e8eef2] dark:border-neutral-600 transition-[width] duration-200"
            :class="appStore.chatbotFullMain ? 'w-full' : 'w-[30%]'"
          >
            <ChatbotPanel />
          </div>
        </div>
      </v-main>
    </NavItem>
  </v-app>
</template>
