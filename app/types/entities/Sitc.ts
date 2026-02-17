import type { IEntity } from './IEntity'

export interface ISitcItem extends IEntity {
  period: string
  sitcCode: string
  sitcDescription: string
  value: number
}
