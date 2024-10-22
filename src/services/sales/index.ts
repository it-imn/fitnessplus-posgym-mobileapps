import { api } from "../../lib/axios";
import { ISales } from "../../lib/definition";

const fetchSales = async () => {
  return api
    .get("/sales")
    .then(({ data }) => {
      return {
        data: data.result as ISales[],
      };
    })
    .catch(err => {
      console.error("error fetch sales");
      throw new Error(err.response?.data.message);
    });
};

const fetchSalesById = async (id: number) => {
  return api
    .get(`/sales/${id}`)
    .then(({ data }) => {
      console.log(data);
      return {
        data: data.result[0] as ISales,
      };
    })
    .catch(err => {
      console.error("error fetch sales by id");
      throw new Error(err.response?.data.message);
    });
};

export { fetchSales, fetchSalesById };
