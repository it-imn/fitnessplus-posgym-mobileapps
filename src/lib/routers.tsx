import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { AnyTransfer } from "../pages/any-transfer/AnyTransferPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { OnBoarding } from "../pages/auth/OnboardingPage";
import SelectBranch from "../pages/auth/SelectBranchPage";
import SelectGym from "../pages/auth/SelectGymPage";
import Selfie from "../pages/auth/SelfiePage";
import { SignUp } from "../pages/auth/SignUpPage";
import { SignUpSuccess } from "../pages/auth/SignUpSuccessPage";
import { SplashScreen } from "../pages/auth/SplashScreenPage";
import { Starter } from "../pages/auth/StarterPage";
import TermCondition from "../pages/auth/TermConditionPage";
import { DetailInstallmentPackage } from "../pages/history/DetailInstallmentPackagePage";
import { InstallmentPackage } from "../pages/history/InstallmentPackagePage";
import { SubmissionPackage } from "../pages/history/SubmissionPackagePage";
import { BookingSuccess } from "../pages/home/BookingClassSuccessPage";
import Checkin from "../pages/home/CheckinPage";
import DetailClass from "../pages/home/DetailClassPage";
import DetailPackageTrainer from "../pages/home/DetailPackageTrainerPage";
import DetailPT from "../pages/home/DetailPTPage";
import { HomePage } from "../pages/home/HomePage";
import ListPT from "../pages/home/ListPTPage";
import Loaning from "../pages/home/LoaningPage";
import { MembershipDetail } from "../pages/home/MembershipDetailPage";
import { Notification } from "../pages/home/NotificationPage";
import PackageTrainer from "../pages/home/PackageTrainerPage";
import PaymentMethod from "../pages/home/PaymentMethodPage";
import Voucher from "../pages/home/VoucherPage";
import WillTransactionCash from "../pages/home/WillTransactionCashPage";
import { ClassHistory } from "../pages/profile/ClassHistoryPage";
import DeleteAccount from "../pages/profile/DeleteAccountPage";
import Setting from "../pages/profile/SettingPage";
import { RootStackParamList, TabParamList } from "./routes";
import { Report } from "../pages/report/ReportPage";
import { History } from "../pages/history/HistoryPage";
import Profil from "../pages/profile/ProfilPage";
import Membership from "../pages/home/MembershipPage";
import Class from "../pages/home/ListClassPage";
import { BottomNavbar } from "../components/BottomNavbar";
import Agreement from "../pages/home/AgreementPage";
import MembershipAgreement from "../pages/profile/MembershipAgreementPage";
import PackagePTAgreement from "../pages/profile/PackagePTAgreementPage";
import SignConfirmation from "../pages/auth/SignConfirmation";
import { WOG } from "../pages/home/WOGPage";
import { PaymentPackage } from "../pages/history/PaymentPackagePage";
import { RequestLogout } from "../pages/auth/RequestLogout";
import { DetailPaymentPackage } from "../pages/history/DetailPaymentPackagePage";
import { DetailSubmissionPackage } from "../pages/history/DetailSubmissionPackagePage";
import { Payment } from "../pages/home/PaymentPage";
import { PaymentInstallment } from "../pages/history/PaymentInstallmentPage";
import PaymentNonCash from "../pages/home/PaymentGateway";
import PaymentGateway from "../pages/home/PaymentGateway";
import { ForgotPassword } from "../pages/auth/ForgotPasswordPage";
import ChooseSeatPage from "../pages/home/ChooseSeatPage";
import ChooseSeat from "../pages/home/ChooseSeatPage";
import { ListSchedule } from "../pages/profile/ListSchedulePage";
import { DetailClassSchedule } from "../pages/profile/DetailClassSchedulePage";
import { DetailPTSchedule } from "../pages/profile/DetailPTSchedulePage";
import CheckinClass from "../pages/profile/CheckinClassPage";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home"
      tabBar={props => <BottomNavbar {...props} />}>
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Report" component={Report} />
      <Tab.Screen name="AnyTransfer" component={AnyTransfer} />
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Profil" component={Profil} />
    </Tab.Navigator>
  );
}

