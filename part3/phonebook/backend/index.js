const express = require('express');
var morgan = require('morgan');

const app = express();

app.use(express.json());

morgan.token('data', (request, response) => {
  return JSON.stringify(request.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data'),
);

const PORT = 3001;
const MAX_ID_VALUE = 1000000;

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

const generateId = () => {
  let randomId;
  do {
    randomId = String(Math.floor(Math.random() * MAX_ID_VALUE));
  } while (persons.some((person) => person.id === randomId));

  return randomId;
};

const isNameTaken = (name) => {
  const newName = name.toLowerCase();
  return persons.some((person) => person.name.toLowerCase() === newName);
};

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  const personsCount = persons.length;
  const currentTime = new Date().toString();

  const infoContent = [
    `<p>Phonebook has info for ${personsCount} people</p>`,
    `<p>${currentTime}</p>`,
  ].join('\n');

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

app.delete('/api/persons/:id', (request, response) => {
  const { id } = request.params;

  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;

  if (typeof name !== 'string') {
    return response.status(400).json({ error: 'name must be a string' });
  }

  if (typeof number !== 'string') {
    return response.status(400).json({ error: 'number must be a string' });
  }

  const trimmedName = name.trim();
  const trimmedNumber = number.trim();

  if (!trimmedName) {
    return response.status(400).json({ error: 'name is missing' });
  }

  if (!trimmedNumber) {
    return response.status(400).json({ error: 'number is missing' });
  }

  if (isNameTaken(trimmedName)) {
    return response.status(409).json({ error: 'name must be unique' });
  }

  const newPerson = {
    id: generateId(),
    name: trimmedName,
    number: trimmedNumber,
  };

  persons = [...persons, newPerson];

  response.status(201).json(newPerson);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
