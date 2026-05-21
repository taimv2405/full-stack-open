import { useEffect, useState } from 'react';
import * as personService from './services/personService';
import Notification from './components/Notification';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState(null);

  const notify = (text, type) => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    personService
      .getAllPersons()
      .then((returnedPersons) => setPersons(returnedPersons))
      .catch((error) => {
        console.error('Fetch persons failed:', error);
        notify('Fetch persons failed. Please try again later.', 'error');
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
      notify('Please fill in both name and number', 'error');
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
        notify(`Created ${trimmedName}`, 'success');
      })
      .catch((error) => {
        console.error('Create person failed:', error);
        notify('Create person failed. Please try again later.', 'error');
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
          notify(`Deleted ${personToDelete.name}`, 'success');
        })
        .catch((error) => {
          console.error('Delete person failed:', error);
          if (error.response && error.response.status === 404) {
            notify(
              `'${personToDelete.name}' has already been removed.`,
              'error',
            );
            setPersons((prevPersons) =>
              prevPersons.filter((person) => person.id !== personToDelete.id),
            );
          } else {
            notify('Delete person failed. Please try again later.', 'error');
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
        notify(`Updated ${updatedPerson.name}`, 'success');
      })
      .catch((error) => {
        console.error('Update person failed:', error);
        if (error.response && error.response.status === 404) {
          notify(`'${existingPerson.name}' has already been removed.`, 'error');
          setPersons((prevPersons) =>
            prevPersons.filter((person) => person.id !== existingPerson.id),
          );
        } else {
          notify('Update person failed. Please try again later.', 'error');
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
      <Notification notification={notification} />
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
