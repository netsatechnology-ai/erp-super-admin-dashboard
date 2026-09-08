export type PaymentMethod = "Cash" | "Telebirr" | "Card (Visa)" | "Bank Transfer" | "Mobile Money";


export interface TransactionItem {
  id: string;
  invoiceNumber: string;
  ejNumber: string;
  timestamp: string;
  merchantName: string;
  tenantId: string;
  merchantCode: string;
  customerName: string;
  customerPhone: string;
  customerTin?: string;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  settlementStatus:
    | "FULLY SETTLED"
    | "VERIFIED WIRE"
    | "PENDING"
    | "SYNC TIMEOUT";
  paymentMethod: PaymentMethod;
  fiscalStatus: FiscalStatusType;
  hashOrAck: string;
}
export type FiscalStatusType =
  | "FISCALIZED / VERIFIED"
  | "SYNCED"
  | "PENDING"
  | "FAILED"
  | "FAILED MOR SYN";

