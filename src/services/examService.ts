import axios from 'axios';
import cookie from 'react-cookies';
import { toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const examService = {
  getAllOwnExams: async () => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load('token')}`,
      },
    };
    try {
      const profile = await axios.get(`${API_URL}/user/profile`, config);
      return profile.data.ownedExamsRef;
    } catch (error: any) {
      const statusCode = error.response.data.statusCode;
      const message = error.response.data.message;

      if (statusCode === 418 || message.includes('Invalid token')) {
        cookie.remove('token');
        toast.error(
          'Erro de conexão. Verifique sua internet e tente novamente...',
          {
            icon: '📶',
          }
        );
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
        }, 2000);
      }
      return error.response;
    }
  },

  getOwnExam: async (examId: string) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load('token')}`,
      },
    };
    try {
      const response = await axios.get(
        `${API_URL}/exam/findOne?key=id&value=${examId}&relations=sections&map=true`,
        config
      );
      return response;
    } catch (error: any) {
      const statusCode = error.response.data.statusCode;
      const message = error.response.data.message;

      if (statusCode === 418 || message.includes('Invalid token')) {
        cookie.remove('token');
        toast.error(
          'Erro de conexão. Verifique sua internet e tente novamente...',
          {
            icon: '📶',
          }
        );
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
        }, 2000);
      }
      return error.response;
    }
  },

  getAnswerSheet: async (AnswerSheetId: string) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load('token')}`,
      },
    };
    try {
      const response = await axios.get(
        `${API_URL}/answer-sheet/findOne?key=id&value=${AnswerSheetId}&relations=exam,sectionToAnswerSheets,user&map=true`,
        config
      );
      return response;
    } catch (error: any) {
      const statusCode = error.response.data.statusCode;
      const message = error.response.data.message;

      if (statusCode === 418 || message.includes('Invalid token')) {
        cookie.remove('token');
        toast.error(
          'Erro de conexão. Verifique sua internet e tente novamente...',
          {
            icon: '📶',
          }
        );
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
        }, 2000);
      }
      return error.response;
    }
  },

  suggestDescription: async (data: { jobTitle: string; jobLevel: string }) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load('token')}`,
      },
    };
    try {
      const response = await axios.post(
        `${API_URL}/exam/suggestDescription`,
        data,
        config
      );
      return response;
    } catch (error: any) {
      const statusCode = error.response.data.statusCode;
      const message = error.response.data.message;

      if (statusCode === 418 || message.includes('Invalid token')) {
        cookie.remove('token');
        toast.error(
          'Erro de conexão. Verifique sua internet e tente novamente...',
          {
            icon: '📶',
          }
        );
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
        }, 2000);
      }
      return error.response;
    }
  },

  createExam: async (exam: {
    jobTitle: string;
    jobLevel: string;
    description: string;
    durationInHours: number;
    submissionInHours: number;
    showScore: boolean;
    isPublic: boolean;
  }) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load('token')}`,
      },
    };
    try {
      const response = await axios.post(`${API_URL}/exam`, exam, config);
      return response;
    } catch (error: any) {
      const statusCode = error.response.data.statusCode;
      const message = error.response.data.message;

      if (statusCode === 418 || message.includes('Invalid token')) {
        cookie.remove('token');
        toast.error(
          'Erro de conexão. Verifique sua internet e tente novamente...',
          {
            icon: '📶',
          }
        );
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
        }, 2000);
      }
      return error.response;
    }
  },

  updateExam: async (
    updatedExam: {
      jobTitle?: string | null;
      jobLevel?: string | null;
      description?: string | null;
      durationInHours?: number | null;
      submissionInHours?: number | null;
      showScore?: boolean | null;
      isPublic?: boolean | null;
    },
    examId: string
  ) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load('token')}`,
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
      const statusCode = error.response.data.statusCode;
      const message = error.response.data.message;

      if (statusCode === 418 || message.includes('Invalid token')) {
        cookie.remove('token');
        toast.error(
          'Erro de conexão. Verifique sua internet e tente novamente...',
          {
            icon: '📶',
          }
        );
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
        }, 2000);
      }
      return error.response;
    }
  },

  deleteExam: async (
    examId: string,
  ) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load('token')}`,
      },
    };
    try {
      const response = await axios.delete(
        `${API_URL}/exam?id=${examId}`,
        config
      );
      return response;
    } catch (error: any) {
      const statusCode = error.response.data.statusCode;
      const message = error.response.data.message;

      if (statusCode === 418 || message.includes('Invalid token')) {
        cookie.remove('token');
        toast.error(
          'Erro de conexão. Verifique sua internet e tente novamente...',
          {
            icon: '📶',
          }
        );
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
        }, 2000);
      }
      return error.response;
    }
  },

  switchStatus: async (examId: number, status: string) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load('token')}`,
      },
    };
    try {
      const response = await axios.get(
        `${API_URL}/exam/switchStatus?id=${examId}&status=${status}`,
        config
      );
      return response;
    } catch (error: any) {
      const statusCode = error.response.data.statusCode;
      const message = error.response.data.message;

      if (statusCode === 418 || message.includes('Invalid token')) {
        cookie.remove('token');
        toast.error(
          'Erro de conexão. Verifique sua internet e tente novamente...',
          {
            icon: '📶',
          }
        );
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
        }, 2000);
      }
      return error.response;
    }
  },

  sendInvitation: async (
    examId: string,
    invitation: {
      email: string[];
      expirationInHours: number;
    }
  ) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load('token')}`,
      },
    };
    try {
      const response = await axios.post(
        `${API_URL}/exam/sendInvitations?id=${examId}`,
        invitation,
        config
      );
      return response;
    } catch (error: any) {
      const statusCode = error.response.data.statusCode;
      const message = error.response.data.message;

      if (statusCode === 418 || message.includes('Invalid token')) {
        cookie.remove('token');
        toast.error(
          'Erro de conexão. Verifique sua internet e tente novamente...',
          {
            icon: '📶',
          }
        );
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
        }, 2000);
      }
      return error.response;
    }
  },

  resendInvitation: async (invitationId: number) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load('token')}`,
      },
    };
    try {
      const response = await axios.get(
        `${API_URL}/examInvitation/resend?id=${invitationId}`,
        config
      );
      return response;
    } catch (error: any) {
      const statusCode = error.response.data.statusCode;
      const message = error.response.data.message;

      if (statusCode === 418 || message.includes('Invalid token')) {
        cookie.remove('token');
        toast.error(
          'Erro de conexão. Verifique sua internet e tente novamente...',
          {
            icon: '📶',
          }
        );
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
        }, 2000);
      }
      return error.response;
    }
  },

  generateCorrection: async (answerSheetId: number) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load('token')}`,
      },
    };
    try {
      const response = await axios.get(
        `${API_URL}/answer-sheet/generateEval?id=${answerSheetId}`,
        config
      );
      return response;
    } catch (error: any) {
      const statusCode = error.response.data.statusCode;
      const message = error.response.data.message;

      if (statusCode === 418 || message.includes('Invalid token')) {
        cookie.remove('token');
        toast.error(
          'Erro de conexão. Verifique sua internet e tente novamente...',
          {
            icon: '📶',
          }
        );
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
        }, 2000);
      }
      return error.response;
    }
  },

  getInvitation: async (examId: string) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load('token')}`,
      },
    };
    try {
      const response = await axios.get(
        `${API_URL}/exam/findOne?key=id&value=${examId}&relations=enrolledUsers,invitations,answerSheets&map=true`,
        config
      );
      return response;
    } catch (error: any) {
      const statusCode = error.response.data.statusCode;
      const message = error.response.data.message;

      if (statusCode === 418 || message.includes('Invalid token')) {
        cookie.remove('token');
        toast.error(
          'Erro de conexão. Verifique sua internet e tente novamente...',
          {
            icon: '📶',
          }
        );
        setTimeout(() => {
          window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
        }, 2000);
      }
      return error.response;
    }
  },

  getCandidates: async (examId: string) => {
    let config = {
      headers: {
        Authorization: `Bearer ${cookie.load('token')}`,
      },
    };

    try {
      const response = await axios.get(
        `${API_URL}/exam/fetchCandidates?id=${examId}`,
        config
      );
      return response;
    } catch (error: any) {
      return error.response;
    }
  },
};

export default examService;
