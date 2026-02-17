<script lang="ts" setup>
defineProps<{
  dateFrom?: string
  dateTo?: string
  placeholderFrom?: string
  placeholderTo?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:dateFrom': [value: string]
  'update:dateTo': [value: string]
}>()
</script>

<template>
  <div class="flex items-center gap-2">
    <v-text-field :model-value="dateFrom" :placeholder="placeholderFrom ?? 'YYYY-MM'" type="month" density="compact"
      size="small" hide-details :disabled="disabled" prepend-inner-icon="mdi-calendar"
      class="date-range-picker-field max-w-[140px]" @update:model-value="emit('update:dateFrom', $event ?? '')" />
    <span class="text-neutral-500 dark:text-neutral-400">~</span>
    <v-text-field :model-value="dateTo" :placeholder="placeholderTo ?? 'YYYY-MM'" type="month" density="compact"
      hide-details :disabled="disabled" prepend-inner-icon="mdi-calendar" class="date-range-picker-field max-w-[140px]"
      @update:model-value="emit('update:dateTo', $event ?? '')" />
  </div>
</template>

<style scoped>
.date-range-picker-field :deep(.v-field) {
  border-radius: 0.375rem;
  border: 1px solid rgb(209 213 219);
  background-color: white;
}

.date-range-picker-field :deep(.v-field:hover) {
  border-color: rgb(156 163 175);
}

.date-range-picker-field :deep(.v-field--focused) {
  border-color: rgb(42 90 127);
  box-shadow: 0 0 0 1px rgb(42 90 127);
}
</style>
