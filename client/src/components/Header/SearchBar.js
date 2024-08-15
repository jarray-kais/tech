import { useState, useMemo, useRef, useEffect } from 'react';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { suggestions } from '../../API';
import Message from '../Message/Message';


const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const suggestionsRef = useRef(null);

  const debouncedFetchSuggestions = useMemo(
    () => _.debounce((q) => setDebouncedQuery(q), 1000),
    []
  );

  const { data: suggest, isFetching, isLoading, error } = useQuery({
    queryKey: ['suggest', debouncedQuery],
    queryFn: () => suggestions(debouncedQuery),
    enabled: !!debouncedQuery,
    staleTime: 10000,
    cacheTime: 5000
  });

  const handleClickOutside = (event) => {
    if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    setQuery(e.target.value);
    debouncedFetchSuggestions(e.target.value);
    setShowSuggestions(true);
  };

  const handleIconClick = () => {
    navigate(query ? `/search?query=${query}` : '/search');
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    navigate(`/search?query=${suggestion}`);
  };

  const renderSuggestions = () => {
    if (suggest && !isFetching) {
      const allSuggestions = [
        ...suggest.name,
        ...suggest.description,
        ...suggest.main,
        ...suggest.sub,
        ...suggest.brand
      ];

      // Remove duplicates
      const uniqueSuggestions = Array.from(new Set(allSuggestions));

      return (
        <div className="suggestions-dropdown" ref={suggestionsRef}>
          {isLoading ? (
            <p>Chargement...</p>
          ) : error ? (
            <Message variant="danger">{error.message}</Message>
          ) : (
            uniqueSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="search-container">
      <div className="search-bar-suggest">
        <div className="search-bar-wrapper">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="chercher un produit, une catégorie ou une marque ..."
            className="search-bar"
          />
          <img 
            src="/images/search.svg"
            alt="Search"
            className="search-icon"
            onClick={handleIconClick}
          />
        </div>
        {showSuggestions && renderSuggestions()}
      </div>
    </div>
  );
};

export default SearchBar;
