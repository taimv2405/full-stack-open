export const Country = ({ country, onSelect }) => (
  <div>
    {country.name.common}{' '}
    <button onClick={() => onSelect(country)}>Show</button>
  </div>
);
