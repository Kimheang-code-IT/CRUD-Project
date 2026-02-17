import type { IEntity } from './IEntity'

export interface IHsCodeItem extends IEntity {
  period: string
  hsCode: string
  hsDescription: string
  value: number
}
