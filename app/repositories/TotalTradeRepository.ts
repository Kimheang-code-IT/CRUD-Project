import type { ITotalTradeItem } from '~/types/entities'
import { BaseRepository } from './BaseRepository'
// Data source: app/data/total-trade.json (used by total-trade.vue via useTotalTradeStore)
import totalTradeData from '~/data/total-trade.json'

export class TotalTradeRepository extends BaseRepository<ITotalTradeItem> {
  protected async loadSource(): Promise<ITotalTradeItem[]> {
    return (totalTradeData as ITotalTradeItem[]).map((x) => ({ ...x }))
  }
}
