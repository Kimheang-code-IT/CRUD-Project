import type { IMenuState } from '~/types/app/IMenuState'
import { MenuConstants } from '~/utils/constants/MenuConstants'

/**
 * Application config persistence (OOP service).
 */
export class AppConfigService {
  static getUuid(): string | null {
    return localStorage.getItem('uuid')
  }

  static loadUserConfig(uuid: string): Partial<{ menu: Partial<IMenuState> }> | null {
    const raw = localStorage.getItem(MenuConstants.LOCAL_STORAGE_KEY) || '{}'
    const allConfigs: Record<string, { menu?: Partial<IMenuState> }> = JSON.parse(raw)
    return allConfigs[uuid] ?? null
  }

  static saveUserConfig(uuid: string, menu: IMenuState): void {
    const raw = localStorage.getItem(MenuConstants.LOCAL_STORAGE_KEY) || '{}'
    const allConfigs: Record<string, { menu: IMenuState }> = JSON.parse(raw)
    allConfigs[uuid] = { menu: { ...menu } }
    localStorage.setItem(MenuConstants.LOCAL_STORAGE_KEY, JSON.stringify(allConfigs))
  }
}
