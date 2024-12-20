export type User = {
  id: number;
  u_id: string;
  admin_id: number;
  member_id: string;
  id_card: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  role: Role;
  branch: Branch;
};

export type UserDetail = {
  id: number;
  u_id: string;
  admin_id: number;
  member_id: string;
  id_card: string;
  name: string;
  username: string;
  email: string;
  email_verified_at: string;
  email_status: string;
  phone: string;
  address: string;
  birthdate: string;
  gender: string;
  image?: string;
  sim?: string;
  passport?: string;
  storage_media?: string;
  default_thumbnail?: string;
  image_thumbnail?: string;
  image_error: string;
  role: Role;
  branch: Branch;
  membership: Membership;
  pt: PersonalTrainerPackage;
  visit_gym: VisitGym;
  notif_count: number;
};

export type Role = {
  id: number;
  name: string;
};

export type Branch = {
  id: number;
  code: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  image: string;
  image_thumbnail: string;
  device_id: string;
};

export type Membership = {
  id: number;
  membership_id: string;
  membership: string;
  payment_id: number;
  payment_order: string;
  sales_id: number;
  sales: string;
  started_at: string;
  expired_at: string;
  last_expired_at: string;
  expired_at_local: string;
  price: number;
  discount?: number;
  total_price: number;
  status: string;
  message: string;
  periode: string;
};

export type PersonalTrainerPackage = {
  id: number;
  membership_id: string;
  membership: string;
  payment_id: number;
  payment_order: string;
  sales_id: number;
  sales: string;
  started_at: string;
  expired_at: string;
  last_expired_at: string;
  expired_at_local: string;
  price: number;
  discount?: number;
  total_price: number;
  status: string;
  message: string;
  periode: string;
};

export type VisitGym = {
  check_in: string;
  check_out: string;
};

export type ClassStd = {
  id: number;
  branch_id: number;
  standard_class_id: number;
  class_name: string;
  desc?: string;
  price: string;
  image?: string;
  video_link?: string;
  manual_link?: string;
  day: string;
  date_class: string;
  date_class_local: string;
  opened_at_local: string;
  start_time_class: string;
  finish_time_class: string;
  quota: number;
  count_member?: number;
  leftover?: number;
  instructure_id: number;
  instructor_name: string;
  created_at: string;
};

export type ClassStdDetail = {
  id: number;
  standard_class_id: number;
  instructure_id: number;
  instructure_name: string;
  quota: number;
  count_member?: number;
  leftover?: number;
  schedule: string;
  date_class: string;
  start_time_class: string;
  finish_time_class: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  date_class_local: string;
  class_name: string;
  desc?: string;
  price: string;
  image: string;
  video_link?: string;
  manual_link?: string;
};

export type Schedule = {
  id: number;
  standard_class_id: number;
  instructure_id: number;
  instructure_name: string;
  quota: number;
  count_member?: number;
  schedule: string;
  date_class: string;
  start_time_class: string;
  finish_time_class: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
};

export interface IClassHistory {
  id: number;
  instructure_name: string;
  qty: number;
  day: string;
  class_name: string;
  schedule_id: number;
  date_class: string;
  start_time_class: string;
  finish_time_class: string;
  type: string;
  user_id: number;
  created_at: string;
  image: string;
}

export type Token = string;

export const ThemeType = {
  light: "light",
  dark: "dark",
};

export type Theme = keyof typeof ThemeType;

export interface IPersonalTrainer {
  age: string;
  gender: string;
  image: string;
  name: string;
  id: number;
  phone: string;
  specification: string;
  total_package: number;
  user_id: number;
}

export interface IMembershipPackage {
  id: number;
  name: string;
  periode: string;
  periode_number: number;
  desc?: string;
  price: number;
  total_price: number;
  down_payment_membership: number | boolean;
  dp_discount: string | number;
  discount: string | number;
  installment: number;
  image: string;
  created_at: string;
  installment_first_pay: InstallmentFirstPay;
}

export interface InstallmentFirstPay {
  installment_number: number;
  due_date: string;
  due_date_ymd: string;
  total_price: number;
}

