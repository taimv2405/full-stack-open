import { Weather } from './Weather';

export const CountryDetail = ({ country }) => {
  const capitalName = country.capital?.[0];

  return (
    <div>
      <h1>{country.name.common}</h1>

      {capitalName && <p>Capital: {country.capital.join(', ')}</p>}

      <p>Area: {country.area}</p>

      {country.languages && (
        <>
          <h2>Languages</h2>
          <ul>
            {Object.entries(country.languages).map(([code, language]) => (
              <li key={code}>{language}</li>
            ))}
          </ul>
        </>
      )}

      <img src={country.flags.png} alt={country.flags.alt} />

      {capitalName && <Weather city={capitalName} />}
    </div>
  );
};
