import { create } from "zustand";

export interface InstallmentReq {
  mambershipName: string;
  salesName: string;
  memberName: string;
  installmentNumber: number;
  total: number;
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
  installmentNumber: 0,
};

export const useInstallmentStore = create<InstallmentState>(set => ({
  installment: initialState,
  update: newState =>
    set(state => ({ installment: { ...state.installment, ...newState } })),
  reset: () => set({ installment: initialState }),
}));
