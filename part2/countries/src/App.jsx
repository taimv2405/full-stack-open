import { useState, useEffect } from 'react';
import { Filter } from './components/Filter';
import { Countries } from './components/Countries';
import * as countryService from './services/countryService';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    countryService
      .getAll()
      .then((returnedCountries) => setCountries(returnedCountries))
      .catch((error) => {
        console.error('Fetch countries failed:', error);
      });
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const countriesToShow = countries.filter((country) => {
    const countryName = country.name.common.toLowerCase();
    const filterText = searchQuery.trim().toLowerCase();
    return countryName.includes(filterText);
  });

  return (
    <>
      <Filter searchQuery={searchQuery} onSearchChange={handleSearch} />
      <Countries countries={countriesToShow} searchQuery={searchQuery} />
    </>
  );
};

export default App;
