import { AxiosRequestConfig } from "axios";
import { api } from "../../lib/axios";
import { IGym, IBranch } from "../../lib/definition";

const fetchGyms = async (
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
      `/gym/list?page=${page}${query?.search ? `&search=${query.search}` : ""}`,
      config,
    )
    .then(({ data }) => {
      return {
        data: data.result as IGym[],
        hasNext: data.hasNext,
      };
    })
    .catch(err => {
      console.error("error fetch gyms");
      throw new Error(err.response?.data.message);
    });
};

const fetchBranchesWithGym = async (
  gym_id: number,
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
      `/branch/list?gym_id=${gym_id}&page=${page}${
        query?.search ? `&search=${query.search}` : ""
      }`,
      config,
    )
    .then(({ data }) => {
      return {
        data: data.result as IBranch[],
        hasNext: data.hasNext,
      };
    })
    .catch(err => {
      console.error("error fetch gyms");
      throw new Error(err.response?.data.message);
    });
};

export { fetchGyms, fetchBranchesWithGym };
