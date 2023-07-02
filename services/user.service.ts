import axios from "axios";
import cookie from "react-cookies"

const API_URL = "http://localhost:5500/api/v1";

const userService = {
  update: async (data: any) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const response = await axios.patch(
        `${API_URL}}/user/updateProfile`,
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
