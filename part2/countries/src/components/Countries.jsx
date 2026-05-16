import { Country } from './Country';
import { CountryDetail } from './CountryDetail';

const MAX_DISPLAY_COUNT = 10;

export const Countries = ({ countries, onSelect }) => {
  if (countries.length > MAX_DISPLAY_COUNT)
    return <div>Too many matches, specify another filter</div>;

  return (
    <div>
      {countries.map((country) => (
        <Country key={country.cca3} country={country} onSelect={onSelect} />
      ))}
    </div>
  );
};
