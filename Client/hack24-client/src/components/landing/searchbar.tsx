"use client"

import React, { ChangeEvent, KeyboardEvent, useState } from 'react';
import '@/styles/landing/searchbar.css'

const Searchbar: React.FC = () => {
  const [value, setValue] = useState('');

  // Handler for input field changes
  const searchHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  // Handler for Enter key press
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // Implement search action here
      console.log('Search initiated with value:', value);
    }
  };

  return (
    <div className="searchbar-container">
      <input
        type="text"
        placeholder="Search items..."
        value={value}
        onChange={searchHandler}
        onKeyDown={handleKeyDown}
        className="search-input"
      />
    </div>
  );
};

export default Searchbar;
