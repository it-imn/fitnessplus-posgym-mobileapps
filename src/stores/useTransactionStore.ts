import { create } from "zustand";
import { IVoucher } from "../lib/definition";

export enum TransactionType {
  MEMBERSHIP = "membership",
  PT = "pt",
}
export interface UserReq {
  name: string;
  id: number;
  email: string;
}

export interface MembershipReq {
  sales_id: number;
  sales_name: string;
  sales_email: string;
  membership_id: number;
  down_payment_membership: 1 | 0;
  down_payment_label: string;
  startDate: Date;
}

export interface PTReq {
  package_id: number;
  package_pt_id: number;
  pt_id: number;
  down_payment_membership: 1 | 0;
  down_payment_label: string;
}

export interface TransactionReq {
  user: UserReq;
  type: TransactionType;
  transaction: MembershipReq | PTReq;
  signature: string;
  payment_method: string;
  voucher_code: string;
  voucher?: IVoucher;
  normal_price: number;
  final_price: number;
  name: string;
}

type TransactionState = {
  transaction: TransactionReq;
  update: (newState: Partial<TransactionReq>) => void;
  reset: () => void;
};

const initialState: TransactionReq = {
  user: {
    name: "",
    id: 0,
    email: "",
  },
  transaction: {
    sales_id: 0,
    sales_name: "",
    sales_email: "",
    membership_id: 0,
    down_payment_membership: 0,
    down_payment_label: "",
    startDate: new Date(),
  },
  type: TransactionType.MEMBERSHIP,
  payment_method: "",
  signature: "",
  voucher_code: "",
  voucher: undefined,
  normal_price: 0,
  final_price: 0,
  name: "",
};

export const useTransactionStore = create<TransactionState>(set => ({
  transaction: initialState,
  update: (newState: Partial<TransactionReq>) =>
    set(state => {
      console.log(newState, "newState");
      console.log(state, "state");
      return {
        transaction: {
          ...state.transaction,
          ...newState,
        },
      };
    }),
  reset: () => set({ transaction: initialState }),
}));
