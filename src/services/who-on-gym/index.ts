import { api } from "../../lib/axios";
import { IWOG } from "../../lib/definition";

const fetchCountWOG = async () => {
  return api
    .get("/staff/wog/count")
    .then(({ data }) => {
      console.log(data.result.cico[0])
      return {
        data: data.result as IWOG,
      };
    })
    .catch(err => {
      console.error("error fetch count wog");
      throw new Error(err.response?.data.message);
    });
};

export { fetchCountWOG };
