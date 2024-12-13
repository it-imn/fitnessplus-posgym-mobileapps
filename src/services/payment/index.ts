import { api } from "../../lib/axios";
import { IPaymentSummary } from "../../lib/definition";

export async function fetchPaymentSummary(req: {
  membership_id: number;
  sales_id: number;
  payment_method: string;
  voucher_code: string | null;
  down_payment_membership: boolean;
}) {
  return api
    .post("/member/payment/summary", req)
    .then(({ data }) => {
      console.log(data, "data");
      return {
        data: data.data as IPaymentSummary,
      };
    })
    .catch((err: any) => {
      console.error("error fetch payment summary", err.response?.data);
      throw new Error(err.response?.data.message);
    });
}

export async function fetchPaymentSummaryPt(req: {
  package_personal_trainer_id: number;
  sales_id: number;
  payment_method: string;
  voucher_code: string | null;
  down_payment: boolean;
}) {
  return api
    .post("/member/payment/summaryPt", req)
    .then(({ data }) => {
      console.log(data, "data");
      return {
        data: data.data as IPaymentSummary,
      };
    })
    .catch((err: any) => {
      console.error("error fetch payment summary pt", err.response?.data);
      throw new Error(err.response?.data.message);
    });
}
