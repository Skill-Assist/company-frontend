import { Question } from "@/types/question";
import axios from "axios";
import cookie from "react-cookies";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const questionService = {
  createQuestion: async (
    question: Question,
    sectionId: string,
    weight: number
  ) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const response = await axios.post(
        `${API_URL}/question?sectionId=${sectionId}&weight=${weight}`,
        question,
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

  getAllQuestions: async (
    questions: {
      id: string;
      weight: number;
    }[]
  ) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const questionRequests = questions.map(async (question) => {
        const questionResponse = await axios.get(
          `${API_URL}/question/findOne?id=${question.id}`,
          config
        );

        return questionResponse.data;
      });

      const questionsResponse = await Promise.all(questionRequests);
      return questionsResponse;
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

  getOneQuestion: async (questionId: string) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const response = await axios.get(
        `${API_URL}/question/findOne?id=${questionId}`,
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

  generateQuestion: async (body: {
    type: string;
    statement: string;
  }) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load("token")}`,
      },
    };
    try {
      const response = await axios.post(
        `${API_URL}/question/generate`,
        body,
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
};

export default questionService;
