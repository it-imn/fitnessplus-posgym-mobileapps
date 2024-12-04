import { AxiosRequestConfig } from "axios";
import { api } from "../../lib/axios";
import { ICICO, IWOG } from "../../lib/definition";

const fetchWOGCount = async () => {
  return api
    .get("/staff/wog/count")
    .then(({ data }) => {
      return {
        data: data.result as IWOG,
      };
    })
    .catch(err => {
      console.error("error fetch count wog");
      throw new Error(err.response?.data.message);
    });
};

const fetchWOGSegment = async (
  query?: {
    role?: "member" | "instructure" | "trainer" | "operational" | "";
    page?: number;
  },
  config?: AxiosRequestConfig<any> | undefined,
) => {
  const page = query?.page ?? 1;

  return api
    .get(
      `/staff/wog/segment?page=${page}${
        query?.role || query?.role === "" ? `&role=${query.role}` : ""
      }`,
    )
    .then(({ data }) => {
      console.log(data);
      return {
        data: data.result as ICICO[],
        hasNext: data.hasNext,
      };
    })
    .catch(err => {
      console.error("error fetch count wog");
      throw new Error(err.response?.data.message);
    });
};

export { fetchWOGCount, fetchWOGSegment };
