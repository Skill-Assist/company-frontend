import axios from "axios";
import cookie from "react-cookies";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const userService = {
  logout: () => {
    cookie.remove("token");
    cookie.remove("show_skill_assist_announcement");
    window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
  },

  getProfile: async () => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const profile = await axios.get(`${API_URL}/user/profile`, config);
      return profile.data;
    } catch (error: any) {
      const statusCode = error.response.data.statusCode;
      const message = error.response.data.message;

      if (statusCode === 418 || message.includes("Invalid token")) {
        cookie.remove("token");
        toast.error("Sua sessão expirou. Faça login novamente", {
          icon: "⏱️",
        });
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
        }, 2000);
      }
      return error.response;
    }
  },
  
  update: async (data: any) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };

    try {
      const response = await axios.patch(
        `${API_URL}/user/updateProfile`,
        data,
        config
      );
      return response;
    } catch (error: any) {
      const statusCode = error.response.data.statusCode;
      const message = error.response.data.message;

      if (statusCode === 418 || message.includes("Invalid token")) {
        cookie.remove("token");
        toast.error("Sua sessão expirou. Faça login novamente", {
          icon: "⏱️",
        });
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
        }, 2000);
      }
      return error.response;
    }
  },
};

export default userService;
