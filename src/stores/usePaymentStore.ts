import { create } from "zustand";

export interface PaymentReq {
  // change on detail package
  packageName: string;
  normalPrice: number;
  totalPrice: number;
  signature: string;

  // payment page
  paymentType: 0 | 1; // 0 = Full Payment, 1 = Down Payment
  paymentMethod: "cash";

  // optional
  voucherCode?: string;
  voucherDiscount?: number;
  discountType?: "percent" | "value";
  discountPrice?: number;
  isDpAvailable?: boolean;
  firstPayment?: number;

  // Membership
  salesId?: number;
  salesName?: string;
  salesEmail?: string;
  startDate?: Date;
  expiredDate?: Date;
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
  normalPrice: 0,
  totalPrice: 0,
  paymentType: 0,
  paymentMethod: "cash",
  signature: "",
};

export const usePaymentStore = create<PaymentState>(set => ({
  payment: initialState,
  update: newState =>
    set(state => ({ payment: { ...state.payment, ...newState } })),
  reset: () => set({ payment: initialState }),
}));
