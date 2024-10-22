import { api } from "../../lib/axios";
import {
  IInstallmentMembership,
  IDetailInstallmentMembership,
} from "../../lib/definition";

const fetchInstallmentsMembership = async () => {
  return api
    .get("/member/installment")
    .then(({ data }) => {
      return {
        data: data.response as IInstallmentMembership[],
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

export { fetchInstallmentsMembership, fetchInstallmentMembership };
