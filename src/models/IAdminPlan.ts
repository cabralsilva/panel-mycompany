
import { IAdminModule } from './IAdminModule'
import { ICompany } from "./ICompany"
import { IDefaultAdmin } from "./IDefault"

export interface IAdminPlan extends IDefaultAdmin {
  name: string,
  description: string,
  annualValue: number,
  monthlyValue: number,
  isTrial: boolean,
  modules: string[] | IAdminModule[]
  companiesEllegibles: string[] | ICompany[]
}