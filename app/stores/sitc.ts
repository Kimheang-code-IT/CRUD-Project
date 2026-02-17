import { defineStore } from 'pinia'
import type { ISitcItem } from '~/types/entities'
import { SitcRepository } from '~/repositories/SitcRepository'

const repository = new SitcRepository()

export type { ISitcItem as SitcItem } from '~/types/entities'

export const useSitcStore = defineStore('sitc', {
  state: () => ({ items: [] as ISitcItem[], loading: false }),

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
    add(item: Omit<ISitcItem, 'id'>) {
      this.items = repository.add(this.items, item)
    },
    update(id: string, item: Partial<Omit<ISitcItem, 'id'>>) {
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
