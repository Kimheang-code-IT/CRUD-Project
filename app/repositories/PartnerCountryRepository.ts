import type { IPartnerCountryItem } from '~/types/entities'
import { BaseRepository } from './BaseRepository'
import partnerCountryData from '~/data/partner-country.json'

export class PartnerCountryRepository extends BaseRepository<IPartnerCountryItem> {
  protected async loadSource(): Promise<IPartnerCountryItem[]> {
    return (partnerCountryData as IPartnerCountryItem[]).map((x) => ({ ...x }))
  }
}
