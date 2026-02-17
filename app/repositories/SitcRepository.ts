import type { ISitcItem } from '~/types/entities'
import { BaseRepository } from './BaseRepository'
import sitcData from '~/data/sitc.json'

export class SitcRepository extends BaseRepository<ISitcItem> {
  protected async loadSource(): Promise<ISitcItem[]> {
    return (sitcData as ISitcItem[]).map((x) => ({ ...x }))
  }
}
