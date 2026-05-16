import { useState, useEffect } from 'react';
import { Filter } from './components/Filter';
import { Countries } from './components/Countries';
import { CountryDetail } from './components/CountryDetail';
import * as countryService from './services/countryService';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    countryService
      .getAll()
      .then(setCountries)
      .catch((error) => {
        console.error('Fetch countries failed:', error);
      });
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setSelectedCountry(null);
  };

  const filterText = searchQuery.trim().toLowerCase();
  const countriesToShow = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filterText),
  );

  const singleResult = countriesToShow.length === 1 ? countriesToShow[0] : null;
  const countryToDisplay = singleResult || selectedCountry;

  return (
    <>
      <Filter searchQuery={searchQuery} onSearchChange={handleSearch} />
      {searchQuery.trim() &&
        (countryToDisplay ? (
          <CountryDetail country={countryToDisplay} />
        ) : (
          <Countries
            countries={countriesToShow}
            onSelect={setSelectedCountry}
          />
        ))}
    </>
  );
};

export default App;
