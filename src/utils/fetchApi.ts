import axios from "axios";
import { BACKEND_URL } from "../../config";

const api = axios.create({
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
    // Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const login = async (email: string, password: string) => {
  const response = await api.post(`${BACKEND_URL}/users/login`, {
    email,
    password,
  });
  return response;
};

export const getSessions = async () => {
  const response = await api.get(`${BACKEND_URL}/sessions`);
  return response;
};

export const createSession = async () => {
  const response = await api.post(`${BACKEND_URL}/sessions`);
  return response;
};

export const getSession = async (sessionId: string) => {
  const response = await api.get(`${BACKEND_URL}/sessions/${sessionId}`);
  return response;
};

export const toggleLock = async (sessionId: string) => {
  const response = await api.post(`${BACKEND_URL}/sessions/${sessionId}`);
  return response;
};

export const upVote = async (sessionId: string, questionId: string) => {
  const response = await api.post(
    `${BACKEND_URL}/sessions/${sessionId}/questions/${questionId}`
  );
  return response;
};

export const createQuestion = async (sessionId: string, question: string) => {
  const response = await api.post(
    `${BACKEND_URL}/sessions/${sessionId}/questions`,
    {
      question,
    }
  );
  return response;
};

export const logOut = async () => {
  const response = await api.post(`${BACKEND_URL}/users/logout`);
  return response;
};
