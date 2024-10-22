import {create} from 'zustand';

interface ModalStore {
  isOpen: boolean;
  openModal: (props: {children: React.ReactNode}) => void;
  children: React.ReactNode;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>(set => ({
  isOpen: false,
  openModal: ({children}) => {
    set({isOpen: true, children: children});
  },
  children: null,
  closeModal: () => set({isOpen: false}),
}));
