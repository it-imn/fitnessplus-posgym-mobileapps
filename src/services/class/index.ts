import { AxiosRequestConfig, CancelToken } from "axios";
import { api } from "../../lib/axios";
import { ClassStd, ClassStdDetail, IClassHistory } from "../../lib/definition";

const fetchAllClasses = async (
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
      `/get_std_class/branch?page=${page}${
        query?.search ? `&search=${query.search}` : ""
      }`,
      config,
    )
    .then(({ data }) => {
      return {
        data: data.result as ClassStd[],
        hasNext: data.hasNext,
      };
    })
    .catch(err => {
      console.error("error fetch all classes");
      throw new Error(err.response?.data.message);
    });
};

const fetchDetailClass = async (id: number) => {
  return api
    .get(`/get_std_class/schedule/${id}`)
    .then(({ data }) => {
      return {
        data: data.result as ClassStdDetail,
      };
    })
    .catch(err => {
      console.error("error fetch detail class");
      throw new Error(err.response?.data.message);
    });
};

const postBooking = async (schedule_id: number) => {
  return api
    .post("/get_std_class/booking", { schedule_id })
    .then(({ data }) => {
      console.log(data);
      return {
        message: data.message,
      };
    })
    .catch(err => {
      console.error("error post booking");
      throw new Error(err.response?.data.message);
    });
};

const fetchBookingHistory = async () => {
  return api
    .get("/get_std_class/history_booking_class")
    .then(({ data }) => {
      console.log(data);
      return {
        data: data.result as IClassHistory[],
      };
    })
    .catch(err => {
      console.error("error fetch booking history");
      throw new Error(err.response?.data.message);
    });
};

const cancelBooking = async (id: number, reason: string) => {
  return api
    .post("/get_std_class/cancel_booking", { id: id, reason: reason })
    .then(({ data }) => {
      return {
        data: data.success,
      };
    })
    .catch(err => {
      console.error("error cancel booking");
      throw new Error(err.response?.data.message);
    });
};

export {
  fetchAllClasses,
  fetchDetailClass,
  postBooking,
  fetchBookingHistory,
  cancelBooking,
};
