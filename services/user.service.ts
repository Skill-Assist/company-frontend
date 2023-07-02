import axios from "axios";
import cookie from "react-cookies";

const API_URL = "http://localhost:5500/api/v1"

const userService = {
  signin: async () => {
    try {
      let data = {
        email: "john.doe@example.com",
        password: "Test1234!",
      };
      const response = await axios.post(`${API_URL}/auth/signin`, data)
      cookie.save("token", response.data.access_token, {})
      return response;
    } catch (error: any) {
      return error.response;
    }
  },
  getProfile: async () => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };

    try {
      const response = await axios.get(
        `${API_URL}/user/profile`,
        config
      );
      return response;
    } catch (error: any) {
      return error.response;
    }
  },
  update: async (data: any) => {
    // await userService.signin();
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
