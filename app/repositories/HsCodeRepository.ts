import type { IHsCodeItem } from '~/types/entities'
import { BaseRepository } from './BaseRepository'
import hsCodeData from '~/data/hs-code.json'

export class HsCodeRepository extends BaseRepository<IHsCodeItem> {
  protected async loadSource(): Promise<IHsCodeItem[]> {
    return (hsCodeData as IHsCodeItem[]).map((x) => ({ ...x }))
  }
}
