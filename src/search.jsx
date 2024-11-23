import React, { useState } from 'react';
import './Search.css';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');

  // Function to handle the search action
  const handleSearch = async () => {
    try {
      const result = await import(`../Data/${searchQuery}.txt`);
      const content = await fetch(result.default).then((res) => res.text());
      setSearchResults(content.split('\n')); // Split content into lines for dropdown
      setError('');
    } catch (error) {
      setSearchResults([]);
      setError('No results found for your query.');
    }
  };

  return (
    <div className="search-container">
      <h3>Immigration Hub</h3>
      <input
        type="text"
        className="search-bar"
        placeholder="Search for tips, services..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className="search-button" onClick={handleSearch}>
        🔍 Search
      </button>
      {error && <p className="error-message">{error}</p>}
      <div className="dropdown">
        {searchResults.map((result, index) => (
          <div key={index} className="dropdown-item">
            {result}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
