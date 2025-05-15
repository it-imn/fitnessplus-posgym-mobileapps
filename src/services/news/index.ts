import { AxiosRequestConfig } from "axios";
import { api } from "../../lib/axios";
import { INews } from "../../lib/definition";

export const fetchListNews = async (
  query?: { search: string; page?: number },
  config?: AxiosRequestConfig<any> | undefined,
) => {
  const page = query?.page ?? 1;

  return api
    .get(
      `/news?page=${page}${query?.search ? `&search=${query.search}` : ""}`,
      config,
    )
    .then(({ data }) => {
      console.log(data, "data news");
      return {
        data: data.result as INews[],
        hasNext: data.hasNext,
      };
    })
    .catch(err => {
      console.error("error fetch list news", err);
      throw new Error(err.response?.data.message);
    });
};

export const fetchDetailNews = async (id: number) => {
  return api
    .get(`/news/${id}`)
    .then(({ data }) => {
      console.log(data, "data detail news");
      return {
        data: data.result as INews,
      }
    })
    .catch(err => {
      console.error("error fetch detail news", err);
      throw new Error(err.response?.data.message);
    });
};