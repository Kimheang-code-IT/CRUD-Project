import { defineStore } from 'pinia'
import type { ITotalTradeItem } from '~/types/entities'
import { TotalTradeRepository } from '~/repositories/TotalTradeRepository'

const repository = new TotalTradeRepository()

export type { ITotalTradeItem as TotalTradeItem } from '~/types/entities'

export const useTotalTradeStore = defineStore('totalTrade', {
  state: () => ({ items: [] as ITotalTradeItem[], loading: false }),

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
    add(item: Omit<ITotalTradeItem, 'id'>) {
      this.items = repository.add(this.items, item)
    },
    update(id: string, item: Partial<Omit<ITotalTradeItem, 'id'>>) {
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
