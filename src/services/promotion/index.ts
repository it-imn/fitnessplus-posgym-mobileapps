import { api } from "../../lib/axios";
import { IPromotion } from "../../lib/definition";

export const fetchPromotions = async () => {
  return api
    .get("/promotion")
    .then(({ data }) => {
      return {
        data: data.result as IPromotion[],
      };
    })
    .catch(err => {
      console.error("error fetch promotion");
      throw new Error(err.response?.data.message);
    });
};
