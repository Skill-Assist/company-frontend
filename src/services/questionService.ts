import { Question } from "@/types/question";
import axios from "axios";
import cookie from "react-cookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const questionService = {
  createQuestion: async (question: Question, sectionId: string, weight: number) => {
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
      return error.response;
    }
  },

  getAllQuestions: async (questions: {
    id: string;
    weight: number;
  }[]) => {
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
      return error.response;
    }
  },
};

export default questionService;
