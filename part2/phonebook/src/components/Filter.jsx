const Filter = ({ search, onChange }) => {
  return (
    <div>
      filter shown with <input value={search} onChange={onChange} />
    </div>
  );
};

export default Filter;
