import axios from "axios";
import cookie from "react-cookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const userService = {
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
      return error.response;
    }
  },
};

export default userService;
