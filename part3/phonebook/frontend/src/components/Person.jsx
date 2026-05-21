const Person = ({ person, onDelete }) => {
  const { name, number, id } = person;
  return (
    <p className="person">
      {name} {number}
      <button onClick={() => onDelete(id)}>delete</button>
    </p>
  );
};

export default Person;
