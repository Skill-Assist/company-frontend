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

  updateSection: async (
    sectionId: string,
    section: {
      name?: string;
      description?: string;
      weight?: string;
      startDate?: Date;
      durationInHours?: number;
      isShuffleQuestions?: boolean;
      hasProctoring?: boolean;
    }
  ) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const response = await axios.patch(
        `${API_URL}/section?id=${sectionId}`,
        section,
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

  getOwnSection: async (sectionId: string) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const response = await axios.get(
        `${API_URL}/section/findOne?key=id&value=${sectionId}&map=true`,
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

export default sectionService;
