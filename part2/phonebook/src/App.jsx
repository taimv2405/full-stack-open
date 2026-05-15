import { useEffect, useState } from 'react';
import * as personService from './services/personService';
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
      .getAllPersons()
      .then((returnedPersons) => setPersons(returnedPersons))
      .catch((error) => {
        console.error('Fetch persons failed:', error);
        alert('Fetch persons failed. Please try again later.');
      });
  }, []);

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleSearchChange = (event) => setSearch(event.target.value);

  const handleAddPerson = (event) => {
    event.preventDefault();

    const trimmedName = newName.trim();
    const trimmedNumber = newNumber.trim();

    if (!trimmedName || !trimmedNumber) {
      alert('Please fill in both name and number');
      return;
    }

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (existingPerson) {
      const isConfirmed = window.confirm(
        `${trimmedName} is already added to phonebook, replace the old number with a new one?`,
      );
      if (isConfirmed) {
        handleUpdatePerson(existingPerson, trimmedNumber);
      }
      return;
    }

    const newPerson = { name: trimmedName, number: trimmedNumber };

    personService
      .createPerson(newPerson)
      .then((savedPerson) => {
        setPersons((prevPersons) => [...prevPersons, savedPerson]);
        setNewName('');
        setNewNumber('');
      })
      .catch((error) => {
        console.error('Create person failed:', error);
        alert('Create person failed. Please try again later.');
      });
  };

  const handleDeletePerson = (id) => {
    const personToDelete = persons.find((person) => person.id === id);

    const isConfirmed = window.confirm(`Delete ${personToDelete.name} ?`);
    if (isConfirmed) {
      personService
        .deletePersonById(id)
        .then(() => {
          setPersons((prevPersons) => prevPersons.filter((p) => p.id !== id));
        })
        .catch((error) => {
          console.error('Delete person failed:', error);
          if (error.response && error.response.status === 404) {
            alert(`'${personToDelete.name}' was already removed.`);
            setPersons((prevPersons) =>
              prevPersons.filter((person) => person.id !== personToDelete.id),
            );
          } else {
            alert('Delete person failed. Please try again later.');
          }
        });
    }
  };

  const handleUpdatePerson = (existingPerson, newNumber) => {
    personService
      .updatePersonById(existingPerson.id, {
        ...existingPerson,
        number: newNumber,
      })
      .then((updatedPerson) => {
        setPersons((prevPersons) =>
          prevPersons.map((person) =>
            person.id === existingPerson.id ? updatedPerson : person,
          ),
        );
        setNewName('');
        setNewNumber('');
      })
      .catch((error) => {
        console.error('Update person failed:', error);
        if (error.response && error.response.status === 404) {
          alert(`'${existingPerson.name}' was already removed.`);
          setPersons((prevPersons) =>
            prevPersons.filter((person) => person.id !== existingPerson.id),
          );
        } else {
          alert('Update person failed. Please try again later.');
        }
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
        onSubmit={handleAddPerson}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} onDelete={handleDeletePerson} />
    </div>
  );
};

export default App;
