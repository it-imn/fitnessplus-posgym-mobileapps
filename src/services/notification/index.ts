import { AxiosRequestConfig } from "axios";
import { api } from "../../lib/axios";
import { INotification } from "../../lib/definition";

export const fetchNotifications = async (
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
      `/notification?page=${page}${
        query?.search ? `&search=${query.search}` : ""
      }`,
    )
    .then(({ data }) => {
      console.log(data);
      return {
        data: data.result as INotification[],
        hasNext: data.hasNext,
      };
    })
    .catch(err => {
      console.error("error fetch notifications");
      throw new Error(err.response?.data.message);
    });
};

export const readNotification = async (
  id: number,
  config?: AxiosRequestConfig<any> | undefined,
) => {
  return api
    .get(`/notification/read/${id}`, config)
    .then(({ data }) => {
      console.log(data);
      return {
        data: data.result as INotification,
      };
    })
    .catch(err => {
      console.error("error read notification");
      throw new Error(err.response?.data.message);
    });
};

export const refreshFCMToken = async (fcmToken: string) => {
  console.log('refresh fcm token')
  return api
    .post("/refresh-fcm-token", { fcm_token: fcmToken })
    .then(({ data }) => {
      console.log(data, 'refresh success')
      return {
        data: data,
      };
    })
    .catch(err => {
      console.error("error refresh fcm token", err.response?.data.message);
      throw new Error(err.response?.data.message);
    }).finally(()=> {
      console.log('refresh fcm token ended')
    })
};
