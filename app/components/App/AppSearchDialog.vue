<script setup lang="ts">
import type { MenuRoute } from '~/utils/constants/menu'
import { all as menuRoutes } from '~/utils/constants/menu'

const FAVORITES_KEY = 'app-search-favorites'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const query = ref('')
const inputRef = ref<{ focus: () => void } | null>(null)
const recentRoutes = ref<MenuRoute[]>([])
const favorites = ref<Set<string>>(new Set())

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (raw) favorites.value = new Set(JSON.parse(raw))
  } catch {
    favorites.value = new Set()
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites.value]))
  } catch {}
}

function isFavorite(to: string) {
  return favorites.value.has(to)
}

function toggleFavorite(e: Event, to: string) {
  e.stopPropagation()
  if (favorites.value.has(to)) {
    favorites.value.delete(to)
  } else {
    favorites.value.add(to)
  }
  favorites.value = new Set(favorites.value)
  saveFavorites()
}

function removeFromRecent(e: Event, route: MenuRoute) {
  e.stopPropagation()
  recentRoutes.value = recentRoutes.value.filter((r) => r.to !== route.to)
}

const filteredRoutes = computed(() => {
  const q = query.value.trim().toLowerCase()
  const list = recentRoutes.value
  if (!q) return list
  return list.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.to.toLowerCase().includes(q)
  )
})

const sectionTitle = computed(() => (query.value.trim() ? 'Results' : 'Recent'))

function close() {
  open.value = false
  query.value = ''
}

function goTo(route: { to: string }) {
  navigateTo(route.to)
  close()
}

watch(open, (isOpen) => {
  if (isOpen) {
    query.value = ''
    loadFavorites()
    if (recentRoutes.value.length === 0) {
      recentRoutes.value = menuRoutes.map((r) => ({ ...r }))
    }
    nextTick(() => inputRef.value?.focus())
  }
})

onMounted(() => {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close()
  }
  document.addEventListener('keydown', onKey)
  onUnmounted(() => document.removeEventListener('keydown', onKey))
})
</script>

<template>
  <v-dialog
    :model-value="open"
    max-width="560"
    persistent
    content-class="search-dialog-top"
    transition="dialog-transition"
    @update:model-value="(v) => (open = v)"
  >
    <v-card class="w-full overflow-hidden rounded-xs border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 shadow-xl">
      <!-- Search header -->
      <div class="flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-600 px-4 py-3">
        <div class="search-dialog-input flex flex-1 items-center rounded-xs border border-neutral-200 dark:border-neutral-600 bg-neutral-50/80 dark:bg-neutral-700/80 px-3 transition focus-within:border-[#2A5A7F] dark:focus-within:border-[#3d7ba8] focus-within:ring-2 focus-within:ring-[#2A5A7F]/20">
          <v-text-field
            ref="inputRef"
            :model-value="query"
            variant="plain"
            density="compact"
            placeholder="Looking for..."
            clearable
            class="pb-2 text-neutral-800 dark:text-neutral-100"
            autofocus
            hide-details
            prepend-inner-icon="mdi-magnify"
            @update:model-value="query = ($event ?? '')"
          />
        </div>
        <v-btn
          icon="mdi-close"
          size="small"
          class="shrink-0 rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          @click="close"
        />
      </div>

      <!-- Section title -->
      <div class="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-600 bg-neutral-50/50 dark:bg-neutral-700/50 px-4 py-2.5">
        <v-icon icon="mdi-clock-outline" size="20" class="text-neutral-400 dark:text-neutral-500" />
        <span class="text-sm font-medium text-neutral-600 dark:text-neutral-300">{{ sectionTitle }}</span>
      </div>

      <!-- Results list -->
      <div class="max-h-[320px] min-h-[200px] overflow-y-auto">
        <v-list v-if="filteredRoutes.length" class="py-0" density="compact">
          <v-list-item
            v-for="route in filteredRoutes"
            :key="route.to"
            class="group cursor-pointer rounded-lg px-4 py-2.5 transition hover:bg-neutral-50 dark:hover:bg-neutral-700"
            @click="goTo(route)"
          >
            <template #prepend>
              <v-icon :icon="route.icon" size="20" class="mr-3 shrink-0 text-neutral-500 dark:text-neutral-400" />
            </template>
            <span class="truncate text-sm font-medium text-neutral-800 dark:text-neutral-200">{{ route.title }}</span>
            <template #append>
              <div class="flex shrink-0 gap-0.5 opacity-0 transition group-hover:opacity-100" @click.stop>
                <v-btn
                  :icon="isFavorite(route.to) ? 'mdi-star' : 'mdi-star-outline'"
                  size="x-small"
                  class="min-w-0 rounded-full"
                  :class="isFavorite(route.to) ? 'text-amber-500' : 'text-neutral-400 dark:text-neutral-500 hover:text-amber-500'"
                  @click="toggleFavorite($event, route.to)"
                />
                <v-btn
                  icon="mdi-delete-outline"
                  size="x-small"
                  class="min-w-0 rounded-full text-neutral-400 dark:text-neutral-500 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600"
                  @click="removeFromRecent($event, route)"
                />
              </div>
            </template>
          </v-list-item>
        </v-list>
        <div
          v-else
          class="flex min-h-[200px] items-center justify-center py-12 text-sm text-neutral-500 dark:text-neutral-400"
        >
          {{ query.trim() ? 'No results found' : 'No recent searches' }}
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-600 bg-neutral-50/80 dark:bg-neutral-700/80 px-4 py-2.5 text-xs text-neutral-500 dark:text-neutral-400">
        <a href="#" class="flex items-center gap-1 font-medium text-[#2A5A7F] dark:text-[#3d7ba8] transition hover:underline">
          Advanced search
          <v-icon icon="mdi-open-in-new" size="14" />
        </a>
        <span class="flex items-center gap-1">
          Search by
          <span class="font-medium text-neutral-600 dark:text-neutral-300">GDCE</span>
        </span>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
/* Center at top on all devices */
:deep(.v-overlay__content) {
  align-items: flex-start;
  justify-content: center;
  padding-top: 2rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.search-dialog-top {
  align-self: flex-start;
}

/* Ensure search input text and placeholder are light in dark mode (dialog may be teleported) */
.dark .search-dialog-input :deep(.v-field__input),
body.dark .search-dialog-input :deep(.v-field__input),
.dark .search-dialog-input :deep(input),
body.dark .search-dialog-input :deep(input) {
  color: #e5e5e5 !important;
}
.dark .search-dialog-input :deep(.v-field__input::placeholder),
body.dark .search-dialog-input :deep(input::placeholder) {
  color: rgb(163 163 163) !important;
}
.dark .search-dialog-input :deep(.v-field),
body.dark .search-dialog-input :deep(.v-field) {
  background: transparent !important;
}
</style>
