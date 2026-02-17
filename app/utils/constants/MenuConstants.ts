/**
 * Menu route DTO and constants (OOP - value object / constants class).
 */
export interface IMenuRoute {
  readonly title: string
  readonly titleKey: string
  readonly to: string
  readonly icon: string
}

export class MenuConstants {
  static readonly LOCAL_STORAGE_KEY = 'user_config'

  static readonly ROUTES: IMenuRoute[] = [
    { title: 'Dashboard', titleKey: 'common.menu.dashboard', to: '/dashboard', icon: 'mdi-view-dashboard' },
    { title: 'Total Trade', titleKey: 'common.menu.totalTrade', to: '/total-trade', icon: 'mdi-chart-bar' },
    { title: 'HS Code', titleKey: 'common.menu.hsCode', to: '/by-hs-code', icon: 'mdi-barcode' },
    { title: 'SITC', titleKey: 'common.menu.sitc', to: '/by-sitc', icon: 'mdi-package-variant' },
    { title: 'Mode of Transport', titleKey: 'common.menu.modeOfTransport', to: '/by-mode-of-transport', icon: 'mdi-ship-wheel' },
    { title: 'Partner Country', titleKey: 'common.menu.partnerCountry', to: '/by-partner-country', icon: 'mdi-handshake' },
  ]
}
