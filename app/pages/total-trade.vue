<script lang="ts" setup>
/**
 * Total Trade — table and charts. Data is loaded from app/data/total-trade.json via useTotalTradeStore.
 */
import type { TotalTradeItem } from '~/stores/totalTrade'
import type { DataTableHeader } from 'vuetify'

const store = useTotalTradeStore()
const appStore = useAppStore()
const { t } = useI18n()
const chatbotOpen = computed(() => appStore.menuRight.drawer)
const yearFrom = ref(2022)
const yearTo = ref(2026)
const searchQuery = ref('')
const filteredItems = ref<TotalTradeItem[]>([])
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
const editingItem = ref<TotalTradeItem | null>(null)
const form = ref({
  period: '',
  domesticExport: 0,
  reExport: 0,
  totalExport: 0,
  totalImport: 0,
  totalTradeVolume: 0,
  balance: 0,
})

function formatNum(n: number) {
  return n.toLocaleString()
}

function doSearch() {
  filteredItems.value = store.items.filter((x) => {
    const y = parseInt(String(x.period), 10)
    return !Number.isNaN(y) && y >= yearFrom.value && y <= yearTo.value
  })
}

function doReset() {
  yearFrom.value = 2022
  yearTo.value = 2026
  searchQuery.value = ''
  filteredItems.value = [...store.items]
}

function matchSearch(item: TotalTradeItem, q: string): boolean {
  if (!q.trim()) return true
  const lower = q.trim().toLowerCase()
  const s = (v: unknown) => String(v).toLowerCase()
  return (
    s(item.period).includes(lower) ||
    s(item.domesticExport).includes(lower) ||
    s(item.reExport).includes(lower) ||
    s(item.totalExport).includes(lower) ||
    s(item.totalImport).includes(lower) ||
    s(item.totalTradeVolume).includes(lower) ||
    s(item.balance).includes(lower)
  )
}

const searchFilteredItems = computed(() => {
  const q = String(searchQuery.value ?? '').trim()
  if (!q) return filteredItems.value
  return filteredItems.value.filter((x) => matchSearch(x, q))
})

const tableHeaders = computed<DataTableHeader[]>(() => [
  { title: t('common.table.period'), key: 'period', sortable: true },
  { title: t('common.table.domesticExport'), key: 'domesticExport', sortable: true },
  { title: t('common.table.reExport'), key: 'reExport', sortable: true },
  { title: t('common.summary.totalExport'), key: 'totalExport', sortable: true },
  { title: t('common.table.totalImport'), key: 'totalImport', sortable: true },
  { title: t('common.table.totalTradeVolume'), key: 'totalTradeVolume', sortable: true },
  { title: t('common.table.balance'), key: 'balance', sortable: true },
  { title: t('common.table.actions'), key: 'actions', sortable: false },
])

const tableItems = computed(() =>
  searchFilteredItems.value.map((row) => ({
    ...row,
    domesticExport: formatNum(row.domesticExport),
    reExport: formatNum(row.reExport),
    totalExport: formatNum(row.totalExport),
    totalImport: formatNum(row.totalImport),
    totalTradeVolume: formatNum(row.totalTradeVolume),
    balance: row.balance < 0 ? `-${formatNum(Math.abs(row.balance))}` : formatNum(row.balance),
  }))
)

const barChartData = computed(() => ({
  labels: searchFilteredItems.value.map((x) => x.period),
  datasets: [
    {
      label: t('common.summary.totalExport'),
      data: searchFilteredItems.value.map((x) => x.totalExport),
      backgroundColor: 'rgba(42, 90, 127, 0.7)',
    },
    {
      label: t('common.summary.totalImport'),
      data: searchFilteredItems.value.map((x) => x.totalImport),
      backgroundColor: 'rgba(247, 209, 106, 0.7)',
    },
  ],
}))

const lineChartData = computed(() => ({
  labels: searchFilteredItems.value.map((x) => x.period),
  datasets: [
    {
      label: t('common.summary.tradeVolume'),
      data: searchFilteredItems.value.map((x) => x.totalTradeVolume),
      borderColor: 'rgb(42, 90, 127)',
      backgroundColor: 'rgba(42, 90, 127, 0.1)',
      fill: true,
    },
    {
      label: t('common.summary.balance'),
      data: searchFilteredItems.value.map((x) => x.balance),
      borderColor: 'rgb(198, 40, 40)',
      backgroundColor: 'rgba(198, 40, 40, 0.1)',
      fill: true,
    },
  ],
}))

