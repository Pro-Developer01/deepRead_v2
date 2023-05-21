import React, { useState } from 'react';
import GoogleCSE, { executeSearch } from './GoogleCSE';

const GoogleSearch = ({ searchQuery, onSelect, setSearchQuery }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [results, setResults] = useState([]);

  const handleSubmit = async (event) => {
      event.preventDefault(); // prevent the form from being submitted and the page from reloading
      if (!searchQuery) {
        return;
      }
      try {
        const results = await executeSearch(searchQuery);
        setResults(results);
        setSearchQuery(""); // Clear the search query input
        console.log('search results:', results);
      } catch (error) {
        console.error(error);
      }
    };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    onSelect(image);
  };

  return (
    <>
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" onClick={(e) => e.stopPropagation()} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <button type="submit">Search</button>
      </form>
    </div>
    
    {results.map((result) => (
      <img
        key={result.link}
        src={result.link}
        alt={result.title}
        onClick={() => onSelect(result.link)}
      />
    ))}
    
    <div className="google-search-container">
      <GoogleCSE searchQuery={searchQuery} onSelect={handleImageSelect} />
    </div>
    </>
  );
};

export default GoogleSearch;