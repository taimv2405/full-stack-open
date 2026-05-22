require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const Person = require('./models/person');
const { validateAndTrim } = require('./utils/validators');

const app = express();

app.use(express.json());

morgan.token('data', (request, response) => {
  return JSON.stringify(request.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data'),
);

app.use(express.static('dist'));

const PORT = process.env.PORT || 3001;

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

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((persons) => response.json(persons))
    .catch((error) => next(error));
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

app.delete('/api/persons/:id', (request, response, next) => {
  const { id } = request.params;
  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body;

  const validName = validateAndTrim(name);
  if (!validName) {
    return response
      .status(400)
      .json({ error: 'name is missing or invalid format' });
  }

  const validNumber = validateAndTrim(number);
  if (!validNumber) {
    return response
      .status(400)
      .json({ error: 'number is missing or invalid format' });
  }

  const newPerson = new Person({ name: validName, number: validNumber });

  newPerson
    .save()
    .then((savedPerson) => response.status(201).json(savedPerson))
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { id } = request.params;
  const { number } = request.body;

  const validNumber = validateAndTrim(number);
  if (!validNumber) {
    return response
      .status(400)
      .json({ error: 'number is missing or invalid format' });
  }

  Person.findById(id)
    .then((returnedPerson) => {
      if (!returnedPerson) {
        return response.status(404).json({ error: 'Person not found' });
      }

      returnedPerson.number = validNumber;

      return returnedPerson.save().then((savedPerson) => {
        response.json(savedPerson);
      });
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformed id' });
  }
  next(error);
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
