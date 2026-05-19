const express = require('express');

const app = express();

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  const personsCount = persons.length;
  const currentTime = new Date().toString();

  const infoContent = `
    <p>Phonebook has info for ${personsCount} people</p>
    <p>${currentTime}</p>
  `;

  response.send(infoContent);
});

app.get('/api/persons/:id', (request, response) => {
  const { id } = request.params;

  const targetPerson = persons.find((person) => person.id === id);

  if (!targetPerson) {
    return response.status(404).json({ error: 'Person not found' });
  }

  response.json(targetPerson);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
