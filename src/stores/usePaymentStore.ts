import { create } from "zustand";

export interface PaymentReq {
  // change on detail package
  packageName: string;
  packagePrice: number;
  signature: string;

  // payment page
  isDp: boolean;
  paymentMethod: "cash" | "non-cash";

  // optional
  voucherCode?: string;
  startDate: Date;
  expiredDate?: Date;

  // Membership
  salesId?: number;
  salesName?: string;
  salesEmail?: string;
  membershipId?: number;
  isDpAvailable?: boolean;

  // PT
  packageId?: number;
  packagePTId?: number;
  ptId?: number;
}

export interface PaymentState {
  payment: PaymentReq;
  update: (newState: Partial<PaymentReq>) => void;
  reset: () => void;
}

const initialState: PaymentReq = {
  packageName: "",
  startDate: new Date(),
  packagePrice: 0,
  isDp: false,
  paymentMethod: "cash",
  signature: "",
};

export const usePaymentStore = create<PaymentState>(set => ({
  payment: initialState,
  update: newState =>
    set(state => ({ payment: { ...state.payment, ...newState } })),
  reset: () => set({ payment: initialState }),
}));
