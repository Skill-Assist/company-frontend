import { SectionToAnswerSheet } from "@/types/sectionToAnswerSheet";
import axios from "axios";
import cookie from "react-cookies";
import { toast } from "react-hot-toast";

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
        toast.error("Sua seção expirou. Faça login novamente", {
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
        toast.error("Sua seção expirou. Faça login novamente", {
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
        toast.error("Sua seção expirou. Faça login novamente", {
          icon: "⏱️",
        });
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
        }, 2000);
      }
      return error.response;
    }
  },

  getSectionsToAnswerSheet: async (
    sectionToAnswerSheets: SectionToAnswerSheet[]
  ) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const sectionToAnswerSheetRequests = sectionToAnswerSheets.map(
        async (sectionToAnswerSheet) => {
          const sectionToAnswerSheetResponse = await axios.get(
            `${API_URL}/section-to-answer-sheet/findOne?key=id&value=${sectionToAnswerSheet.id}&relations=answers,section,answerSheet&map=true`,
            config
          );
          return sectionToAnswerSheetResponse.data;
        }
      );

      const sectionToAnswerSheetRequestsResponse = await Promise.all(
        sectionToAnswerSheetRequests
      );
      return sectionToAnswerSheetRequestsResponse;
    } catch (error: any) {
      const statusCode = error.response.data.statusCode;
      const message = error.response.data.message;

      if (statusCode === 418 || message.includes("Invalid token")) {
        cookie.remove("token");
        toast.error("Sua seção expirou. Faça login novamente", {
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
