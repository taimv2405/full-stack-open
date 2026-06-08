import axios from 'axios';
import { getUserToken } from '../stores/userStore';

const baseUrl = '/api/blogs';

const getAuthHeader = () => {
  const token = getUserToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getBlogs = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

export const createBlog = async (newBlog) => {
  const response = await axios.post(baseUrl, newBlog, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const addComment = async (payload) => {
  const response = await axios.post(
    `${baseUrl}/${payload.id}/comments`,
    { comment: payload.comment },
    {
      headers: getAuthHeader(),
    },
  );
  return response.data;
};

export const updateBlog = async (updatePayload) => {
  const response = await axios.put(
    `${baseUrl}/${updatePayload.id}`,
    updatePayload,
    {
      headers: getAuthHeader(),
    },
  );
  return response.data;
};

export const removeBlog = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getBlog = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};
