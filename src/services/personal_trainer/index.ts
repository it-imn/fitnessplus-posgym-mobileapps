import { AxiosRequestConfig } from "axios";
import { api } from "../../lib/axios";
import {
  IPaymentResult,
  IPersonalTrainer,
  IPTPackage,
} from "../../lib/definition";
import { Image } from "react-native-compressor";

const fetchPersonalTrainers = async () => {
  return api
    .get("/personal_trainer")
    .then(({ data }) => {
      console.log(data);
      return {
        data: data.result as IPersonalTrainer[],
      };
    })
    .catch(err => {
      console.error("error fetch all personal trainers");
      throw new Error(err.response?.data.message);
    });
};

const fetchPersonalTrainersWithQuery = async (
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
      `/personal_trainer?page=${page}${
        query?.search ? `&search=${query.search}` : ""
      }`,
      config,
    )
    .then(({ data }) => {
      console.log(data);
      return {
        data: data.result as IPersonalTrainer[],
        hasNext: data.hasNext,
      };
    })
    .catch(err => {
      console.error("error fetch all personal trainers");
      throw new Error(err.response?.data.message);
    });
};

const fetchDetailPersonalTrainer = async (id: number) => {
  console.log("fetchDetailPersonalTrainer", id);
  return api
    .get(`/personal_trainer/${id}`)
    .then(({ data }) => {
      return {
        data: data.result[0],
      };
    })
    .catch(err => {
      throw new Error(err.response?.data.message);
    });
};

const fetchPersonalTrainerPackage = async (
  id: number,
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
      `/personal_trainer/${id}/package?page=${page}${
        query?.search ? `&search=${query.search}` : ""
      }`,
      config,
    )
    .then(({ data }) => {
      console.log(data.result, "package");
      return {
        data: data.result as IPTPackage[],
        hasNext: data.hasNext,
      };
    })
    .catch(err => {
      throw new Error(err.response?.data.message);
    });
};

const fetchPersonalTrainerDetailPackage = async (id: number) => {
  return api
    .get(`/personal_trainer/package/detail/${id}`)
    .then(({ data }) => {
      console.log(data, "package");
      return {
        data: data.result as IPTPackage,
      };
    })
    .catch(err => {
      console.error(
        "fetch personal trainer detail package",
        err.response?.data.message,
      );
      throw new Error(err.response?.data.message);
    });
};

const buyPersonalTrainerPackage = async (
  package_pt_id: number,
  pt_id: number,
  payment_method: string,
  signature: string,
  voucher_code: string | null,
  down_payment: boolean,
  started_at: string,
  payment_proof?: string[],
) => {
  const formData = new FormData();
  formData.append("package_personal_trainer_id", package_pt_id.toString());
  formData.append("personal_trainer_id", pt_id.toString());
  formData.append("payment_method", payment_method);
  if (voucher_code) {
    formData.append("voucher_code", voucher_code);
  }
  formData.append("down_payment", down_payment.toString());
  formData.append("signature", signature);
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
    .post("/personal_trainer/package/buy", formData)
    .then(({ data }) => {
      return {
        message: data.message,
        data: data.data as IPaymentResult,
      };
    })
    .catch(err => {
      console.error(err.response?.data.message);
      throw new Error(err.response?.data.message);
    });
};

const fetchContractAgreementView = async () => {
  return api
    .get("/personal_trainer/package/contract")
    .then(({ data }) => {
      return {
        data: data,
      };
    })
    .catch((err: any) => {
      console.error("error fetch contract agreement");
      throw new Error(err.response?.data.message);
    });
};

const fetchContractAgreementDownload = async () => {
  return api
    .get("/personal_trainer/package/contract/download")
    .then(({ data }) => {
      return {
        data: data,
      };
    })
    .catch((err: any) => {
      console.error("error fetch contract agreement download");
      throw new Error(err.response?.data.message);
    });
};

export {
  fetchPersonalTrainers,
  fetchPersonalTrainersWithQuery,
  fetchDetailPersonalTrainer,
  fetchPersonalTrainerPackage,
  fetchPersonalTrainerDetailPackage,
  fetchContractAgreementView,
  fetchContractAgreementDownload,
  buyPersonalTrainerPackage,
};