export interface IPackageInstallment {
  dp_percentage: number;
  dp_fixed_price: number;
  plan: any[];
}

export interface ISales {
  branch_name: string;
  default_thumbnail: string;
  email: string;
  id: number;
  image_thumbnail: string;
  name: string;
  storage_media: string;
}

export interface IFacility {
  admin_id: number;
  branch_id: number;
  created_at: string;
  facilities_name: string;
  id: number;
  image?: string;
  inventory_id: number;
  stock: number;
  updated_at: string;
}

export interface IVoucher {
  id: number;
  package_id?: number;
  package?: string;
  total_package?: number;
  code: string;
  name: string;
  type: string;
  discount: number;
  total_price?: number;
  expired_at: string;
}

export interface IPTPackage {
  base_price: number;
  discount: number;
  down_payment: boolean;
  image: string;
  dp_discount: number;
  dp_price_disc: number;
  dp_total: number;
  due_date?: string;
  id: number;
  installment_count?: number;
  package_name: string;
  period: string;
  period_number: number;
  personal_trainer_id: number;
  price_disc: number;
  session: number;
  tax: number;
  total: number;
  type?: string;
  installment_first_pay: InstallmentFirstPay;
  package_personal_trainer_id: number;
}

export interface IGym {
  id: number;
  name_gym: string;
  image: string;
  created_at: string;
}

export interface IBranch {
  id: number;
  gym_id: number;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  image: string;
  created_at: string;
  device_id: string;
}

export interface IInstallmentMembership {
  due_date: string;
  expired_at: string;
  id: number;
  next_bill: number;
  order_code: string;
  package_name: string;
  package_table: string;
  payment_id: number;
  payment_type: string;
  installment_number: number;
  total: number;
}

export interface IDetailInstallmentMembership {
  due_date: string;
  due_date_day: number;
  id: number;
  installment_number: number;
  is_pay: boolean;
  is_reminder: boolean;
  month: string;
  order_code: string;
  payment_id: number;
  status: string;
  total: number;
  membership_name: string;
  member_name: string;
  sales_name: string;
}

export interface IWOG {
  id: number;
  branch: string;
  date: string;
  count_sales: number;
  count_operational: number;
  count_instructor: number;
  count_personal_trainer: number;
  count_member: number;
}

export interface ICICO {
  checkinTime: string;
  checkinImage: string;
  checkoutTime: string;
  checkoutImage: string;
  id: number;
  status: string;
  image: string;
  name: string;
}

export interface ICICO {
  checkinTime: string;
  checkin_image_thubmnail: string;
  checkoutTime: string;
  checkout_image_thubmnail: string;
  id: number;
  status: string;
  user: ICICOUser;
}

export interface ICICOUser {
  default_thumbnail: string;
  id: number;
  image: string;
  image_thumbnail: string;
  name: string;
}

export interface ISubmissionPackage {
  id: number;
  membership: string;
  package_id: number;
  package_table: string;
  payment_date: string;
  payment_id: number;
  payment_method: string;
  payment_order_code: string;
  period: number;
  price: number;
  remaining_expired: number;
  remaining_expired_message: string;
  sales_id: number;
  sales_name: number;
  started_at: string;
  status: string;
  total_price: number;
  user_id: number;
  // voucher_id:
  expired_at: string;
  discount: number;
  created_at: string;
}

export interface IPaymentPackage {
  created_at: string;
  id: number;
  discount: number;
  member: string;
  member_profile: string;
  membership: string;
  order_code: string;
  package: string;
  payment_date: string;
  payment_method: string;
  status: string;
  total_price: number;
  receipt?: string;
  payment_url?: string;
}

export interface INotification {
  id: number;
  has_detail: boolean;
  user_name: string;
  user_image: string;
  notifiable_type: string;
  notifiable_id: number;
  message: string;
  created_at: string;
}

export interface IPaymentSummary {
  sub_total: number;
  discount: number;
  voucher_id?: number;
  voucher: number;
  total_pay: number;
}

export interface IPaymentResult {
  id: number;
  payment_url?: string;
}
