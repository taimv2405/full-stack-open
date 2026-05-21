import axios from 'axios';

const baseUrl = 'http://localhost:3001/persons';

export const getAllPersons = () =>
  axios.get(baseUrl).then((response) => response.data);

export const createPerson = (person) =>
  axios.post(baseUrl, person).then((response) => response.data);

export const deletePersonById = (id) => axios.delete(`${baseUrl}/${id}`);

export const updatePersonById = (id, person) =>
  axios.put(`${baseUrl}/${id}`, person).then((response) => response.data);
