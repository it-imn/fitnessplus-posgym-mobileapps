import { AxiosRequestConfig } from "axios";
import { api } from "../../lib/axios";
import {
  IDetailScheduleActivity,
  IScheduleActivity,
} from "../../lib/definition";

export const fetchListSchedules = async (
  type: "all" | "class" | "pt",
  query?: {
    page?: number;
  },
  config?: AxiosRequestConfig<any> | undefined,
) => {
  const page = query?.page ?? 1;

  return api
    .get(`/member/schedule?type=${type}&page=${page}`, config)
    .then(({ data }) => {
      console.log(data);
      return {
        data: data.result as IScheduleActivity[],
        hasNext: data.hasNext,
      };
    })
    .catch(err => {
      console.error("error fetch list schedules");
      throw new Error(err.response?.data.message);
    });
};

export const fetchDetailSchedule = async (type: "class" | "pt", id: number) => {
  return api
    .get(`/member/schedule/${id}/${type}`)
    .then(({ data }) => {
      console.log(data);
      return { data: data.result as IDetailScheduleActivity };
    })
    .catch(err => {
      console.error("error fetch detail schedule");
      throw new Error(err.response?.data.message);
    });
};

export const checkInSchedule = async (qr_code: string, seat_id: number) => {
  return api
    .post("/member/seat/scan", { qr_code, seat_id })
    .then(({ data }) => {
      console.log(data);
      return {
        message: data.message,
      };
    })
    .catch(err => {
      console.error("error check in schedule", err.response?.data.message);
      throw new Error(err.response?.data.message);
    });
};
