import { defineStore } from 'pinia'
import type { IHsCodeItem } from '~/types/entities'
import { HsCodeRepository } from '~/repositories/HsCodeRepository'

const repository = new HsCodeRepository()

export type { IHsCodeItem as HsCodeItem } from '~/types/entities'

export const useHsCodeStore = defineStore('hsCode', {
  state: () => ({ items: [] as IHsCodeItem[], loading: false }),

  actions: {
    async loadFromCsv() {
      this.loading = true
      try {
        this.items = await repository.load()
      } catch {
        this.items = []
      } finally {
        this.loading = false
      }
    },
    add(item: Omit<IHsCodeItem, 'id'>) {
      this.items = repository.add(this.items, item)
    },
    update(id: string, item: Partial<Omit<IHsCodeItem, 'id'>>) {
      this.items = repository.update(this.items, id, item)
    },
    remove(id: string) {
      this.items = repository.remove(this.items, id)
    },
    removeMany(ids: string[]) {
      this.items = repository.removeMany(this.items, ids)
    },
  },
})
