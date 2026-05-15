import { useEffect, useState } from 'react';
import personService from './services/personService';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    personService
      .getAll()
      .then((data) => setPersons(data))
      .catch((error) => {
        console.error('Error fetching data from server:', error);
        alert('Error fetching data from server');
      });
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
      const replaceConfirmed = window.confirm(
        `${name} is already added to phonebook, replace the old number with a new one?`,
      );

      if (replaceConfirmed) {
        updatePerson(name, number);
      }
      return;
    }

    const newPerson = { name, number };

    personService
      .create(newPerson)
      .then((data) => {
        setPersons((prev) => [...prev, data]);
        setNewName('');
        setNewNumber('');
      })
      .catch((error) => {
        console.error('Error when create:', error);
        alert('Error when create');
      });
  };

  const deletePerson = (id) => {
    const personToDelete = persons.find((person) => person.id === id);

    if (window.confirm(`Delete ${personToDelete.name} ?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons((prev) => prev.filter((p) => p.id !== id));
        })
        .catch((error) => {
          console.error('Error deleting person:', error);
          alert(
            `Information of '${personToDelete.name}' has already been removed from server`,
          );
          setPersons((prev) => prev.filter((p) => p.id !== id));
        });
    }
  };

  const updatePerson = (name, number) => {
    const personToUpdate = persons.find(
      (person) => person.name.toLowerCase() === name.toLowerCase(),
    );

    personService
      .update(personToUpdate.id, { ...personToUpdate, number })
      .then((data) => {
        setPersons((prev) =>
          prev.map((p) => (p.id === personToUpdate.id ? data : p)),
        );
        setNewName('');
        setNewNumber('');
      })
      .catch((error) => {
        console.error('Error updating person:', error);
        alert(
          `Information of '${personToUpdate.name}' has already been removed from server`,
        );
        setPersons((prev) => prev.filter((p) => p.id !== personToUpdate.id));
      });
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
      <Persons personsToShow={personsToShow} onDelete={deletePerson} />
    </div>
  );
};

export default App;
