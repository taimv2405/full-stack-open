import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = newToken;
};

const getAuthHeader = () => (token ? { Authorization: `Bearer ${token}` } : {});

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newBlog) => {
  const request = axios.post(baseUrl, newBlog, {
    headers: getAuthHeader(),
  });
  return request.then((response) => response.data);
};

const update = (id, newBlog) => {
  const request = axios.put(`${baseUrl}/${id}`, newBlog, {
    headers: getAuthHeader(),
  });
  return request.then((response) => response.data);
};

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`, {
    headers: getAuthHeader(),
  });
  return request.then((response) => response.data);
};

export default { getAll, create, update, setToken, remove };
