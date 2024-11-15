'use client';

import { InputProps } from '@nextui-org/react';
import React from 'react';

interface TextInputProps  {
  name: string;
  label?: string | { __html: string }; // Allow HTML labels
  value?: string | number;
  onChange?: (name: string, value: string) => void;
  disabled?: boolean;
  error?: string;
  myicon?: React.ReactNode;
  className?: string; // Additional className prop
  placeholder?: string;
  type?: string;
  size?: 's' | 'm' | 'l';
  [key: string]: any; // For other input props
}

const TextInput: React.FC<TextInputProps> = ({
  name,
  label,
  value,
  onChange,
  disabled = false,
  error,
  myicon,
  className, 
  placeholder,
  type = 'text',
  size = 'm',
  ...rest
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(name, e.target.value);
    }
  };

  return (
    <div
      className={`flex flex-col items-center gap-2 p-1 md:flex-row ${className ?? ''}`}
    >
      {label && typeof label === 'string' ? (
        <label htmlFor={name} className="custom-textfield-label-style-1">
          {label + ':'}
        </label>
      ) : label && typeof label === 'object' && label.__html ? (
        <label
          htmlFor={name}
          className="custom-textfield-label-style-1"
          dangerouslySetInnerHTML={label}
        />
      ) : null}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder} // Add the placeholder to the input field
          className={`custom-textfield-style-1
                   ${
                     error
                       ? 'ring-red-500 focus:ring-red-500 '
                       : 'focus:ring-indigo-600'
                   }
            ${disabled ? 'cursor-not-allowed bg-gray-50' : ''}
          `}
          onChange={handleChange}
          value={value}
          disabled={disabled}
          {...rest}
        />
        {myicon && (
          <div className="pointer-events-none absolute inset-y-0 right-1 flex items-center">
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

export default TextInput;