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

  getOnwExam: async (examId: number) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const response = await axios.get(
        `${API_URL}/exam/findOne?key=id&value=${examId}`,
        config
      );
      return response;
    } catch (error: any) {
      return error.response;
    }
  },

  createExam: async (exam: {
    title: string;
    durationInHours: number;
    submissionInHours: number;
  }) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const response = await axios.post(`${API_URL}/exam`, exam, config);
      return response;
    } catch (error: any) {
      return error.response;
    }
  },

  updateExam: async (
    updatedExam: {
      subtitle?: string;
      level?: string;
      dateToArchive?: Date;
      showScore?: boolean;
      isPublic?: boolean;
    },
    examId: number
  ) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const response = await axios.patch(
        `${API_URL}/exam?id=${examId}`,
        updatedExam,
        config
      );
      return response;
    } catch (error: any) {
      return error.response;
    }
  },

  switchStatus: async (examId: number, status: string) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const response = await axios.get(
        `${API_URL}/exam/switchStatus?id=${examId}&status=${status}`,
        config
      );
      return response;
    } catch (error: any) {
      return error.response;
    }
  },
};

export default examService;
