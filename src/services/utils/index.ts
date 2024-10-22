import { api } from "../../lib/axios";

const checkVersion = async (platform: string, version: string) => {
  console.log({ platform, version });
  return api
    .post("/mobile_version", {
      role: "member",
      platform: platform,
      current_version: version,
    })
    .then(({ data }) => {
      return {
        data: data,
      };
    })
    .catch(err => {
      console.error("error check version", err.response?.data.message);
      throw new Error(err.response?.data.message);
    });
};

export { checkVersion };
