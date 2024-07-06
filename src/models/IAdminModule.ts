import { IDefaultAdmin } from "./IDefault"

export interface IAdminModule extends IDefaultAdmin {
  name: string
  description: string
  roles: string[]
  annualValue: number
  monthlyValue: number
  isAddon: boolean
}