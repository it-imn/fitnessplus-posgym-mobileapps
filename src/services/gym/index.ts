import { api } from "../../lib/axios";
import { IGym, IBranch } from "../../lib/definition";

const fetchGyms = async () => {
  return api
    .get("/gym/list")
    .then(({ data }) => {
      return {
        data: data.result as IGym[],
      };
    })
    .catch(err => {
      console.error("error fetch gyms");
      throw new Error(err.response?.data.message);
    });
};

const fetchBranchesWithGym = async (gym_id: number) => {
  return api
    .get(`/branch/list?gym_id=${gym_id}`)
    .then(({ data }) => {
      return {
        data: data.result as IBranch[],
      };
    })
    .catch(err => {
      console.error("error fetch gyms");
      throw new Error(err.response?.data.message);
    });
};

export { fetchGyms, fetchBranchesWithGym };
