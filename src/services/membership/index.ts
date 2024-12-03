import { AxiosRequestConfig, CancelToken } from "axios";
import { api } from "../../lib/axios";
import {
  IMembershipPackage,
  IMembershipPackageDetail,
  IPaymentPackage,
  ISubmissionPackage,
  IVoucher,
} from "../../lib/definition";

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
      console.log(query, "query");
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
      console.log(data);
      return {
        data: data.result as IMembershipPackageDetail,
      };
    })
    .catch((err: any) => {
      console.error("error fetch membership package detail");
      throw new Error(err.response?.data.message);
    });
};

const checkVoucher = async (voucher_code: string, package_id: number) => {
  console.log(voucher_code, "voucher_code");
  return api
    .post("/voucher", {
      voucher_code: voucher_code,
      package_id: package_id,
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
  down_payment_membership: 0 | 1,
  started_at: string,
) => {
  return api
    .post("/membership/buy", {
      sales_id: sales_id,
      membership_id: membership_id,
      payment_method: payment_method,
      signature: signature,
      voucher_code: voucher_code === "" ? null : voucher_code,
      down_payment_membership: down_payment_membership,
      started_at: started_at,
    })
    .then(({ data }) => {
      return {
        data: data,
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
