'use client';

import React, { useEffect, useState } from 'react';

interface DropdownInputProps  {
  name: string;
  label: string | { __html: string }; 
  options: { label: string; value: any }[];
  value?: any;
  onChange: (name: string, value: any) => void;
  disabled?: boolean;
  myicon?: React.ReactNode;
  error?: string;
}

const DropdownInputNA: React.FC<DropdownInputProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  disabled = false,
  myicon,
  error,
}) => {
  const getCurrentIndex = () => {
    if (value === undefined || value === null) return -1;
    return options?.findIndex((option) =>
      typeof option.value === 'object' 
        ? option.value.id === value.id
        : option.value === value,
    );
  };

  const [selectedIndex, setSelectedIndex] = useState<number>(getCurrentIndex());

  //current useeffect
  useEffect(() => {
    const newIndex = getCurrentIndex();

    const naOption = options.find((option) => option.label === 'NA');
    if (naOption && value === null) {
      onChange(name, naOption.value);
      setSelectedIndex(options.indexOf(naOption));
    } else {
      setSelectedIndex(newIndex);
    }

}, [value, options]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newIndex = parseInt(e.target.value);
    setSelectedIndex(newIndex);
    if (newIndex >= 0) {
      onChange(name, options[newIndex].value);
    } else {
      onChange(name, null);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-2 p-1 md:flex-row">
      {label && typeof label === 'string' ? (
        <label htmlFor={name} className="custom-textfield-label-style-1">
          {label}
        </label>
      ) : (
        label && typeof label === 'object' && label.__html ? (
          <label htmlFor={name} className="custom-textfield-label-style-1" dangerouslySetInnerHTML={label} />
        ) : null
      )}
      <div className="">
        <select
          id={name}
          name={name}
          className={`custom-dropdown-style-1 m-0 p-0 ${disabled ? 'cursor-not-allowed bg-gray-50' : ''
            }`}
          onChange={handleChange}
          value={selectedIndex}
          disabled={disabled}
        >
          <option className={"custom-font-style-override"} value="-1">Select a value</option>
          {options.map((option, index) => (
            <option key={index} value={index} className={"custom-font-style-override"}>
              {option.label}
            </option>
          ))}
        </select>
        {myicon && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            {myicon}
          </div>
        )}
        {error && (
          <div className="font-mono text-xs text-red-700 ">{error}</div>
        )}
      </div>
    </div>
  );
};

export default DropdownInputNA;