const doughnutChartData = computed(() => ({
  labels: searchFilteredItems.value.map((x) => x.period),
  datasets: [
    {
      data: searchFilteredItems.value.map((x) => x.totalExport),
      backgroundColor: searchFilteredItems.value.map(
        (_, i) => `hsl(${210 + (i * 30) % 150}, 50%, 45%)`
      ),
    },
  ],
}))

function openAdd() {
  editingItem.value = null
  form.value = {
    period: String(new Date().getFullYear()),
    domesticExport: 0,
    reExport: 0,
    totalExport: 0,
    totalImport: 0,
    totalTradeVolume: 0,
    balance: 0,
  }
  dialog.value = true
}

function openEdit(item: unknown) {
  const row = item as TotalTradeItem | undefined
  if (!row?.id) return
  const raw = searchFilteredItems.value.find((r) => r.id === row.id)
  if (!raw) return
  editingItem.value = raw
  form.value = {
    period: raw.period,
    domesticExport: raw.domesticExport,
    reExport: raw.reExport,
    totalExport: raw.totalExport,
    totalImport: raw.totalImport,
    totalTradeVolume: raw.totalTradeVolume,
    balance: raw.balance,
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
  const row = item as TotalTradeItem
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

const summaryTotalExport = computed(() => {
  const sum = searchFilteredItems.value.reduce((acc, x) => acc + x.totalExport, 0)
  return formatNum(sum)
})
const summaryTotalImport = computed(() => {
  const sum = searchFilteredItems.value.reduce((acc, x) => acc + x.totalImport, 0)
  return formatNum(sum)
})
const summaryTradeVolume = computed(() => {
  const sum = searchFilteredItems.value.reduce((acc, x) => acc + x.totalTradeVolume, 0)
  return formatNum(sum)
})
const summaryBalance = computed(() => {
  const sum = searchFilteredItems.value.reduce((acc, x) => acc + x.balance, 0)
  return sum < 0 ? `-${formatNum(Math.abs(sum))}` : formatNum(sum)
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
    <!-- Summary cards: mobile = one scrollable row; sm+ = grid -->
    <div class="mb-2 min-w-0 shrink-0">
      <div class="grid w-full grid-cols-2 gap-2 md:grid-cols-4">
        <SummaryCard :title="t('common.summary.totalExport')" :value="summaryTotalExport" icon="mdi-export" />
        <SummaryCard :title="t('common.summary.totalImport')" :value="summaryTotalImport" icon="mdi-import" />
        <SummaryCard :title="t('common.summary.tradeVolume')" :value="summaryTradeVolume" icon="mdi-chart-box" />
        <SummaryCard :title="t('common.summary.balance')" :value="summaryBalance" icon="mdi-scale-balance" />
      </div>
    </div>

    <!-- Header: mobile = smaller title + icons only; sm+ = full labels -->
    <!-- Mobile: only title (smaller) + icon buttons; sm+: full toolbar -->
    <div class="flex min-w-0 shrink-0 flex-nowrap items-center justify-between gap-2 py-3 pr-2 sm:gap-3">
      <h1 class="shrink-0 font-bold text-[#f2a530] text-xl sm:text-xl" :class="chatbotOpen ? 'sm:text-base' : ''">
        {{ t('common.pages.tableTotalTrade') }}
      </h1>
      <!-- Mobile only: do not show on desktop (sm and up) -->
      <div class="shrink-0 sm:hidden">
        <v-btn icon size="small" variant="tonal"
          :aria-label="t('common.pages.filterAndActions')" @click="openToolbarDialog">
          <v-icon size="20">mdi-tune-variant</v-icon>
        </v-btn>
      </div>
      <div class="hidden shrink-0 flex-nowrap items-center gap-3 sm:flex">
        <AppSearch v-model="searchQuery" field-class="min-w-[180px] max-w-[280px]" />
        <v-btn icon size="small" variant="tonal" class="shrink-0 sm:hidden"
          :aria-label="t('common.pages.filterAndActions')" @click="openToolbarDialog">
          <v-icon size="20">mdi-tune-variant</v-icon>
        </v-btn>

      </div>
    </div>

    <v-dialog v-model="toolbarDialogOpen" max-width="400" persistent transition="dialog-transition"
      @keydown.escape="closeToolbarDialog">
      <v-card class="rounded-sm border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800">
        <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-600 px-4 py-3">
          <span class="font-semibold text-neutral-800 dark:text-neutral-100">{{ t('common.pages.filterAndActions')
            }}</span>
          <v-btn icon size="small" variant="text" aria-label="Close" @click="closeToolbarDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <div class="space-y-4 p-4">
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{{
              t('common.search.placeholder') }}</label>
            <AppSearch v-model="searchQuery" field-class="w-full max-w-full" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{{
              t('common.pages.dateFilter') }}</label>
            <div class="flex items-center gap-2">
              <v-select :model-value="yearFrom" :items="yearOptions" density="compact" hide-details
                :placeholder="t('common.pages.yearFrom')" class="flex-1 min-w-0" item-title="title" item-value="value"
                @update:model-value="yearFrom = $event; doSearch()" />
              <span class="shrink-0 text-neutral-400 dark:text-neutral-500">~</span>
              <v-select :model-value="yearTo" :items="yearOptions" density="compact" hide-details
                :placeholder="t('common.pages.yearTo')" class="flex-1 min-w-0" item-title="title" item-value="value"
                @update:model-value="yearTo = $event; doSearch()" />
            </div>
          </div>
          <div class="flex flex-col gap-2 pt-2">
            <v-btn color="primary" variant="flat"
              class="total-trade-action-btn w-full justify-start rounded-sm py-2 text-white dark:bg-[#3d7ba8]"
              @click="onToolbarAnalyst">
              <v-icon size="small" class="mr-2">mdi-chart-box-outline</v-icon>
              {{ t('common.pages.analyst') }}
            </v-btn>
            <v-btn color="primary" variant="flat"
              class="total-trade-action-btn w-full justify-start rounded-sm py-2 text-white dark:bg-[#3d7ba8]"
              @click="onToolbarAdd">
              <v-icon size="small" class="mr-2">mdi-plus</v-icon>
              {{ t('common.actions.add') }}
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <!-- Table: always scroll left/right on small screens; smaller font on mobile -->
    <div class="total-trade-table-wrapper min-w-0 flex-1 overflow-x-auto">
      <DataTableCrud :headers="tableHeaders" :items="tableItems" :loading="store.loading" :show-value-note="true"
        @add="openAdd" @edit="openEdit" @delete="remove" @delete-selected="removeMany" />
    </div>

    <!-- Add/Edit dialog: form + Save/Cancel; toasts shown on save -->
    <AppCrudDialog v-model="dialog" entity-name="Total Trade" :is-edit="!!editingItem" :max-width="560" @save="save">
      <div class="crud-form-scroll overflow-x-auto pt-2 -webkit-overflow-scrolling-touch px-1">
        <div class="min-w-[510px] space-y-4 pr-2">
          <v-text-field v-model="form.period" :label="t('common.table.period')" density="compact" hide-details
            class="w-[500px]" />
          <v-text-field v-model.number="form.domesticExport" :label="t('common.table.domesticExport')" type="number"
            density="compact" hide-details />
          <v-text-field v-model.number="form.reExport" :label="t('common.table.reExport')" type="number"
            density="compact" hide-details />
          <v-text-field v-model.number="form.totalExport" :label="t('common.summary.totalExport')" type="number"
            density="compact" hide-details />
          <v-text-field v-model.number="form.totalImport" :label="t('common.summary.totalImport')" type="number"
            density="compact" hide-details />
          <v-text-field v-model.number="form.totalTradeVolume" :label="t('common.table.totalTradeVolume')" type="number"
            density="compact" hide-details />
          <v-text-field v-model.number="form.balance" :label="t('common.table.balance')" type="number" density="compact"
            hide-details />
        </div>
      </div>
    </AppCrudDialog>

    <AppAnalyst v-model="chartDialogOpen" v-model:chart-type="chartDialogType" v-model:search-query="searchQuery"
      :year-from="yearFrom" :year-to="yearTo" :year-options="yearOptions" :bar-chart-data="barChartData"
      :line-chart-data="lineChartData" :doughnut-chart-data="doughnutChartData" download-filename-prefix="total-trade"
      @update:year-from="yearFrom = $event; doSearch()" @update:year-to="yearTo = $event; doSearch()" />
  </div>
</template>

<style scoped>
/* CRUD dialog: show full input labels (no truncation on left) */
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

/* Mobile: smaller table font; table scrolls via overflow-x-auto on wrapper */
.total-trade-table-wrapper :deep(.v-data-table),
.total-trade-table-wrapper :deep(.v-table) {
  font-size: 0.75rem;
}

@media (min-width: 640px) {

  .total-trade-table-wrapper :deep(.v-data-table),
  .total-trade-table-wrapper :deep(.v-table) {
    font-size: inherit;
  }
}
</style>
