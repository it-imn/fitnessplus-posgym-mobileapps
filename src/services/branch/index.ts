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

const loanFacility = async (
  facility_id: number,
  guarantee: string,
  number: number,
  check_id: number,
) => {
  const req = {
    facility_id: facility_id,
    guarantee: guarantee,
    number: number,
    status: "checkin",
    checkin_id: check_id,
  };
  console.log(req, "loan facility");
  return api
    .post("/branch/facilities/save", req)
    .then(({ data }) => {
      return {
        data: data.result,
      };
    })
    .catch(err => {
      console.error("error loan facility", err.response?.data);
      throw new Error(err.response?.data.message);
    });
};

const fetchLoanedFacilities = async (checkId: number) => {
  return api
    .get(`/member/facility_checkin/${checkId}`)
    .then(({ data }) => {
      console.log(data, "loaned facilities");
      return {
        data: data.result as IFacility[],
      };
    })
    .catch(err => {
      console.error("error fetch loaned facilities");
      throw new Error(err.response?.data.message);
    });
};

export { fetchFacilites, loanFacility, fetchLoanedFacilities };
