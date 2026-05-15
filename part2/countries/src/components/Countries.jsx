import { Country } from './Country';
import { CountryDetail } from './CountryDetail';

const MAX_DISPLAY_COUNT = 10;

export const Countries = ({ countries, searchQuery }) => {
  if (searchQuery === '') return null;

  if (countries.length > MAX_DISPLAY_COUNT)
    return <div>Too many matches, specify another filter</div>;

  if (countries.length === 1) {
    return <CountryDetail country={countries[0]} />;
  }

  return (
    <div>
      {countries.map((country) => (
        <Country key={country.cca3} country={country} />
      ))}
    </div>
  );
};
