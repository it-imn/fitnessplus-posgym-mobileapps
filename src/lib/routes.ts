export type TabParamList = {
  Home: undefined;
  Profil: undefined;
  History: undefined;
  Report: undefined;
  MyQRCode: undefined;
};

export type RootStackParamList = {
  LoginPage: undefined;
  MainApp: undefined;
  ScanQRExistingTrial: { type?: string };
  SignUp: undefined;
  ForgotPassword: undefined;
  Starter: undefined;
  SplashScreen: undefined;
  Onboarding: undefined;
  SelectGym: undefined;
  SelectBranch: undefined;
  TermCondition: undefined;
  SignExisting: {
    gym_name: string;
    branch_name: string;
    branch_id: string;
  };
  SignTrial: {
    gym_name: string;
    branch_name: string;
    branch_id: string;
  };
  SignConfirmation: undefined;
  Verification: {
    token: string;
  };
  VerificationSuccess: undefined;
  EditProfil: undefined;
  RatingView: {
    branch_id: number;
  };
  AddReview: {
    branch_id: number;
  };
  BioUser: undefined;
  UserSpec: {
    jenisKelamin: number;
    address: string;
    u_id: string;
    sim: string;
    passport: string;
    birthdate: string;
    card: any;
    picture: any;

    selected: string;
  };
  Setting: {
    email_verified: string;
  };
  DetailBioUser: undefined;
  DeleteAccount: undefined;
  EditPassword: {
    username: string;
  };
  MembershipAgreement: undefined;
  PackagePTAgreement: undefined;
  Class: undefined;
  DetailClass: {
    id: number;
  };
  BookingSuccess: undefined;
  ClassHistory: undefined;
  DetailPT: {
    id: number;
  };
  Membership: undefined;
  MembershipDetail: {
    id: number;
  };
  Agreement: undefined;
  Checkin: undefined;
  Loaning: {
    code: string;
  };
  Returning: {
    code: string;
  };
  ListPT: undefined;
  Voucher: undefined;
  WillTransaction: undefined;
  PaymentMethod: undefined;
  WillTransactionCash: undefined;
  PackageTrainer: {
    id: number;
  };
  DetailPackageTrainer: {
    id: number;
    pt_id: number;
  };
  Notification: undefined;
  SignUpSuccess: undefined;
  Selfie: undefined;
  SubmissionPackage: undefined;
  InstallmentPackage: undefined;
  DetailInstallmentPackage: {
    id: number;
  };
  WOG: undefined;
  PaymentPackage: undefined;
  RequestLogout: undefined;
  DetailPaymentPackage: {
    id: number;
    afterPayment?: boolean;
  };
  DetailSubmissionPackage: {
    id: number;
  };
  Payment: undefined;
  PaymentInstallment: {
    id: number;
  };
  PaymentGateway: {
    id: number;
    url: string;
  };
  ChooseSeat: {
    id: number;
    standard_class_id: number;
  };
  ListSchedule: undefined;
  DetailClassSchedule: {
    id: number;
  };
  DetailPTSchedule: {
    id: number;
  };
  CheckinClass: {
    seat_id: number;
    type: "pt" | "class";
  };
  DetailNews: {
    id: number;
  };
};
