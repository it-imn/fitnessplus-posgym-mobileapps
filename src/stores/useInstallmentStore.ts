import { create } from "zustand";

export interface InstallmentReq {
  mambershipName: string;
  salesName: string;
  memberName: string;
  installmentIds: number[];
  total: number;
  paymentId: number;
  paymentMethod: "cash" | "non-cash";
  proofUris?: string[];
}

export interface InstallmentState {
  installment: InstallmentReq;
  update: (newState: Partial<InstallmentReq>) => void;
  reset: () => void;
}

const initialState: InstallmentReq = {
  mambershipName: "",
  salesName: "",
  total: 0,
  memberName: "",
  installmentIds: [],
  paymentId: 0,
  paymentMethod: "cash",
};

export const useInstallmentStore = create<InstallmentState>(set => ({
  installment: initialState,
  update: newState =>
    set(state => ({ installment: { ...state.installment, ...newState } })),
  reset: () => set({ installment: initialState }),
}));
