import { CancelToken } from "axios";
import { api } from "../../lib/axios";
import { IPersonalTrainer, IPTPackage } from "../../lib/definition";

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
  token?: CancelToken,
  query?: string,
) => {
  return api
    .get(`/personal_trainer?search=${query}`, {
      cancelToken: token,
    })
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

const fetchPersonalTrainerPackage = async (id: number) => {
  return api
    .get(`/personal_trainer/${id}/package`)
    .then(({ data }) => {
      console.log(data.result, "package");
      return {
        data: data.result as IPTPackage[],
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
  signature: string,
  voucher_code: string | null,
  down_payment_membership: 1 | 0,
) => {
  console.log({
    package_personal_trainer_id: package_pt_id,
    personal_trainer_id: pt_id,
    payment_method: "cash",
    voucher_code: voucher_code === "" ? null : voucher_code,
    down_payment_membership: down_payment_membership === 1,
  });
  return api
    .post("/personal_trainer/package/buy", {
      package_personal_trainer_id: package_pt_id,
      personal_trainer_id: pt_id,
      payment_method: "cash",
      voucher_code: voucher_code === "" ? null : voucher_code,
      down_payment_membership: down_payment_membership === 1 ? "true" : "else",
      signature: signature,
    })
    .then(({ data }) => {
      return {
        data: data,
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
