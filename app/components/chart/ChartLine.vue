<script lang="ts" setup>
/**
 * Line chart — pass dynamic data and options from any page.
 */
import { Line } from 'vue-chartjs'

const props = defineProps<{
  data: { labels: string[]; datasets: { label: string; data: number[]; borderColor?: string; backgroundColor?: string }[] }
  options?: Record<string, unknown>
}>()

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' as const },
  },
  scales: {
    y: { beginAtZero: true },
  },
}
</script>

<template>
  <Line :data="data" :options="{ ...defaultOptions, ...options }" />
</template>
