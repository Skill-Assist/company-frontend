import axios from "axios";
import cookie from "react-cookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const examService = {
  getOwnedExams: async () => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const profile = await axios.get(`${API_URL}/user/profile`, config);
      return profile.data.ownedExamsRef;
    } catch (error: any) {
      return error.response;
    }
  },
};

export default examService;
