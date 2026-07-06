import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculators, getCategoryById } from '../data/calculatorRegistry.js';
import { searchCalculators } from '../utils/search.js';
import Icon from './Icon.jsx';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const results = useMemo(() => searchCalculators(calculators, query), [query]);
  const showResults = isFocused && query.trim().length > 0;

  const goToCalculator = (id) => {
    setQuery('');
    setIsFocused(false);
    navigate(`/${id}`);
  };

  return (
    <div className="search-bar">
      <div className="search-bar-input-wrap">
        <Icon name="search" size={18} className="icon" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder="Hesaplayıcı ara: kredi, BMI, yüzde, yaş…"
          aria-label="Hesaplayıcı ara"
        />
        {query && (
          <button
            type="button"
            className="search-bar-clear"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            aria-label="Aramayı temizle"
          >
            <Icon name="close" size={15} />
          </button>
        )}
      </div>
      {showResults && (
        <div className="search-results">
          {results.length > 0 ? (
            results.map((item) => (
              <button
                key={item.id}
                type="button"
                className="search-result-item"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => goToCalculator(item.id)}
              >
                <span className="icon"><Icon name={item.icon} size={19} /></span>
                <span className="texts">
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </span>
                <span className="tag">{getCategoryById(item.category)?.label}</span>
              </button>
            ))
          ) : (
            <p className="search-empty">"{query}" için sonuç bulunamadı.</p>
          )}
        </div>
      )}
    </div>
  );
}
