<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import type { IPartnerCountryItem } from '~/types/entities'
import type { DataTableHeader } from 'vuetify'

type PartnerCountryItem = IPartnerCountryItem

const store = usePartnerCountryStore()
const appStore = useAppStore()
const { t } = useI18n()
const chatbotOpen = computed(() => appStore.menuRight.drawer)
const yearFrom = ref(2022)
const yearTo = ref(2026)
const searchQuery = ref('')
const filteredItems = ref<PartnerCountryItem[]>([])
const dialog = ref(false)
const toolbarDialogOpen = ref(false)
const chartDialogOpen = ref(false)
const chartDialogType = ref<'bar' | 'line' | 'doughnut'>('bar')

function openToolbarDialog() {
  toolbarDialogOpen.value = true
}
function closeToolbarDialog() {
  toolbarDialogOpen.value = false
}
function onToolbarAnalyst() {
  openChartDialog('bar')
  closeToolbarDialog()
}
function onToolbarAdd() {
  openAdd()
  closeToolbarDialog()
}

const yearOptions = computed(() => {
  const list: { title: string; value: number }[] = []
  for (let y = 2015; y <= 2030; y++) list.push({ title: String(y), value: y })
  return list
})
const editingItem = ref<PartnerCountryItem | null>(null)
const form = ref({
  period: '',
  country: '',
  value: 0,
})

function formatNum(n: number) {
  return n.toLocaleString()
}

function getPeriodYear(period: string): number {
  const y = parseInt(String(period).slice(0, 4), 10)
  return Number.isNaN(y) ? 0 : y
}

function doSearch() {
  filteredItems.value = store.items.filter((x) => {
    const y = getPeriodYear(x.period)
    return y >= yearFrom.value && y <= yearTo.value
  })
}

function doReset() {
  yearFrom.value = 2022
  yearTo.value = 2026
  searchQuery.value = ''
  filteredItems.value = [...store.items]
}

function matchSearch(item: PartnerCountryItem, q: string): boolean {
  if (!q.trim()) return true
  const lower = q.trim().toLowerCase()
  const s = (v: unknown) => String(v).toLowerCase()
  return (
    s(item.period).includes(lower) ||
    s(item.country).includes(lower) ||
    s(item.value).includes(lower)
  )
}

const searchFilteredItems = computed(() => {
  const q = String(searchQuery.value ?? '').trim()
  if (!q) return filteredItems.value
  return filteredItems.value.filter((x) => matchSearch(x, q))
})

/** Period, Country, Value (sortable), Actions */
const tableHeaders = computed<DataTableHeader[]>(() => [
  { title: t('common.table.period'), key: 'period', sortable: true },
  { title: t('common.table.country'), key: 'country', sortable: true },
  { title: t('common.table.value'), key: 'value', sortable: true },
  { title: t('common.table.actions'), key: 'actions', sortable: false },
])

const tableItems = computed(() => searchFilteredItems.value.map((row) => ({ ...row })))

/** Aggregate value by period for charts */
const valueByPeriod = computed(() => {
  const map = new Map<string, number>()
  for (const x of searchFilteredItems.value) {
    const p = x.period || ''
    map.set(p, (map.get(p) || 0) + x.value)
  }
  const periods = [...map.keys()].sort()
  return { periods, values: periods.map((p) => map.get(p) || 0) }
})

const barChartData = computed(() => ({
  labels: valueByPeriod.value.periods,
  datasets: [
    {
      label: t('common.chart.partnerCountryValue'),
      data: valueByPeriod.value.values,
      backgroundColor: 'rgba(42, 90, 127, 0.7)',
    },
  ],
}))

const lineChartData = computed(() => ({
  labels: valueByPeriod.value.periods,
  datasets: [
    {
      label: t('common.chart.partnerCountryValue'),
      data: valueByPeriod.value.values,
      borderColor: 'rgb(42, 90, 127)',
      backgroundColor: 'rgba(42, 90, 127, 0.1)',
      fill: true,
    },
  ],
}))

const doughnutChartData = computed(() => ({
  labels: valueByPeriod.value.periods,
  datasets: [
    {
      data: valueByPeriod.value.values,
      backgroundColor: valueByPeriod.value.periods.map(
        (_, i) => `hsl(${210 + (i * 30) % 150}, 50%, 45%)`
      ),
    },
  ],
}))

function openAdd() {
  editingItem.value = null
  form.value = {
    period: String(new Date().getFullYear()) + '-01',
    country: '',
    value: 0,
  }
  dialog.value = true
}

