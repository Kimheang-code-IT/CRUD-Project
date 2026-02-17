<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTotalTradeStore } from '~/stores/totalTrade'

/**
 * Dashboard — KPI cards and charts in teal/turquoise style.
 * Uses total trade data; layout inspired by modern analytics dashboards.
 */
const store = useTotalTradeStore()
const { t } = useI18n()

// Teal palette (matches reference dashboard)
const TEAL = {
  primary: 'rgb(20, 184, 166)',      // teal-500
  primaryAlpha: 'rgba(20, 184, 166, 0.7)',
  primaryLight: 'rgba(20, 184, 166, 0.15)',
  dark: 'rgb(13, 148, 136)',         // teal-600
  light: 'rgb(94, 234, 212)',        // teal-300
  shades: ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4'],
}

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' as const, labels: { color: '#64748b', usePointStyle: true } },
  },
  scales: {
    x: { grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { color: '#64748b', maxRotation: 45 } },
    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { color: '#64748b' } },
  },
}

// Last 12 periods for “last 12 months” style
const last12 = computed(() => {
  const items = store.items.slice(-12)
  return items
})

const kpiTotalExport = computed(() => {
  const sum = store.items.reduce((acc, x) => acc + x.totalExport, 0)
  return sum.toLocaleString()
})
const kpiTotalImport = computed(() => {
  const sum = store.items.reduce((acc, x) => acc + x.totalImport, 0)
  return sum.toLocaleString()
})
const kpiTradeVolume = computed(() => {
  const sum = store.items.reduce((acc, x) => acc + x.totalTradeVolume, 0)
  return sum.toLocaleString()
})
const kpiBalance = computed(() => {
  const sum = store.items.reduce((acc, x) => acc + x.balance, 0)
  const s = sum < 0 ? `-${Math.abs(sum).toLocaleString()}` : sum.toLocaleString()
  return s
})
// Chart 1: Export & Import (bar) — last 12 periods
const revenueSalesData = computed(() => {
  const labels = last12.value.map((x) => x.period)
  return {
    labels,
    datasets: [
      {
        label: t('common.summary.totalExport'),
        data: last12.value.map((x) => x.totalExport),
        backgroundColor: TEAL.primaryAlpha,
      },
      {
        label: t('common.summary.totalImport'),
        data: last12.value.map((x) => x.totalImport),
        backgroundColor: TEAL.light,
      },
    ],
  }
})

// Chart 2: Top 10 by export (horizontal bar)
const topByExport = computed(() => {
  const sorted = [...store.items].sort((a, b) => b.totalExport - a.totalExport).slice(0, 10)
  return sorted
})
const topByValueData = computed(() => ({
  labels: topByExport.value.map((x) => x.period),
  datasets: [
    {
      label: t('common.summary.totalExport'),
      data: topByExport.value.map((x) => x.totalExport),
      backgroundColor: TEAL.primaryAlpha,
    },
  ],
}))
const topByValueOptions = computed(() => ({
  ...chartDefaults,
  indexAxis: 'y' as const,
  plugins: {
    ...chartDefaults.plugins,
    legend: { display: false },
  },
}))

// Chart 3: Trade volume over time (line)
const volumeOverTimeData = computed(() => ({
  labels: last12.value.map((x) => x.period),
  datasets: [
    {
      label: t('common.summary.tradeVolume'),
      data: last12.value.map((x) => x.totalTradeVolume),
      borderColor: TEAL.primary,
      backgroundColor: TEAL.primaryLight,
      fill: true,
    },
  ],
}))

// Chart 4: Export by period (doughnut)
const exportByPeriodData = computed(() => ({
  labels: last12.value.map((x) => x.period),
  datasets: [
    {
      data: last12.value.map((x) => x.totalExport),
      backgroundColor: last12.value.map((_, i) => TEAL.shades[i % TEAL.shades.length]!) as string[],
    },
  ],
}))
const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'right' as const, labels: { color: '#64748b', usePointStyle: true } },
  },
}

onMounted(async () => {
  await store.loadFromCsv()
})
</script>

<template>
  <div class="dashboard-page flex min-h-0 min-w-0 flex-col gap-6">
    <!-- Summary row: 4 cards only, responsive -->
    <div class="min-w-0 shrink-0">
      <div class="dashboard-summary-grid grid w-full gap-2 sm:gap-3">
        <SummaryCard :title="t('common.dashboard.kpiTotalExport')" :value="kpiTotalExport" icon="mdi-export" />
        <SummaryCard :title="t('common.dashboard.kpiTotalImport')" :value="kpiTotalImport" icon="mdi-import" />
        <SummaryCard :title="t('common.dashboard.kpiTradeVolume')" :value="kpiTradeVolume" icon="mdi-chart-box" />
        <SummaryCard :title="t('common.dashboard.kpiBalance')" :value="kpiBalance" icon="mdi-scale-balance" />
      </div>
    </div>

    <!-- Charts: responsive 1 col mobile, 2x2 on md+ -->
    <div class="dashboard-charts-grid min-w-0">
      <ChartCard :title="t('common.dashboard.chartRevenueSales')" chart-height="250px" class="dashboard-chart-card">
        <ChartBar :data="revenueSalesData" :options="chartDefaults" />
      </ChartCard>
      <ChartCard :title="t('common.dashboard.chartVolumeOverTime')" chart-height="250px" class="dashboard-chart-card">
        <ChartLine :data="volumeOverTimeData" :options="chartDefaults" />
      </ChartCard>
      <ChartCard :title="t('common.dashboard.chartTopByValue')" chart-height="250px" class="dashboard-chart-card">
        <ChartBar :data="topByValueData" :options="topByValueOptions" />
      </ChartCard>
      <ChartCard :title="t('common.dashboard.chartExportByPeriod')" chart-height="250px" class="dashboard-chart-card">
        <ChartDoughnut :data="exportByPeriodData" :options="doughnutOptions" />
      </ChartCard>
    </div>
  </div>
</template>

<style scoped>
.dashboard-page :deep(.chart-container) {
  position: relative;
}

/* Summary: 2 cols mobile, 4 cols sm+ (one row of 4) */
.dashboard-summary-grid {
  grid-template-columns: repeat(2, 1fr);
}
@media (min-width: 640px) {
  .dashboard-summary-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Charts: 1 col mobile, 2x2 from md */
.dashboard-charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  gap: 12px;
}
@media (min-width: 768px) {
  .dashboard-charts-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-column-gap: 3px;
    grid-row-gap: 3px;
  }
}
</style>
