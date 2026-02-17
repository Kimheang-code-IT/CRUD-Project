<script lang="ts" setup>
/**
 * Bar chart — pass dynamic data and options from any page.
 */
import { Bar } from 'vue-chartjs'

const props = defineProps<{
  data: { labels: string[]; datasets: { label: string; data: number[]; backgroundColor?: string | string[] }[] }
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
  <Bar :data="data" :options="{ ...defaultOptions, ...options }" />
</template>
