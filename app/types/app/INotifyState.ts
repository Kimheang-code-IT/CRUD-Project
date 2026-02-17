export type NotifyType = 'success' | 'error' | 'warning' | 'info' | null

export interface INotifyState {
  show: boolean
  type: NotifyType
  icon: string | null
  text: string | null
  timeout: number
}
