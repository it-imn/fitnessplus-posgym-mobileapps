import { create } from "zustand";

export interface PaymentReq {
  // change on detail package
  packageName: string;
  normalPrice: number;
  totalPrice: number;
  signature: string;

  // payment page
  isDp: boolean;
  paymentMethod: "cash";

  // optional
  voucherCode?: string;
  voucherDiscount?: number;
  discountType?: "percent" | "value";
  discountPrice?: number;
  isDpAvailable?: boolean;
  firstPayment?: number;
  startDate: Date;
  expiredDate?: Date;

  // Membership
  salesId?: number;
  salesName?: string;
  salesEmail?: string;
  membershipId?: number;

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
  normalPrice: 0,
  totalPrice: 0,
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
