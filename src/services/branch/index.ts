import { api } from "../../lib/axios";
import { IFacility } from "../../lib/definition";

const fetchFacilites = async () => {
  return api
    .get("/branch/facilities")
    .then(({ data }) => {
      console.log(data, "facilities");
      return {
        data: data.result as IFacility[],
      };
    })
    .catch(err => {
      console.error("error fetch facilities");
      throw new Error(err.response?.data.message);
    });
};

const loanFacility = async (facility_id: number, guarantee: string) => {
  return api
    .post("/branch/facilities/save", {
      facility_id: facility_id,
      guarantee: guarantee,
    })
    .then(({ data }) => {
      return {
        data: data.result,
      };
    })
    .catch(err => {
      console.error("error loan facility");
      throw new Error(err.response?.data.message);
    });
};

export { fetchFacilites, loanFacility };
