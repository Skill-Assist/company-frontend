import axios from "axios";
import cookie from "react-cookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const sectionService = {
  createSection: async (
    examId: number,
    section: {
      name: string;
      description: string;
      weight: number;
      durationInHours: number;
    }
  ) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const response = await axios.post(
        `${API_URL}/section?examId=${examId}`,
        section,
        config
      );
      return response;
    } catch (error: any) {
      return error.response;
    }
  },
};

export default sectionService;
