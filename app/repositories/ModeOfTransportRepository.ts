import type { IModeOfTransportItem } from '~/types/entities'
import { BaseRepository } from './BaseRepository'
import modeOfTransportData from '~/data/mode-of-transport.json'

export class ModeOfTransportRepository extends BaseRepository<IModeOfTransportItem> {
  protected async loadSource(): Promise<IModeOfTransportItem[]> {
    return (modeOfTransportData as IModeOfTransportItem[]).map((x) => ({ ...x }))
  }
}
