export const CountryDetail = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital?.join(', ')}</p>
      <p>Area: {country.area}</p>
      <h2>Language</h2>
      <ul>
        {Object.entries(country.languages || {}).map(([code, language]) => (
          <li key={code}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />
    </div>
  );
};
