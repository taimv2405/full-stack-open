import { useEffect, useState } from 'react';
import axios from 'axios';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const baseUrl = 'http://localhost:3001/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios
      .get(baseUrl)
      .then((response) => setPersons(response.data))
      .catch((error) =>
        console.error('Error fetching data from server:', error),
      );
  }, []);

  const handleNameChange = (e) => setNewName(e.target.value);
  const handleNumberChange = (e) => setNewNumber(e.target.value);
  const handleSearchChange = (e) => setSearch(e.target.value);

  const addPerson = (e) => {
    e.preventDefault();

    const name = newName.trim();
    const number = newNumber.trim();

    if (!name || !number) {
      alert('Please fill in both name and number');
      return;
    }

    const isDuplicate = persons.some(
      (person) => person.name.toLowerCase() === name.toLowerCase(),
    );

    if (isDuplicate) {
      alert(`${name} is already added to phonebook`);
      return;
    }

    const newPerson = { name, number, id: crypto.randomUUID() };
    setPersons([...persons, newPerson]);
    setNewName('');
    setNewNumber('');
  };

  const searchTerm = search.trim().toLowerCase();
  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm),
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} onChange={handleSearchChange} />

      <h3>Add a new</h3>
      <PersonForm
        name={newName}
        number={newNumber}
        onSubmit={addPerson}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} />
    </div>
  );
};

export default App;
