import type { IEntity } from './IEntity'

export interface IPartnerCountryItem extends IEntity {
  period: string
  country: string
  value: number
}
