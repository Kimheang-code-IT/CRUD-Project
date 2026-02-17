<template>
  <v-app-bar class="h-16 border-b-4! border-[#f2a530]! bg-[#2A5A7F] dark:bg-[#1e3a52]" flat position="sticky">
    <div class="flex w-full items-center justify-between gap-2 pl-2 pr-2 sm:pr-4">
      <div class="flex min-w-0 flex-1 items-center justify-between gap-2">
        <div class="flex min-w-0 flex-1 items-center gap-1 sm:gap-2 app-bar-left">
          <v-btn :icon="menuIcon" class="app-bar-icon-btn shrink-0" @click="onClickMenuIcon" />
          <NuxtLink to="/" class="shrink-0" :title="t('common.app.logoTitle')">
            <v-img :src="logoUrl" alt="logo" width="36" height="36" class="shrink-0 sm:h-[40px] sm:w-[40px]" contain />
          </NuxtLink>
          <span class="hidden truncate font-medium text-[#f2a530] md:inline">
            {{ t('common.app.fullTitle') }}
          </span>
          <v-btn
            class="app-bar-search-btn flex shrink-0 cursor-pointer items-center rounded-xs! px-1.5 py-1 sm:px-2"
            @click.stop="openSearch"
          >
            <v-icon icon="mdi-magnify" size="20" />
            <span class="hidden pl-2 text-[12px] sm:inline">Ctrl+K</span>
          </v-btn>
        </div>
        <div class="flex shrink-0 items-center gap-1 sm:gap-4 app-bar-right">
          <AppSearchDialog v-model="searchOpen" />
          <v-btn class="flex shrink-0 cursor-pointer items-center rounded-xs! bg-white/20! dark:bg-white/10 px-1.5 py-1 sm:px-2" @click="toggleLocale">
            <v-img :src="locale === 'km' ? cambodiaUrl : EnglandUrl" :alt="locale === 'km' ? t('common.app.langKhmer') : t('common.app.langEnglish')" width="22" height="20" class="shrink-0 sm:h-[23px] sm:w-[25px]" contain />
            <span class="base-font-sans hidden text-xs font-medium text-white sm:inline sm:pl-2">{{ locale === 'km' ? t('common.app.langKhmer') : t('common.app.langEnglish') }}</span>
          </v-btn>
          <v-btn
            icon="mdi-robot"
            class="app-bar-icon-btn icon-cycle-animate hidden sm:inline-flex"
            aria-label="Open assistant"
            @click="$app.toggleDrawerRight()"
          />
          <v-btn
            :icon="theme === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
            class="app-bar-icon-btn"
            :aria-label="theme === 'dark' ? t('common.app.ariaSwitchToLight') : t('common.app.ariaSwitchToDark')"
            @click="$app.toggleTheme()"
          />
          <v-btn icon="mdi-account-circle" class="app-bar-icon-btn" />
        </div>
      </div>
    </div>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import AppSearchDialog from './AppSearchDialog.vue'
import logoUrl from '~/assets/styles/image/logo.png'
import cambodiaUrl from '~/assets/styles/image/cambodia.png'
import EnglandUrl from '~/assets/styles/image/England.png'

const { locale, setLocale, t } = useI18n()
const $app = useAppStore()
const { isMdAndUp, theme } = storeToRefs($app)

function toggleLocale() {
  setLocale(locale.value === 'km' ? 'en' : 'km')
}
// When sidebar closed -> menu; when open + rail (icons only) -> expand; when open + expanded -> collapse to icons
const menuIcon = computed(() => {
  if (!$app.menu.drawer) return 'mdi-menu'
  return $app.menu.rail ? 'mdi-menu' : 'mdi-menu'
})

function onClickMenuIcon() {
  if (!isMdAndUp.value) {
    $app.toggleDrawer()
  } else {
    if (!$app.menu.drawer) {
      $app.setDrawer(true)
    } else {
      $app.toggleRail()
    }
  }
}

const searchOpen = ref(false)
function openSearch() {
  searchOpen.value = true
}

onMounted(() => {
  function onKey(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      e.stopPropagation()
      searchOpen.value = true
    }
  }
  document.addEventListener('keydown', onKey, true)
  onUnmounted(() => document.removeEventListener('keydown', onKey, true))
})
</script>

<style scoped>
.v-app-bar {
  background-color: #2a5a7f !important;
}
.dark .v-app-bar,
body.dark .v-app-bar {
  background-color: #1e3a52 !important;
}

/* Search button: visible border and background */
.app-bar-search-btn :deep(.v-btn__overlay),
.app-bar-search-btn.v-btn {
  background: rgba(255, 255, 255, 0.1) !important;
}
.app-bar-search-btn:hover :deep(.v-btn__overlay),
.app-bar-search-btn:hover.v-btn {
  background: rgba(255, 255, 255, 0.2) !important;
}

/* Ctrl K badge inside search button */
.ctrl-k-badge {
  display: inline-block;
  padding: 2px;
  font-size: 0.75rem;
  font-family: inherit;
  color: rgba(255, 255, 255, 0.9);
  border-radius: 0.25rem;
}

/* Language button: visible background; no uppercase/letter-spacing so Khmer renders correctly */
.app-bar-lang-btn :deep(.v-btn__overlay),
.app-bar-lang-btn.v-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  border: none !important;
  text-transform: none !important;
  letter-spacing: normal !important;
}
.app-bar-lang-btn:hover :deep(.v-btn__overlay),
.app-bar-lang-btn:hover.v-btn {
  background: rgba(255, 255, 255, 0.2) !important;
}

/* Icon buttons: transparent default, visible on hover */
.app-bar-icon-btn :deep(.v-btn__overlay),
.app-bar-icon-btn.v-btn {
  background: transparent !important;
}
.app-bar-icon-btn:hover :deep(.v-btn__overlay),
.app-bar-icon-btn:hover.v-btn {
  background: rgba(255, 255, 255, 0.1) !important;
}

/* White icons and text */
.app-bar-icon-btn :deep(.v-icon),
.app-bar-search-btn :deep(.v-icon),
.app-bar-search-btn,
.app-bar-search-btn span,
.app-bar-lang-btn,
.app-bar-lang-btn span {
  color: #ffffff !important;
}

@keyframes icon-cycle-in-out {
  0%, 100% {
    opacity: 0.85;
    transform: scale(0.95);
  }
  50% {
    opacity: 1;
    transform: scale(1.15);
  }
}

.icon-cycle-animate :deep(.v-icon) {
  animation: icon-cycle-in-out 2s ease-in-out infinite;
  color: #ffffff !important;
}
</style>
