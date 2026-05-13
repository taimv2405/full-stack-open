import { useState } from 'react';
import Person from './components/Person';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');

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

    const newPerson = { name, number };
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
      <div>
        filter shown with <input value={search} onChange={handleSearchChange} />
      </div>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {personsToShow.map((person) => (
        <Person key={person.name} name={person.name} number={person.number} />
      ))}
    </div>
  );
};

export default App;
