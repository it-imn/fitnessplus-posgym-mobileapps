import { Image } from "react-native-compressor";
import { api } from "../../lib/axios";
import { SignUpReq } from "../../stores/useSignUpStore";

const checkIn = async (code: string) => {
  return api
    .post(`/member/ci_co/${code}`)
    .then(({ data }) => {
      console.log(data, "check in");
      return {
        status: data.status,
        message: data.message,
        check_id:  data.id,
      };
    })
    .catch(err => {
      console.error("error check in", err);
      throw new Error(err.response?.data.message);
    });
};

const scanQR = async (code: string) => {
  return api
    .post(`/member/scan_qr/${code}`)
    .then(({ data }) => {
      return {
        status: data.status as "checkin" | "checkout",
      };
    })
    .catch(err => {
      console.error("error scan QR");
      throw new Error(err.response?.data.message);
    });
};

const register = async (req: SignUpReq) => {
  const formData = new FormData();
  if (req.image !== "") {
    const photo = await Image.compress(
      req.image.startsWith("file://") ? req.image : `file://${req.image}`,
      {
        quality: 0.1,
        compressionMethod: "auto",
      },
    );
    formData.append("image", {
      uri: photo,
      name: req.image,
      type: "image/jpeg",
    });
  }
  formData.append("name", req.name);
  formData.append("gender", req.gender);
  if (req.address || req.address !== "") {
    formData.append("address", req.address);
  }
  formData.append("birthdate", req.birthDate.toISOString().slice(0, 10));
  formData.append("email", req.email);
  if (req.phone !== "") {
    formData.append("phone", req.phone);
  }
  formData.append("username", req.username);
  formData.append("password", req.password);
  formData.append("gym_id", req.gym_id);
  formData.append("branch_id", req.branch_id);
  formData.append("term", req.term);
  if (req.referal) {
    formData.append("referal", req.referal);
  }
  console.log(formData);
  return api
    .post("/member/register", formData)
    .then(({ data }) => {
      return {
        message: data.message,
      };
    })
    .catch(err => {
      console.error("error register", err.response?.data.message);
      throw new Error(err.response?.data.message);
    });
};

const validateSignUp = async (req: {
  name: string;
  gender: "rather_not_say" | "male" | "female";
  email: string;
  phone: string;
  address: string;
  birthdate: string;
  username: string;
  password: string;
  password_confirmation: string;
}) => {
  return api
    .post("/member/validation", req)
    .then(({ data }) => {
      console.log(data);
      return {
        message: data.message,
      };
    })
    .catch(err => {
      console.error("error validate sign up", err.response?.data);
      return Promise.reject({
        message: err.response?.data.message,
        errors: err.response?.data.errors,
      });
    });
};

const requestLogout = async (req: { email: string }) => {
  return api
    .post("/member/request-logout-manual", req)
    .then(({ data }) => {
      console.log(data);
      return {
        message: data.message,
      };
    })
    .catch(err => {
      console.error("error request logout manual", err.response?.data);
      return Promise.reject({
        message: err.response?.data.message,
      });
    });
};

export { checkIn, scanQR, register, validateSignUp, requestLogout };
