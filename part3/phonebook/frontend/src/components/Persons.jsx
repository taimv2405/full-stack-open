import Person from './Person';

const Persons = ({ personsToShow, onDelete }) =>
  personsToShow.map((person) => (
    <Person key={person.id} person={person} onDelete={onDelete} />
  ));

export default Persons;
