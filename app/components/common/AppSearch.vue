<script lang="ts" setup>
/**
 * Reusable search field with magnify icon and clearable.
 */
const { t } = useI18n()
const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    /** Extra classes for the field (e.g. max-w-[320px]) */
    fieldClass?: string
  }>(),
  { fieldClass: '' }
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const effectivePlaceholder = computed(() => props.placeholder ?? t('common.search.placeholder'))

function onInput(value: string | null) {
  emit('update:modelValue', value ?? '')
}
</script>

<template>
  <v-text-field
    :model-value="modelValue"
    density="compact"
    hide-details
    :placeholder="effectivePlaceholder"
    :class="['app-search-field min-w-[280px] max-w-[380px]', props.fieldClass]"
    clearable
    @update:model-value="onInput($event)"
  >
    <template #prepend-inner>
      <v-icon icon="mdi-magnify" size="20" class="text-neutral-500 dark:text-neutral-400" />
    </template>
  </v-text-field>
</template>