export const Router = () => {
  return (
    <Stack.Navigator
      initialRouteName="Starter"
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}>
      {/* <Stack.Screen name="EditProfil" component={EditProfil} /> */}
      <Stack.Screen name="Membership" component={Membership} />
      <Stack.Screen name="Checkin" component={Checkin} />
      <Stack.Screen name="Selfie" component={Selfie} />
      <Stack.Screen name="WOG" component={WOG} />
      <Stack.Screen name="PaymentPackage" component={PaymentPackage} />
      <Stack.Screen name="RequestLogout" component={RequestLogout} />
      <Stack.Screen
        name="DetailPaymentPackage"
        component={DetailPaymentPackage}
      />
      <Stack.Screen
        name="DetailSubmissionPackage"
        component={DetailSubmissionPackage}
      />
      <Stack.Screen name="Payment" component={Payment} />
      {/*
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Sign" component={Sign} />
      <Stack.Screen name="Consultation" component={Consultation} />
      <Stack.Screen name="Merchandise" component={Merchandise} />
      <Stack.Screen name="PTConsult" component={PTConsult} />
      <Stack.Screen name="CSconsult" component={CSconsult} />
      <Stack.Screen name="MerchandiseDetail" component={MerchandiseDetail} />
      */}
      <Stack.Screen
        name="DetailInstallmentPackage"
        component={DetailInstallmentPackage}
      />
      <Stack.Screen name="InstallmentPackage" component={InstallmentPackage} />
      <Stack.Screen name="SubmissionPackage" component={SubmissionPackage} />
      <Stack.Screen name="SignUpSuccess" component={SignUpSuccess} />
      {/* <Stack.Screen name="WillTransaction" component={WillTransaction} /> */}
      {/* <Stack.Screen name="AddReview" component={AddReview} />
      <Stack.Screen name="RatingView" component={RatingView} /> */}
      <Stack.Screen name="MainApp" component={MainApp} />
      {/* <Stack.Screen name="BioUser" component={BioUser} />
      <Stack.Screen name="EditPassword" component={EditPassword} /> */}
      <Stack.Screen name="Class" component={Class} />
      <Stack.Screen name="DetailClass" component={DetailClass} />
      <Stack.Screen name="SelectGym" component={SelectGym} />
      <Stack.Screen name="SelectBranch" component={SelectBranch} />
      <Stack.Screen name="BookingSuccess" component={BookingSuccess} />
      <Stack.Screen name="ClassHistory" component={ClassHistory} />
      <Stack.Screen name="MembershipDetail" component={MembershipDetail} />
      <Stack.Screen name="Agreement" component={Agreement} />
      <Stack.Screen name="PackagePTAgreement" component={PackagePTAgreement} />
      <Stack.Screen name="PaymentInstallment" component={PaymentInstallment} />
      <Stack.Screen name="PaymentGateway" component={PaymentGateway} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ChooseSeat" component={ChooseSeat} />
      <Stack.Screen name="ListSchedule" component={ListSchedule} />
      <Stack.Screen name="DetailClassSchedule" component={DetailClassSchedule} />
      <Stack.Screen name="DetailPTSchedule" component={DetailPTSchedule} />
      <Stack.Screen name="CheckinClass" component={CheckinClass} />
      {/*
      <Stack.Screen name="UserSpec" component={UserSpec} />
      <Stack.Screen name="BodyMass" component={BodyMass} />
      <Stack.Screen name="Invitation" component={Invitation} />
      <Stack.Screen name="Summary" component={Summary} />
      <Stack.Screen name="ExerciseDuration" component={ExerciseDuration} />
      <Stack.Screen name="PTSession" component={PTSession} />
      <Stack.Screen name="ClassSession" component={ClassSession} />
      <Stack.Screen name="FrequencyPage" component={FrequencyPage} />
      <Stack.Screen name="Schedule" component={Schedule} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="DetailHistory" component={DetailHistory} />
      <Stack.Screen name="WebViewPage" component={WebViewPage} />
      <Stack.Screen name="PersonalTrainer" component={PersonalTrainer} />
      <Stack.Screen name="Inventory" component={Inventory} />
      <Stack.Screen name="PreviewClass" component={PreviewClass} />
      <Stack.Screen name="PermitPage" component={PermitPage} />
      <Stack.Screen name="Chatting" component={Chatting} />
      <Stack.Screen name="ScanQR" component={ScanQR} />
      */}
      <Stack.Screen name="PackageTrainer" component={PackageTrainer} />
      <Stack.Screen name="Voucher" component={Voucher} />
      <Stack.Screen name="Loaning" component={Loaning} />
      <Stack.Screen name="ListPT" component={ListPT} />
      <Stack.Screen name="DetailPT" component={DetailPT} />
      {/* <Stack.Screen
        name="ScanQRExistingTrial"
        component={ScanQRExistingTrial}
      /> */}
      {/* <Stack.Screen name="DetailBioUser" component={DetailBioUser} /> */}
      <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
      <Stack.Screen name="SignConfirmation" component={SignConfirmation} />
      {/* <Stack.Screen name="ForgotPassword" component={ForgotPassword} /> */}
      {/* <Stack.Screen name="SignExisting" component={SignExisting} /> */}
      {/* <Stack.Screen name="SignTrial" component={SignTrial} /> */}
      {/* <Stack.Screen name="Verification" component={Verification} /> */}
      <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
      <Stack.Screen
        name="WillTransactionCash"
        component={WillTransactionCash}
      />
      <Stack.Screen name="Notification" component={Notification} />
      {/*
      <Stack.Screen name="ReportDetailPT" component={ReportDetailPT} />
      <Stack.Screen name="WaitingPage" component={WaitingPage} />
      <Stack.Screen
        name="WillTransactionDigitalPayment"
        component={WillTransactionDigitalPayment}
      />
      <Stack.Screen name="DigitalPayment" component={DigitalPayment} />
      <Stack.Screen
        name="WillTransactionCreditDebitCard"
        component={WillTransactionCreditDebitCard}
      />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen
        name="BodyCompositionHistory"
        component={BodyCompositionHistory}
      />
      <Stack.Screen name="ScanTransfer" component={ScanTransfer} />
      <Stack.Screen
        name="TransferConfirmation"
        component={TransferConfirmation}
      />
      <Stack.Screen name="BuyGetOne" component={BuyGetOne} />
      <Stack.Screen
      name="PreviewClassAfterScan"
      component={PreviewClassAfterScan}
      />
      <Stack.Screen
      name="PreviewClassStatusPermit"
      component={PreviewClassStatusPermit}
      />
      */}
      <Stack.Screen
        name="MembershipAgreement"
        component={MembershipAgreement}
      />
      <Stack.Screen name="Setting" component={Setting} />
      {/* <Stack.Screen
        name="VerificationSuccess"
        component={VerificationSuccess}
      /> */}
      <Stack.Screen name="Starter" component={Starter} />
      {/*
        <Stack.Screen name="QRPage" component={QRPage} />
        <Stack.Screen name="PackageTransfer" component={PackageTransfer} />
        <Stack.Screen name="WillTransfer" component={WillTransfer} />
        */}
      <Stack.Screen name="TermCondition" component={TermCondition} />
      {/* <Stack.Screen
        name="MembershipAgreementExisting"
        component={MembershipAgreementExisting}
      /> */}
      {/*
      <Stack.Screen name="ExistingPT" component={ExistingPT} />
      <Stack.Screen
        name="ExistingPTConfirmation"
        component={ExistingPTConfirmation}
      />
      <Stack.Screen name="InstallmentDetail" component={InstallmentDetail} />
      <Stack.Screen
        name="DigitalPaymentInstallment"
        component={DigitalPaymentInstallment}
      />
      */}
      <Stack.Screen
        name="DetailPackageTrainer"
        component={DetailPackageTrainer}
      />
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="LoginPage" component={LoginPage} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Onboarding" component={OnBoarding} />
      {/*
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="Submission" component={Submission} />
      <Stack.Screen name="Subscribe" component={SubscribePackage} />
      <Stack.Screen name="DetailInstallment" component={DetailInstallment} />
      <Stack.Screen name="WillTransactionPt" component={WillTransactionPt} />
      */}
    </Stack.Navigator>
  );
};
export default Router;
