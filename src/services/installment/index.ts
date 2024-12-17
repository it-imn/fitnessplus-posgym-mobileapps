import { AxiosRequestConfig } from "axios";
import { api } from "../../lib/axios";
import {
  IInstallmentMembership,
  IDetailInstallmentMembership,
} from "../../lib/definition";

const fetchInstallmentsMembership = async (
  query?: {
    search?: string;
    page?: number;
    per_page?: number;
  },
  config?: AxiosRequestConfig<any> | undefined,
) => {
  const page = query?.page ?? 1;

  return api
    .get(
      `/member/installment?page=${page}${
        query?.search ? `&search=${query.search}` : ""
      }`,
      config,
    )
    .then(({ data }) => {
      console.log(data, "data");
      return {
        data: data.response as IInstallmentMembership[],
        hasNext: data.hasNext,
      };
    })
    .catch((err: any) => {
      console.error(
        "error fetch installment membership",
        err.response?.data.message,
      );
      throw new Error(err.response?.data.message);
    });
};

const fetchInstallmentMembership = async (id: number) => {
  return api
    .get(`/member/installment/${id}`)
    .then(({ data }) => {
      console.log(data, "data");
      return {
        data: data.response as IDetailInstallmentMembership[],
        bill: data.bill as number,
      };
    })
    .catch((err: any) => {
      console.error(
        "error fetch installment membership",
        err.response?.data.message,
      );
      throw new Error(err.response?.data.message);
    });
};

const payInstallment = async(req: {
  payment_id: number;
  installment_id: number[];
  payment_method: string;
  total_pay: number;
}) => {
  return api
    .post(`/member/installment/pay`, req)
    .then(({ data }) => {
      console.log(data, "pay");
      return {
        data: data.response as IDetailInstallmentMembership[],
        bill: data.bill as number,
      };
    })
    .catch((err: any) => {
      console.error(
        "error fetch installment membership",
        err.response?.data.message,
      );
      throw new Error(err.response?.data.message);
    });
}

export { fetchInstallmentsMembership, fetchInstallmentMembership, payInstallment };
