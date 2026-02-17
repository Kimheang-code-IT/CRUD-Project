import type { IEntity } from './IEntity'

export interface IModeOfTransportItem extends IEntity {
  period: string
  description: string
  netWeight: number
  value: number
}
