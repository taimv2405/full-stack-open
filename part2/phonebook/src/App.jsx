import { useState } from 'react';
import Person from './components/Person';

const App = () => {
  const [persons, setPersons] = useState([{ name: 'Arto Hellas' }]);
  const [newName, setNewName] = useState('');

  const handleNameChange = (e) => setNewName(e.target.value);

  const addPerson = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const personObject = {
      name: newName,
    };
    setPersons(persons.concat(personObject));
    setNewName('');
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((person) => (
        <Person key={person.name} name={person.name} />
      ))}
    </div>
  );
};

export default App;
