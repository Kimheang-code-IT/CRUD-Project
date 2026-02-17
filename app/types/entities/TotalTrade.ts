import type { IEntity } from './IEntity'

export interface ITotalTradeItem extends IEntity {
  period: string
  domesticExport: number
  reExport: number
  totalExport: number
  totalImport: number
  totalTradeVolume: number
  balance: number
}
