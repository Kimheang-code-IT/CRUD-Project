<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '~/stores/AppStore'
import { all } from '~/utils/constants/menu'
import logoUrl from '~/assets/styles/image/logo_Static.png'

const { t } = useI18n()
const routes = ref(all)
const { menu, isMdAndUp, theme } = storeToRefs(useAppStore())

const drawer = computed({
  get() {
    return menu.value.drawer
  },
  set(val: boolean) {
    menu.value.drawer = val
  },
})

const rail = computed({
  get() {
    return menu.value.rail && isMdAndUp.value
  },
  set(val: boolean) {
    menu.value.rail = val
  },
})

onMounted(() => {
  nextTick(() => {
    menu.value.drawer = isMdAndUp.value
  })
})

watch(isMdAndUp, (mdAndUp) => {
  if (!mdAndUp) menu.value.drawer = false
}, { immediate: false })
</script>

<template>
  <v-navigation-drawer v-model="drawer" :rail="rail" :expand-on-hover="false" :floating="isMdAndUp"
    :permanent="isMdAndUp" :temporary="!isMdAndUp" :rail-width="72" width="280" elevation="0"
    :class="['c-v-navigation-drawer sidebar-blue', theme === 'dark' ? 'sidebar-dark' : '']">
    <!-- Header: when rail, show only logo (icon); border uses theme for dark mode -->
    <div
      class="flex items-center border-b border-r px-4"
      :class="[
        theme === 'dark' ? 'border-white/10' : 'border-white/20',
        rail ? 'justify-center py-[12px]' : 'gap-3 px-4 py-[10px]'
      ]"
    >
      <NuxtLink to="/" class="shrink-0 flex items-center" :title="t('common.app.logoTitle')">
        <div
          class=" overflow-hidden"
          :class="rail ? 'h-10 w-10' : 'h-10 w-[40px]'"
        >
          <v-img
            :src="logoUrl"
            alt="Logo"
            contain
            class="h-full w-full"
          />
        </div>
      </NuxtLink>
      <span v-show="!rail" class="min-w-0 flex-1 text-[22px] font-medium text-[#f2a530] dark:text-[#f7d16a]">
        {{ t('common.app.title') }}
      </span>
    </div>

    <!-- Nav: when rail, only icon visible; title hidden; tooltip shows label on hover -->
    <v-list nav density="compact" class="sidebar-blue-list  flex flex-col "
      :class="rail ? 'py-[12px]' : 'gap-2 px-4  py-[10px]'">
      <v-tooltip v-for="route in routes" :key="route.titleKey" :disabled="!rail" location="end" :text="t(route.titleKey)">
        <template #activator="{ props: tooltipProps }">
          <v-list-item v-bind="tooltipProps" :to="route.to" rounded="xs" class="mb-1"
            color="white !border-l-4 !rounded-xs !border-[#f2a530]">
            <template #prepend>
              <v-icon :icon="route.icon" />
            </template>
            <template #title>
              <span v-show="!rail">{{ t(route.titleKey) }}</span>
            </template>
          </v-list-item>
        </template>
      </v-tooltip>
    </v-list>

    <v-spacer />

    <template #append>
      <!-- Same as AppBar: blue in light (#2A5A7F), darker blue in dark (#1e3a52) -->
      <div
        class="sidebar-append border-t!"
        :class="[
          theme === 'dark' ? 'sidebar-append-dark !border-white/10' : 'sidebar-append-light !border-white/20',
          rail ? 'flex justify-center py-[12px]' : 'px-4 py-[10px]'
        ]"
      >
        <v-list
          nav
          density="compact"
          class="sidebar-blue-list min-h-0"
          :class="rail ? 'justify-center' : 'gap-3'"
        >
          <v-tooltip :disabled="!rail" location="end" :text="t('common.menu.settings')">
            <template #activator="{ props: tooltipProps }">
              <v-list-item v-bind="tooltipProps" to="/settings" rounded="xs" class="mb-1"
                color="white !border-l-3 !rounded-sm !border-[#f2a530]">
                <template #prepend>
                  <v-icon icon="mdi-cog-outline" />
                </template>
                <template #title>
                  <span v-show="!rail">{{ t('common.menu.settings') }}</span>
                </template>
              </v-list-item>
            </template>
          </v-tooltip>
        </v-list>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
/* Match AppBar: same blue in light, darker blue in dark */
.sidebar-blue :deep(.v-navigation-drawer),
.sidebar-blue :deep(.v-navigation-drawer__content) {
  background-color: #2a5a7f !important;
}

.sidebar-blue.sidebar-dark :deep(.v-navigation-drawer),
.sidebar-blue.sidebar-dark :deep(.v-navigation-drawer__content) {
  background-color: #1e3a52 !important;
}

/* Settings append: same as AppBar — blue in light, darker blue in dark */
.sidebar-append.sidebar-append-light {
  background-color: #2a5a7f !important;
}
.sidebar-append.sidebar-append-dark {
  background-color: #1e3a52 !important;
}

.sidebar-blue :deep(.v-list),
.sidebar-blue :deep(.v-list-item) {
  background: transparent !important;
}

.sidebar-blue :deep(.v-list-item:hover),
.sidebar-blue :deep(.v-list-item.v-list-item--active) {
  background: rgba(255, 255, 255, 0.08) !important;
}

.sidebar-blue.sidebar-dark :deep(.v-list-item:hover),
.sidebar-blue.sidebar-dark :deep(.v-list-item.v-list-item--active) {
  background: rgba(255, 255, 255, 0.06) !important;
}

/* White text and icons in both light and dark */
.sidebar-blue :deep(.v-list-item),
.sidebar-blue :deep(.v-list-item__content),
.sidebar-blue :deep(.v-list-item-title),
.sidebar-blue :deep(.v-list-item-title span) {
  color: #ffffff !important;
}

.sidebar-blue :deep(.v-list-item__content) {
  min-width: 0 !important;
  overflow: visible !important;
}

.sidebar-blue :deep(.v-list-item-title) {
  font-size: 1rem !important;
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: unset !important;
  word-break: break-word;
  min-width: 0;
}

.sidebar-blue :deep(.v-icon) {
  color: #ffffff !important;
  opacity: 1;
}
</style>
