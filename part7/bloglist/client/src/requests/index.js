import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

export const setToken = (newToken) => {
  token = newToken;
};

const getAuthHeader = () => (token ? { Authorization: `Bearer ${token}` } : {});

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
