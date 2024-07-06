import { IAdminModule } from "./IAdminModule";
import { IAdminPlan } from "./IAdminPlan";
import { IDefault } from "./IDefault";
import IFile from "./IFile";

export interface ISignature extends IDefault {
  plan: string | IAdminPlan,
  period: SignaturePlainPeriod,
  expireDate: Date,
  value: number,
  cardHolderName: string,
  cardToken: string,
  acquirerId: string,
  installments: number,
  status: SignatureStatus,
  payments: ISignaturePayment[]
  modules: string[] | IAdminModule[]
  modulesAddons: string[] | IAdminModule[]
}

export enum SignaturePlainPeriod {
  "ANNUAL" = "ANNUAL",
  "MONTHLY" = "MONTHLY"
}

export enum SignaturePlainPeriodTranslate {
  "ANNUAL" = "Anual",
  "MONTHLY" = "Mensal"
}

export enum SignatureStatus {
  "STARTED" = "STARTED", // A primeira recorrência da assinatura foi gerada, mas ele ainda não foi confirmado
  "ACTIVE" = "ACTIVE", // O pagamento da última recorrência está em dia e a assinatura ainda dentro do período de duração
  "LATED" = "LATED", // O pagamento da última recorrência está atrasado e a assinatura ainda está no período vigente
  "INACTIVE" = "INACTIVE", // A primeira recorrência não teve pagamento confirmado/aprovado
  "EXPIRED" = "EXPIRED", // Acabou o período de duração da assinatura
  "CANCELED" = "CANCELED" // A assinatura foi cancelada
}

export enum SignatureStatusTranslate {
  "STARTED" = "Aguardando primeiro pagamento", // A primeira recorrência da assinatura foi gerada, mas ele ainda não foi confirmado
  "ACTIVE" = "Ativo", // O pagamento da última recorrência está em dia e a assinatura ainda dentro do período de duração
  "LATED" = "Atrasado", // O pagamento da última recorrência está atrasado e a assinatura ainda está no período vigente
  "INACTIVE" = "Inativo", // A primeira recorrência não teve pagamento confirmado/aprovado
  "EXPIRED" = "Expirado", // Acabou o período de duração da assinatura
  "CANCELED" = "Cancelado" // A assinatura foi cancelada
}

export interface ISignaturePayment {
  _id: string
  status: PaymentStatusEnum;
  installments: number;
  paymentMethod: PaymentMethodEnum;
  cardNumber: string;
  dueDate: Date;
  paymentDate: Date;
  value: number;
  chargeId: string,
  nsu: string,
  authorizationCode: string,
  cardHolderName: string,
  billet: IFile
}

export enum PaymentStatusEnum {
  "PENDING" = "PENDING",
  "PROCESSING" = "PROCESSING",
  "CONFIRMED" = "CONFIRMED",
  "REFUSED" = "REFUSED",
  "CANCELLED" = "CANCELLED",
}

export enum PaymentStatusEnumTranslate {
  "PENDING" = "Aguardando pagamento",
  "PROCESSING" = "Em processamento",
  "CONFIRMED" = "Pago",
  "REFUSED" = "Recusado",
  "CANCELLED" = "Cancelado",
}

export enum PaymentMethodEnum {
  "CASH" = "CASH",
  "CREDIT_CARD" = "CREDIT_CARD",
  "DEBIT_CARD" = "DEBIT_CARD",
  "PIX" = "PIX",
  "CREDIT" = "CREDIT",
  "PAYMENT_SLIP" = "PAYMENT_SLIP",
  "BANK_TRANSFER" = "BANK_TRANSFER",
  "DUPLICATE" = "DUPLICATE",
}