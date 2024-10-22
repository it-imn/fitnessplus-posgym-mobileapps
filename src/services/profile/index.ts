import { api } from "../../lib/axios";
import { UserDetail } from "../../lib/definition";

const fetchProfile = async () => {
  return api
    .get("/profile")
    .then(({ data }) => {
      console.log(data.user, "Profile");
      return {
        data: data.user as UserDetail,
      };
    })
    .catch(err => {
      console.error("error fetch profile", err.response?.data.message);
      throw new Error(err.response?.data.message);
    });
};

export { fetchProfile };
