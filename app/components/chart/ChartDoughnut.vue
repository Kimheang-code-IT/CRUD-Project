<script lang="ts" setup>
/**
 * Doughnut chart — pass dynamic data and options from any page.
 */
import { Doughnut } from 'vue-chartjs'

const props = defineProps<{
  data: { labels: string[]; datasets: { data: number[]; backgroundColor?: string[] }[] }
  options?: Record<string, unknown>
}>()

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'right' as const },
  },
}
</script>

<template>
  <Doughnut :data="data" :options="{ ...defaultOptions, ...options }" />
</template>
