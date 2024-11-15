import {create} from 'zustand';

export type SignUpReq = {
  name: string;
  gender: 'male' | 'female' | 'rather_not_say';
  email: string;
  phone: string;
  address: string;
  birthDate: Date;
  username: string;
  password: string;
  gym_id: number;
  gym_name: string;
  branch_id: number;
  branch_name: string;
  term: boolean;
  image: string;
};

type SignUpReqState = {
  signUpReq: SignUpReq;
  update: (newState: Partial<SignUpReq>) => void;
  reset: () => void;
};

const initialState: SignUpReq = {
  name: '',
  gender: 'rather_not_say',
  email: '',
  phone: '',
  address: '',
  birthDate: new Date(),
  username: '',
  password: '',
  gym_id: 0,
  gym_name: '',
  branch_id: 0,
  branch_name: '',
  term: false,
  image: '',
};

export const useSignUpStore = create<SignUpReqState>(set => ({
  signUpReq: initialState,
  update: (newState: Partial<SignUpReqState>) =>
    set(state => {
      //   console.log('state', state);
      return {
        signUpReq: {
          ...state.signUpReq,
          ...newState,
        },
      };
    }),
  reset: () => set({signUpReq: initialState}),
}));
