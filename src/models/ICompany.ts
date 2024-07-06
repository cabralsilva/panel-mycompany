import IFile from "./IFile"
import { ISignature } from "./ISignature"

export interface ICompany {
  _id: string
  name: string
  tradeName: string
  socialId: string,
  stateInscription: string,
  phone: string,
  whatsApp: string,
  email: string
  site: string
  typeOfTaxation: TypeOfTaxation
  digitalCertificate: IFile,
  passwordDigitalCertificate: string,
  salt: string,
  creationDate: Date,
  address: IAddress,
  logo: IFile,
  active: boolean,
  customerIdPagarme: string
  settings: ISettings
  createdAtDateTime?: Date
  updatedAtDateTime?: Date
  signatures: ISignature[]
}

export enum TypeOfTaxation {
  "SIMPLE" = "SIMPLE",
  "REAL_PROFIT" = "REAL_PROFIT",
  "PRESUMED_PROFIT" = "PRESUMED_PROFIT"
}

export interface IAddress {
  zipCode?: string,
  street?: string,
  number?: string,
  complement?: string,
  neighborhood?: string,
  city?: {
    id?: string,
    nome?: string,
    cod_ibge?: string,
    estado_id?: {
      id?: string,
      nome?: string
    }
  },
}

export interface ISettings {
  language_override?: string
  timezone?: string
  currency?: string
  dateFormat?: string
  enableNotificationChangeOnProduct?: boolean
  enableNotificationOnUpdate?: boolean
  enableDailyReports?: boolean
  secretKeyPagarme?: string
  posStoneIntegrated?: boolean
  paymentConditionDefault?: string
  paymentMethodDefault?: string
  codeSbaum?: string
  cscHomolog?: string
  cscIdHomolog?: string
  cscProduction?: string
  cscIdProduction?: string
  serieNFe: number,
  nextNumberNFe: number,
  serieNFCe: number,
  nextNumberNFCe: number,
  autoSequenceOfProducts: number,
  autoSequenceOfService: number
  autoSequenceOfCustomer: number
  autoSequenceOfCodeOfServicePacks: number
  environmentNFe: EnvironmentNFeEnum
  typeOfBarcode: TypeOfBarcode
  typeOfBarcodeBalanceData: TypeOfBarcodeBalanceData
}

export enum EnvironmentNFeEnum {
  "HOMOLOG" = 'HOMOLOG',
  "PRODUCTION" = 'PRODUCTION'
}

export enum TypeOfBarcode {
  "EAN13" = "EAN13",
  "EAN8" = "EAN8",
}

export enum TypeOfBarcodeBalanceData {
  "WEIGTH" = "WEIGTH",
  "PRICE" = "PRICE",
}