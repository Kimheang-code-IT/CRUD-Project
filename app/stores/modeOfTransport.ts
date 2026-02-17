import { defineStore } from 'pinia'
import type { IModeOfTransportItem } from '~/types/entities'
import { ModeOfTransportRepository } from '~/repositories/ModeOfTransportRepository'

const repository = new ModeOfTransportRepository()

export type { IModeOfTransportItem as ModeOfTransportItem } from '~/types/entities'

export const useModeOfTransportStore = defineStore('modeOfTransport', {
  state: () => ({ items: [] as IModeOfTransportItem[], loading: false }),

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
    add(item: Omit<IModeOfTransportItem, 'id'>) {
      this.items = repository.add(this.items, item)
    },
    update(id: string, item: Partial<Omit<IModeOfTransportItem, 'id'>>) {
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
