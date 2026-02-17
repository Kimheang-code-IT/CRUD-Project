<script lang="ts" setup>
/**
 * Data table with action column (Edit, Delete) for use on all pages.
 * Headers should include an "actions" key for the action column.
 */
import type { DataTableHeader } from 'vuetify'

const { t } = useI18n()
const props = withDefaults(
  defineProps<{
    headers: DataTableHeader[]
    items: readonly unknown[]
    loading?: boolean
    showValueNote?: boolean
  }>(),
  { loading: false, showValueNote: true }
)

const emit = defineEmits<{
  add: []
  edit: [item: unknown]
  delete: [item: unknown]
  'delete-selected': [ids: unknown[]]
}>()

const selected = ref<unknown[]>([])
const page = ref(1)
const itemsPerPage = ref(250)

function onEdit(item: unknown) {
  emit('edit', item)
}

function onDelete(item: unknown) {
  emit('delete', item)
}

function onDeleteSelected() {
  emit('delete-selected', [...selected.value])
  selected.value = []
}

// Table wrapper: flex layout so table can control scroll
const tableWrapperClass =
  'flex min-h-0 flex-col' +
  ' [&_.v-data-table]:flex [&_.v-data-table]:min-h-0 [&_.v-data-table]:flex-1' +
  ' [&_.v-table]:flex [&_.v-table]:min-h-0 [&_.v-table]:flex-1' +
  ' [&_.v-table__wrapper]:min-h-0 [&_.v-table__wrapper]:flex-1' +
  ' [&_thead_th]:bg-[#ebf1f5]! dark:[&_thead_th]:bg-neutral-700! [&_thead_th]:text-[#20577a] dark:[&_thead_th]:text-neutral-200 [&_thead_th]:font-semibold' +
  ' [&_tbody_td]:border [&_tbody_td]:border-[#e8eef2] dark:[&_tbody_td]:border-neutral-600'
</script>

<template>
  <v-card
    class="data-table-card w-full min-w-0 overflow-y-hidden overflow-x-auto"
    variant="flat"
    elevation="0"
  >
    <div class="flex flex-wrap items-center gap-2 px-1">
      <slot name="toolbar" />
    </div>
    <div :class="tableWrapperClass" class="data-table-fixed-header data-table-scroll-x min-w-max w-full shrink-0 overflow-x-auto">
      <v-data-table
        v-model="selected"
        :headers="(headers as any)"
        :items="items"
        :loading="loading"
        :items-per-page="itemsPerPage"
        item-value="id"
        show-select
        density="comfortable"
        hover
        fixed-header
        height="50.9vh"
        @update:options="() => {}"
      >
        <template #item.actions="{ item }">
          <v-menu location="bottom end" transition="scale-transition">
            <template #activator="{ props: menuProps }">
              <v-btn
                v-bind="menuProps"
                icon
                variant="text"
                class="rounded-sm text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-700 dark:hover:text-neutral-200"
                aria-label="Actions"
              >
                <v-icon size="small">mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list class="min-w-[140px]" density="compact">
              <v-list-item :title="t('common.actions.edit')" prepend-icon="mdi-pencil" class="text-sm" @click="onEdit((item as { raw?: unknown }).raw ?? item)" />
              <v-list-item :title="t('common.actions.delete')" prepend-icon="mdi-delete" class="text-sm text-red-600!" @click="onDelete((item as { raw?: unknown }).raw ?? item)" />
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </div>
  </v-card>
</template>

<style scoped>
/* Horizontal scroll: card and inner wrapper both allow x scroll on all devices */
.data-table-card {
  -webkit-overflow-scrolling: touch;
}
.data-table-scroll-x {
  -webkit-overflow-scrolling: touch;
}
/* Table: full width when space available; when chat open or small screen, min-width keeps content and wrapper scrolls */
.data-table-fixed-header :deep(.v-table__wrapper > table) {
  width: 100%;
  min-width: max-content;
}
/* Header fixed (no scroll); only data rows scroll inside the table area */
.data-table-fixed-header :deep(.v-table__wrapper) {
  overflow-y: auto;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.data-table-fixed-header :deep(.v-table__wrapper > table > thead) {
  position: sticky;
  top: 0;
  z-index: 2;
  isolation: isolate;
}
.data-table-fixed-header :deep(.v-table__wrapper > table > thead th) {
  background: #ebf1f5 !important;
  box-shadow: inset 0 -1px 0 #e8eef2;
}
.dark .data-table-fixed-header :deep(.v-table__wrapper > table > thead th),
body.dark .data-table-fixed-header :deep(.v-table__wrapper > table > thead th) {
  background: rgb(55 65 81) !important;
  box-shadow: inset 0 -1px 0 rgb(75 85 99);
}
</style>