function openEdit(item: unknown) {
  const row = item as PartnerCountryItem | undefined
  if (!row?.id) return
  const raw = searchFilteredItems.value.find((r) => r.id === row.id)
  if (!raw) return
  editingItem.value = raw
  form.value = {
    period: raw.period,
    country: raw.country,
    value: raw.value,
  }
  dialog.value = true
}

async function save() {
  const isEdit = !!editingItem.value
  const message = isEdit ? 'common.dialog.confirm.descriptionUpdate' : 'common.dialog.confirm.descriptionCreate'
  const ok = await appStore.dialogConfirmEvent({ message, type: 'info' })
  if (!ok) return
  if (editingItem.value) store.update(editingItem.value.id, form.value)
  else store.add(form.value)
  dialog.value = false
  doSearch()
  appStore.notifySuccess(isEdit ? t('common.notify.updated') : t('common.notify.created'))
}

async function remove(item: unknown) {
  const row = item as PartnerCountryItem
  const ok = await appStore.dialogConfirmEvent({ message: 'common.dialog.confirm.descriptionDelete', type: 'delete' })
  if (ok) {
    store.remove(row.id)
    doSearch()
    appStore.notifySuccess(t('common.notify.deleted'))
  }
}

async function removeMany(ids: unknown[]) {
  const ok = await appStore.dialogConfirmEvent({
    message: 'common.dialog.confirm.descriptionDeleteMany',
    messageParams: { count: ids.length },
    type: 'delete',
  })
  if (ok) {
    store.removeMany(ids as string[])
    doSearch()
    appStore.notifySuccess(t('common.notify.deleted'))
  }
}

const summaryTotalValue = computed(() => {
  const sum = searchFilteredItems.value.reduce((acc, x) => acc + x.value, 0)
  return formatNum(sum)
})
const summaryRecordCount = computed(() => formatNum(searchFilteredItems.value.length))
const summaryUniqueCountries = computed(() => {
  const set = new Set(searchFilteredItems.value.map((x) => x.country))
  return formatNum(set.size)
})
const summaryPeriods = computed(() => {
  const set = new Set(searchFilteredItems.value.map((x) => x.period))
  return formatNum(set.size)
})

function openChartDialog(type: 'bar' | 'line' | 'doughnut') {
  chartDialogType.value = type
  chartDialogOpen.value = true
}

onMounted(async () => {
  await store.loadFromCsv()
  doSearch()
})
watch(() => store.items, () => doSearch(), { deep: true })
</script>

