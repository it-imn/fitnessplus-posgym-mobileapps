import { AxiosRequestConfig } from "axios";
import { api } from "../../lib/axios";
import {
  IInstallmentMembership,
  IDetailInstallmentMembership,
  IPaymentResult,
} from "../../lib/definition";
import { Image } from "react-native-compressor";

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

const payInstallment = async (req: {
  payment_id: number;
  installment_id: number[];
  payment_method: string;
  total_pay: number;
  payment_proof?: string[];
}) => {
  const formData = new FormData();
  formData.append("payment_id", req.payment_id.toString());
  formData.append("installment_id", req.installment_id.toString());
  formData.append("payment_method", req.payment_method);
  formData.append("total_pay", req.total_pay.toString());
  if (req.payment_proof) {
    for (const image of req.payment_proof) {
      if (!image.startsWith("http://") && !image.startsWith("https://")) {
        const compressed = await Image.compress(
          image.startsWith("file://") ? image : `file://${image}`,
          {
            quality: 0.1,
            compressionMethod: "auto",
          },
        );

        formData.append(`payment_proof[]`, {
          uri: compressed,
          name: image,
          type: "image/jpeg",
        });
      }
    }
  }

  return api
    .post(`/member/installment/pay`, formData)
    .then(({ data }) => {
      console.log(data, "pay");
      return {
        message: data.message,
        data: data.response as IPaymentResult,
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

export {
  fetchInstallmentsMembership,
  fetchInstallmentMembership,
  payInstallment,
};
