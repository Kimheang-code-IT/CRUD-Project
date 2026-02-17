<script lang="ts" setup>
/**
 * Analyst chart dialog: date filter, search, chart type (Bar / Line / Doughnut), and download.
 * Bind filter state from parent; chart updates live when parent updates chart data.
 */

/** Matches ChartBar data prop */
interface BarChartData {
  labels: string[]
  datasets: { label: string; data: number[]; backgroundColor?: string | string[] }[]
}

/** Matches ChartLine data prop */
interface LineChartData {
  labels: string[]
  datasets: { label: string; data: number[]; borderColor?: string; backgroundColor?: string }[]
}

/** Matches ChartDoughnut data prop */
interface DoughnutChartData {
  labels: string[]
  datasets: { data: number[]; backgroundColor?: string[] }[]
}

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    chartType: 'bar' | 'line' | 'doughnut'
    yearFrom: number
    yearTo: number
    searchQuery: string
    yearOptions: { title: string; value: number }[]
    barChartData: BarChartData
    lineChartData: LineChartData
    doughnutChartData: DoughnutChartData
    /** Filename prefix for download (e.g. "total-trade") */
    downloadFilenamePrefix?: string
  }>(),
  { downloadFilenamePrefix: 'chart' }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:chartType': [value: 'bar' | 'line' | 'doughnut']
  'update:yearFrom': [value: number]
  'update:yearTo': [value: number]
  'update:searchQuery': [value: string]
}>()

const { t } = useI18n()
const chartCanvasWrapper = ref<HTMLElement | null>(null)

const dialogTitle = computed(() => {
  if (props.chartType === 'bar') return t('common.chart.titleBar')
  if (props.chartType === 'line') return t('common.chart.titleLine')
  return t('common.chart.titleDoughnut')
})

function onYearFrom(v: number) {
  emit('update:yearFrom', v)
}

function onYearTo(v: number) {
  emit('update:yearTo', v)
}

function downloadChart() {
  if (!chartCanvasWrapper.value || !props.chartType) return
  nextTick(() => {
    const canvas = chartCanvasWrapper.value?.querySelector('canvas')
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `${props.downloadFilenamePrefix}-${props.chartType}-${Date.now()}.png`
    a.click()
  })
}
</script>

<template>
  <AppDialog :model-value="modelValue" :title="dialogTitle" max-width="70vw" content-class=" mx-auto"
    @update:model-value="emit('update:modelValue', $event)">
    <!-- Filters: date range + search (parent handles doSearch on year change) -->
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 p-3">
      <div class="flex flex-row items-center gap-3">
      <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ t('common.chart.date') }}</span>
      <v-select :model-value="yearFrom" :items="yearOptions" density="compact" hide-details :placeholder="t('common.pages.yearFrom')"
        class="max-w-[100px]" item-title="title" item-value="value" @update:model-value="onYearFrom($event)" />
      <span class="text-neutral-400 dark:text-neutral-500">~</span>
      <v-select :model-value="yearTo" :items="yearOptions" density="compact" hide-details :placeholder="t('common.pages.yearTo')"
        class="max-w-[100px]" item-title="title" item-value="value" @update:model-value="onYearTo($event)" />
    </div>
      <!-- Chart type: Bar | Line | Doughnut -->
      <div class=" flex gap-2 ">
        <v-btn  :variant="chartType === 'bar' ? 'flat' : 'tonal'"
          :color="chartType === 'bar' ? 'primary' : undefined" class="rounded-sm"
          @click="emit('update:chartType', 'bar')">
          <v-icon start size="small">mdi-chart-bar</v-icon>
          {{ t('common.chart.bar') }}
        </v-btn>
        <v-btn  :variant="chartType === 'line' ? 'flat' : 'tonal'"
          :color="chartType === 'line' ? 'primary' : undefined" class="rounded-sm"
          @click="emit('update:chartType', 'line')">
          <v-icon start size="small">mdi-chart-line</v-icon>
          {{ t('common.chart.line') }}
        </v-btn>
        <v-btn  :variant="chartType === 'doughnut' ? 'flat' : 'tonal'"
          :color="chartType === 'doughnut' ? 'primary' : undefined" class="rounded-sm"
          @click="emit('update:chartType', 'doughnut')">
          <v-icon start size="small">mdi-chart-donut</v-icon>         {{ t('common.chart.doughnut') }}
        </v-btn>
      </div>
    </div>



    <div ref="chartCanvasWrapper" class="min-h-[400px] w-[70vw]">
      <div v-if="chartType === 'bar'" class="h-[400px] w-full">
        <ChartBar :data="barChartData" />
      </div>
      <div v-if="chartType === 'line'" class="h-[400px] w-full">
        <ChartLine :data="lineChartData" />
      </div>
      <div v-if="chartType === 'doughnut'" class="h-[400px] w-full">
        <ChartDoughnut :data="doughnutChartData" />
      </div>
    </div>

    <template #headerActions>
      <div class="flex shrink-0 items-center gap-2">
        <v-btn class="rounded-sm bg-[#2A5A7F] dark:bg-[#3d7ba8] text-white hover:opacity-90" @click="downloadChart">
          <v-icon start size="small">mdi-download</v-icon>
          {{ t('common.chart.download') }}
        </v-btn>
        <v-btn
          icon
          size="small"
          class="rounded-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          @click="emit('update:modelValue', false)"
        >
          <v-icon icon="mdi-close" size="small" />
        </v-btn>
      </div>
    </template>
  </AppDialog>
</template>
