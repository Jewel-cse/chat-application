'use client';

import React, { useEffect, useRef, useState } from 'react';

interface SearchableDropdownProps {
  name: string;
  label: string | { __html: string }; // Allow HTML labels
  options: { label: string; value: any }[];
  value?: any;
  onChange: (name: string, value: any) => void;
  disabled?: boolean;
  myicon?: React.ReactNode;
  error?: string;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  disabled = false,
  myicon,
  error,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, options]);

  useEffect(() => {
    const newIndex = getCurrentIndex();
    setSelectedIndex(newIndex);
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getCurrentIndex = () => {
    if (value === undefined || value === null) return -1;
    return filteredOptions.findIndex((option) =>
      typeof option.value === 'object'
        ? option.value.id === value.id
        : option.value === value
    );
  };

  const handleChange = (index: number) => {
    setSelectedIndex(index);
    if (index >= 0) {
      onChange(name, filteredOptions[index].value);
    } else {
      onChange(name, null);
    }
    setIsOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex w-full flex-col items-center gap-16 p-1 md:flex-row" ref={dropdownRef}>
      {label && typeof label === 'string' ? (
        <label htmlFor={name} className="custom-textfield-label-style-1">
          {label + ':'}
        </label>
      ) : (
        label && typeof label === 'object' && label.__html ? (
          <label htmlFor={name} className="custom-textfield-label-style-1" dangerouslySetInnerHTML={label} />
        ) : null
      )}
      <div className={`relative w-full ${disabled ? 'cursor-not-allowed' : ''}`}>
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`custom-dropdown-style-1 m-0 p-0 ${disabled ? 'bg-gray-50' : ''}`}
        >
          {selectedIndex >= 0 ? filteredOptions[selectedIndex].label : 'Select a value'}
        </div>
        {isOpen && (
          <div className="absolute z-10  bg-white border border-gray-300 rounded-md shadow-lg">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="ml-2 border-b border-gray-300"
            />
            <ul className="max-h-60 overflow-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <li
                    key={index}
                    onClick={() => handleChange(index)}
                    className={`ml-2 cursor-pointer ${index === selectedIndex ? 'bg-blue-600' : ''}`}
                  >
                    {option.label}
                  </li>
                ))
              ) : (
                <li className="ml-2 text-gray-500">No options found</li>
              )}
            </ul>
          </div>
        )}
        {myicon && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            {myicon}
          </div>
        )}
        {error && (
          <div className="font-mono text-xs text-red-700">{error}</div>
        )}
      </div>
    </div>
  );
};

export default SearchableDropdown;
