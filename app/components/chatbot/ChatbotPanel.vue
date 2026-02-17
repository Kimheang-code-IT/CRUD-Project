<script lang="ts" setup>
/**
 * Right-side chatbot panel (Notion-style), 30% width. Full height, no panel scroll. Prompt input at bottom.
 */
const appStore = useAppStore()
const prompt = ref('')

function close() {
  appStore.toggleDrawerRight()
}

function sendPrompt() {
  const text = prompt.value.trim()
  if (!text) return
  // TODO: send to chat API / add to messages
  console.log('Prompt:', text)
  prompt.value = ''
}

function onPromptKeydown(e: KeyboardEvent) {
  // ChatGPT-style: Enter = new line. Ctrl+Enter / Cmd+Enter = send.
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    sendPrompt()
  }
}
</script>

<template>
  <aside class="flex h-full min-h-0 w-full flex-col border-l border-[#e8eef2] dark:border-neutral-600 bg-white dark:bg-neutral-800 shadow-lg" style="min-width: 0;">
    <!-- Header -->
    <div class="flex shrink-0 items-center justify-between gap-2 border-b border-[#e8eef2] dark:border-neutral-600 bg-[#ebf1f5] dark:bg-neutral-700 px-4 py-3">
      <div class="flex items-center gap-2">
        <v-icon icon="mdi-robot" size="24" class="text-[#20577a] dark:text-neutral-200" />
        <span class="font-semibold text-[#20577a] dark:text-neutral-200">Assistant</span>
      </div>
      <div class="flex items-center gap-1">
        <v-btn
          icon
          variant="text"
          size="small"
          class="text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-600"
          :aria-label="appStore.chatbotFullMain ? 'Exit full' : 'Full main'"
          @click="appStore.toggleChatbotFullMain()"
        >
          <v-icon :icon="appStore.chatbotFullMain ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'" size="20" />
        </v-btn>
        <v-btn
          icon
          variant="text"
          size="small"
          class="text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-600"
          aria-label="Close"
          @click="close"
        >
          <v-icon icon="mdi-close" size="20" />
        </v-btn>
      </div>
    </div>

    <!-- Content: when full screen, center like ChatGPT (max-width column); otherwise full width -->
    <div
      class="flex min-h-0 flex-1 flex-col overflow-hidden"
      :class="appStore.chatbotFullMain ? 'items-center' : ''"
    >
      <div
        class="flex min-h-0 flex-1 flex-col"
        :class="appStore.chatbotFullMain ? 'w-full max-w-3xl mx-auto' : 'w-full'"
      >
        <!-- Messages area -->
        <div class="min-h-0 flex-1 overflow-y-auto p-4" :class="appStore.chatbotFullMain ? 'px-6' : ''">
          <div class="flex min-h-full flex-col items-center justify-center gap-2 text-center text-neutral-500 dark:text-neutral-400">
            <v-icon icon="mdi-robot-happy-outline" size="48" class="opacity-60 text-neutral-400 dark:text-neutral-500" />
            <p class="text-sm text-neutral-600 dark:text-neutral-300">Ask me anything about trade statistics.</p>
          </div>
        </div>

        <!-- Prompt input: ChatGPT-style — Enter = new line, Ctrl+Enter or Send button = send -->
        <div
          class="chatbot-prompt-wrap shrink-0 border-t border-[#e8eef2] dark:border-neutral-600 bg-white dark:bg-neutral-800 p-3"
          :class="appStore.chatbotFullMain ? 'flex justify-center px-4 pb-6' : ''"
        >
          <div
            class="flex w-full min-h-[52px] max-h-[200px] items-end gap-1 rounded-2xl border border-neutral-200 dark:border-neutral-600 bg-neutral-50/80 dark:bg-neutral-700/80 px-3 py-2 shadow-sm transition focus-within:border-[#2A5A7F] dark:focus-within:border-[#3d7ba8] focus-within:bg-white dark:focus-within:bg-neutral-700 focus-within:shadow-md"
            :class="appStore.chatbotFullMain ? 'max-w-3xl' : ''"
          >
            <v-textarea
              v-model="prompt"
              placeholder="Message Assistant..."
             
              auto-grow
              density="compact"
              hide-details
              variant="plain"
              class="chatbot-prompt-field flex-1 min-h-0"
              autocomplete="off"
              @keydown="onPromptKeydown"
            />
            <v-btn
              color="primary"
              variant="flat"
              icon
              size="small"
              class="shrink-0 rounded-xl text-white dark:bg-[#3d7ba8] dark:hover:opacity-90 mb-1"
              aria-label="Send"
              :disabled="!prompt.trim()"
              :class="{ 'opacity-60': !prompt.trim() }"
              @click="sendPrompt"
            >
              <v-icon icon="mdi-send" size="20" />
            </v-btn>
          </div>
        </div>
        <p class="my-2! w-full text-center text-xs text-neutral-400 dark:text-neutral-500">
          ChatBot can make mistakes. Check important info.
        </p>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* Prompt area: light text and placeholder in dark mode */
.dark .chatbot-prompt-field :deep(.v-field__input),
body.dark .chatbot-prompt-field :deep(.v-field__input),
.dark .chatbot-prompt-field :deep(input),
body.dark .chatbot-prompt-field :deep(input),
.dark .chatbot-prompt-field :deep(textarea),
body.dark .chatbot-prompt-field :deep(textarea) {
  color: #e5e5e5 !important;
}
.dark .chatbot-prompt-field :deep(input::placeholder),
body.dark .chatbot-prompt-field :deep(input::placeholder),
.dark .chatbot-prompt-field :deep(textarea::placeholder),
body.dark .chatbot-prompt-field :deep(textarea::placeholder) {
  color: rgb(163 163 163) !important;
}
/* Multi-line textarea: sensible min height and scroll in dark */
.chatbot-prompt-field :deep(.v-field__input) {
  min-height: 2.5rem;
}
.dark .chatbot-prompt-wrap :deep(.v-field),
body.dark .chatbot-prompt-wrap :deep(.v-field) {
  background: transparent !important;
}
</style>

