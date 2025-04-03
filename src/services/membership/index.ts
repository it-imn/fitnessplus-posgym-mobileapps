import { AxiosRequestConfig } from "axios";
import { api } from "../../lib/axios";
import {
  IMembershipPackage,
  IPaymentPackage,
  IPaymentResult,
  ISubmissionPackage,
  IVoucher,
} from "../../lib/definition";
import { Image } from "react-native-compressor";

const fetchContractAgreement = async () => {
  return api
    .get("/membership/contract")
    .then(({ data }) => {
      return {
        data: data.result,
      };
    })
    .catch((err: any) => {
      console.error("error fetch contract agreement");
      throw new Error(err.response?.data.message);
    });
};

const fetchContractAgreementView = async () => {
  return api
    .get("/membership/contract/pdf")
    .then(({ data }) => {
      return {
        data: data.result,
      };
    })
    .catch((err: any) => {
      console.error("error fetch contract agreement view");
      throw new Error(err.response?.data.message);
    });
};

const fetchContractAgreementDownload = async () => {
  return api
    .get("/membership/contract/download")
    .then(({ data }) => {
      return {
        data: data.result,
      };
    })
    .catch((err: any) => {
      console.error("error fetch contract agreement download");
      throw new Error(err.response?.data.message);
    });
};

const fetchMembershipPackages = async (
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
      `/membership/package?page=${page}${
        query?.search ? `&search=${query.search}` : ""
      }`,
      config,
    )
    .then(({ data }) => {
      console.log(data.result[0], "data");
      return {
        data: data.result as IMembershipPackage[],
        hasNext: data.hasNext,
      };
    })
    .catch((err: any) => {
      console.error("error fetch membership packages");
      throw new Error(err.response?.data.message);
    });
};

const fetchMembershipPackageDetail = async (id: number) => {
  return api
    .get(`/membership/package/${id}`)
    .then(({ data }) => {
      console.log(data, "data");
      return {
        data: data.result as IMembershipPackage,
      };
    })
    .catch((err: any) => {
      console.error("error fetch membership package detail");
      throw new Error(err.response?.data.message);
    });
};

const checkVoucher = async (
  voucher_code: string,
  package_id: number,
  sales_id: number,
) => {
  console.log(voucher_code, "voucher_code");
  console.log(package_id, "package_id");
  return api
    .post("/voucher", {
      voucher_code: voucher_code,
      package_id: package_id,
      sales_id: sales_id,
    })
    .then(({ data }) => {
      console.log(data);
      return {
        data: data.result as IVoucher,
      };
    })
    .catch((err: any) => {
      console.error("error check voucher", err.response?.data);
      throw new Error(err.response?.data.message);
    });
};

const buyMembership = async (
  sales_id: number,
  membership_id: number,
  payment_method: string,
  signature: string,
  voucher_code: string | null,
  down_payment_membership: boolean,
  started_at: string,
  payment_proof?: string[],
) => {
  const formData = new FormData();
  formData.append("sales_id", sales_id.toString());
  formData.append("membership_id", membership_id.toString());
  formData.append("payment_method", payment_method);
  formData.append("signature", signature);
  if (voucher_code) {
    formData.append("voucher_code", voucher_code);
  }
  formData.append(
    "down_payment_membership",
    down_payment_membership.toString(),
  );
  formData.append("started_at", started_at);
  if (payment_proof) {
    for (const image of payment_proof) {
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
    .post("/membership/buy", formData)
    .then(({ data }) => {
      console.log(data);
      return {
        message: data.message,
        data: data.data as IPaymentResult,
      };
    })
    .catch((err: any) => {
      console.error("error buy membership", err.response?.data);
      throw new Error(err.response?.data.message);
    });
};

const fetchSubmissionPackages = async (
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
      `/submission_package?page=${page}${
        query?.search ? `&search=${query.search}` : ""
      }`,
      config,
    )
    .then(({ data }) => {
      console.log(data, "data");
      return {
        data: data.result as ISubmissionPackage[],
        hasNext: data.hasNext,
      };
    })
    .catch(err => {
      console.error("error fetch history transactions");
      throw new Error(err.response?.data.message);
    });
};

const fetchSubmissionPackage = async (
  id: number,
  config?: AxiosRequestConfig<any> | undefined,
) => {
  return api
    .get(`/submission_package/${id}`, config)
    .then(({ data }) => {
      console.log(data);
      return {
        data: data.result as ISubmissionPackage,
        member: data.member as {
          id: number;
          name: string;
        },
      };
    })
    .catch(err => {
      console.error("error fetch history transactions");
      throw new Error(err.response?.data.message);
    });
};

const fetchPaymentPackages = async (
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
      `/member/payment?page=${page}${
        query?.search ? `&search=${query.search}` : ""
      }`,
      config,
    )
    .then(({ data }) => {
      console.log(data.result[0], "data");
      return {
        data: data.result as IPaymentPackage[],
        hasNext: data.hasNext,
      };
    })
    .catch(err => {
      console.error("error fetch history transactions");
      throw new Error(err.response?.data.message);
    });
};

const fetchPaymentPackage = async (
  id: number,
  config?: AxiosRequestConfig<any> | undefined,
) => {
  return api
    .get(`/member/payment/${id}`, config)
    .then(({ data }) => {
      console.log(data);
      return {
        data: data.result as IPaymentPackage,
      };
    })
    .catch(err => {
      console.error("error fetch history transactions");
      throw new Error(err.response?.data.message);
    });
};

export {
  fetchContractAgreement,
  fetchContractAgreementView,
  fetchContractAgreementDownload,
  fetchMembershipPackages,
  fetchMembershipPackageDetail,
  fetchPaymentPackages,
  fetchPaymentPackage,
  checkVoucher,
  buyMembership,
  fetchSubmissionPackages,
  fetchSubmissionPackage,
};
