import { defineStore } from 'pinia'
import type { IPartnerCountryItem } from '~/types/entities'
import { PartnerCountryRepository } from '~/repositories/PartnerCountryRepository'

const repository = new PartnerCountryRepository()

export type { IPartnerCountryItem as PartnerCountryItem } from '~/types/entities'

export const usePartnerCountryStore = defineStore('partnerCountry', {
  state: () => ({ items: [] as IPartnerCountryItem[], loading: false }),

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
    add(item: Omit<IPartnerCountryItem, 'id'>) {
      this.items = repository.add(this.items, item)
    },
    update(id: string, item: Partial<Omit<IPartnerCountryItem, 'id'>>) {
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
