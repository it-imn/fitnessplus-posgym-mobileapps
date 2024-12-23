import { api } from "../../lib/axios";
import { getUser } from "../../lib/local-storage";

const login = async (username: string, password: string) => {
  return api
    .post("/login", {
      username: username,
      password: password,
    })
    .then(({ data }) => {
      return {
        data: data,
      };
    })
    .catch(err => {
      console.error("error login");
      throw new Error(err.response?.data.message);
    });
};

const logout = async () => {
  return api
    .post("/logout")
    .then(({ data }) => {
      return {
        data: data,
      };
    })
    .catch(err => {
      console.error("error logout");
      throw new Error(err.response?.data.message);
    });
};

const offline = async () => {
  const user = await getUser();
  return api
    .post("/offline_account", {
      username: user?.username,
      branch_id: user?.branch.id,
    })
    .then(({ data }) => {
      return {
        data: data,
      };
    })
    .catch(err => {
      console.error("error offline", err.response?.data.message);
      throw new Error(err.response?.data.message);
    });
};

const deleteAccount = async () => {
  return api
    .delete("/delete_account")
    .then(({ data }) => {
      return {
        data: data,
      };
    })
    .catch(err => {
      console.error("error delete account", err.response?.data.message);
      throw new Error(err.response?.data.message);
    });
};

const forgotPassword = async (email: string) => {
  return api
    .post("/forget_password", {
      email: email,
    })
    .then(({ data }) => {
      return {
        data: data,
        message: data.message,
      };
    })
    .catch(err => {
      console.error("error forgot password", err.response?.data.message);
      throw new Error(err.response?.data.message);
    });
};

export { login, logout, offline, deleteAccount, forgotPassword };