<template>
  <div class="flex min-h-0 min-w-0 flex-col">
    <!-- Summary cards: same layout as total-trade -->
    <div class="mb-2 min-w-0 shrink-0">
      <div class="grid w-full grid-cols-2 gap-2 md:grid-cols-4">
        <SummaryCard :title="t('common.summary.totalValue')" :value="summaryTotalValue" icon="mdi-export" />
        <SummaryCard :title="t('common.table.period')" :value="summaryRecordCount" icon="mdi-format-list-numbered" />
        <SummaryCard :title="t('common.table.country')" :value="summaryUniqueCountries" icon="mdi-earth" />
        <SummaryCard :title="t('common.pages.dateFilter')" :value="summaryPeriods" icon="mdi-chart-box" />
      </div>
    </div>

    <!-- Header: mobile = title + filter icon; desktop = full toolbar (search, filter, date, Analyst, Add) -->
    <div class="flex min-w-0 shrink-0 flex-nowrap items-center justify-between gap-2 py-3 pr-2 sm:gap-3">
      <h1
        class="min-w-0 shrink font-bold text-[#f2a530] text-xl sm:text-xl"
        :class="chatbotOpen ? 'sm:text-base' : ''"
      >
        {{ t('common.menu.partnerCountry') }}
      </h1>
      <!-- Mobile only: Filter & Actions on the left -->
      <div class="shrink-0 sm:hidden!">
        <v-btn
          icon
          size="small"
          variant="tonal"
          :aria-label="t('common.pages.filterAndActions')"
          @click="openToolbarDialog"
        >
          <v-icon size="20">mdi-tune-variant</v-icon>
        </v-btn>
      </div>
      <!-- Desktop: search + Filter + date + Analyst + Add -->
      <div class="hidden shrink-0 flex-nowrap items-center gap-3 sm:flex">
        <AppSearch v-model="searchQuery" field-class="min-w-[180px] max-w-[280px]" />
        <v-btn
          icon
          size="small"
          variant="tonal"
          class="shrink-0"
          :aria-label="t('common.pages.filterAndActions')"
          @click="openToolbarDialog"
        >
          <v-icon size="20">mdi-tune-variant</v-icon>
        </v-btn>
      </div>
    </div>

    <v-dialog
      v-model="toolbarDialogOpen"
      max-width="400"
      persistent
      transition="dialog-transition"
      @keydown.escape="closeToolbarDialog"
    >
      <v-card class="rounded-sm border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800">
        <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-600 px-4 py-3">
          <span class="font-semibold text-neutral-800 dark:text-neutral-100">{{ t('common.pages.filterAndActions') }}</span>
          <v-btn icon size="small" variant="text" aria-label="Close" @click="closeToolbarDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <div class="space-y-4 p-4">
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ t('common.search.placeholder') }}</label>
            <AppSearch v-model="searchQuery" field-class="w-full max-w-full" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ t('common.pages.dateFilter') }}</label>
            <div class="flex items-center gap-2">
              <v-select
                :model-value="yearFrom"
                :items="yearOptions"
                density="compact"
                hide-details
                :placeholder="t('common.pages.yearFrom')"
                class="flex-1 min-w-0"
                item-title="title"
                item-value="value"
                @update:model-value="yearFrom = $event; doSearch()"
              />
              <span class="shrink-0 text-neutral-400 dark:text-neutral-500">~</span>
              <v-select
                :model-value="yearTo"
                :items="yearOptions"
                density="compact"
                hide-details
                :placeholder="t('common.pages.yearTo')"
                class="flex-1 min-w-0"
                item-title="title"
                item-value="value"
                @update:model-value="yearTo = $event; doSearch()"
              />
            </div>
          </div>
          <div class="flex flex-col gap-2 pt-2">
            <v-btn
              color="primary"
              variant="flat"
              class="total-trade-action-btn w-full justify-start rounded-sm py-2 text-white dark:bg-[#3d7ba8]"
              @click="onToolbarAnalyst"
            >
              <v-icon size="small" class="mr-2">mdi-chart-box-outline</v-icon>
              {{ t('common.pages.analyst') }}
            </v-btn>
            <v-btn
              color="primary"
              variant="flat"
              class="total-trade-action-btn w-full justify-start rounded-sm py-2 text-white dark:bg-[#3d7ba8]"
              @click="onToolbarAdd"
            >
              <v-icon size="small" class="mr-2">mdi-plus</v-icon>
              {{ t('common.actions.add') }}
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <!-- Table: Period, Country, Value, Actions -->
    <div class="by-partner-country-table-wrapper min-w-0 flex-1 overflow-x-auto">
      <DataTableCrud
        :headers="tableHeaders"
        :items="tableItems"
        :loading="store.loading"
        :show-value-note="false"
        @add="openAdd"
        @edit="openEdit"
        @delete="remove"
        @delete-selected="removeMany"
      />
    </div>

    <!-- Add/Edit dialog -->
    <AppCrudDialog v-model="dialog" entity-name="Partner Country" :is-edit="!!editingItem" :max-width="560" @save="save">
      <div class="crud-form-scroll overflow-x-auto pt-2 -webkit-overflow-scrolling-touch px-1">
        <div class="min-w-[280px] space-y-3 pr-2">
          <v-text-field
            v-model="form.period"
            :label="t('common.table.period')"
            density="compact"
            hide-details
          />
          <v-text-field
            v-model="form.country"
            :label="t('common.table.country')"
            density="compact"
            hide-details
          />
          <v-text-field
            v-model.number="form.value"
            :label="t('common.table.value')"
            type="number"
            density="compact"
            hide-details
          />
        </div>
      </div>
    </AppCrudDialog>

    <AppAnalyst
      v-model="chartDialogOpen"
      v-model:chart-type="chartDialogType"
      v-model:search-query="searchQuery"
      :year-from="yearFrom"
      :year-to="yearTo"
      :year-options="yearOptions"
      :bar-chart-data="barChartData"
      :line-chart-data="lineChartData"
      :doughnut-chart-data="doughnutChartData"
      download-filename-prefix="by-partner-country"
      @update:year-from="yearFrom = $event; doSearch()"
      @update:year-to="yearTo = $event; doSearch()"
    />
  </div>
</template>

<style scoped>
.crud-form-scroll :deep(.v-field),
.crud-form-scroll :deep(.v-input) {
  overflow: visible;
}
.crud-form-scroll :deep(.v-label),
.crud-form-scroll :deep(.v-field .v-label) {
  overflow: visible;
  white-space: normal;
  max-width: none;
}

.by-partner-country-table-wrapper :deep(.v-data-table),
.by-partner-country-table-wrapper :deep(.v-table) {
  font-size: 0.75rem;
}
@media (min-width: 640px) {
  .by-partner-country-table-wrapper :deep(.v-data-table),
  .by-partner-country-table-wrapper :deep(.v-table) {
    font-size: inherit;
  }
}
</style>
