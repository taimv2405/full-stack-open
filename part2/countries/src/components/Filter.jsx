export const Filter = ({ searchQuery, onSearchChange }) => {
  return (
    <div>
      <label htmlFor="country">find countries </label>
      <input
        type="text"
        id="country"
        value={searchQuery}
        onChange={onSearchChange}
      />
    </div>
  );
};
