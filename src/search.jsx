import React, { useState } from 'react';
import './Search.css';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [searchResults, setSearchResults] = useState(''); // State for the file content

  // Function to handle the search action
  const handleSearch = async () => {
    try {
      // Dynamically import text files based on the search query
      const result = await import(`../Data/${searchQuery}.txt`);
      const content = await fetch(result.default).then((res) => res.text());
      setSearchResults(content); // Set the content in state
    } catch (error) {
      setSearchResults('No results found for your query.'); // Handle missing files
    }
  };

  return (
    <div className="search-container">
      <h3>Search Recommendations</h3>
      <input
        type="text"
        className="search-bar"
        placeholder="Enter your query..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update state on input
      />
      <button className="search-button" onClick={handleSearch}>
        Search
      </button>
      <div className="search-results">
        <h4>Results:</h4>
        <p>{searchResults}</p>
      </div>
    </div>
  );
};

export default Search;
