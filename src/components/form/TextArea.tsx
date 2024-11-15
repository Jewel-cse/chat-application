'use client';

import { TextAreaProps } from '@nextui-org/react';
import React from 'react';

interface TextFieldProps  {
  name: string;
  label?: string;
  value?: string | number;
  onChange: (name: string, value: string) => void;
  disabled?: boolean;
  error?: string;
  rows?: number;
  width?: string;
  required?:boolean;
  [key: string]: any; // For other input props
}

const TextField: React.FC<TextFieldProps> = ({
  name,
  label,
  value,
  onChange,
  disabled = false,
  error,
  width,
  required,
  ...rest
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(name, e.target.value);
  };

  return (
    <div className="flex items-center  gap-2 p-1 md:flex-row">
      {label && required ? (
        <label
          htmlFor={name}
          className="text text-gray-800 dark:text-white font-normal"
        >
          {label}
          <span className="text-red-600">*</span>
        </label>
      ) : (
        <label htmlFor={name} className="text-gray-800">
          {label}
        </label>
      )}

      <textarea
        id="textFieldId"
        rows={5}
        className={`custom-textfield-style-1 rounded-md border border-blue-200  focus:border-blue-200 
        ${error ? 'ring-red-500 focus:ring-red-500 ' : 'focus:ring-indigo-600'}
        ${disabled ? 'cursor-not-allowed bg-gray-100' : ''}`}
        style={{ height: '60px', width: width }}
        // placeholder="Remarks here..."
        onChange={handleChange}
        value={value}
        disabled={disabled}
        {...rest}
      />
      {error && <div className="font-mono text-xs text-red-700 ">{error}</div>}
    </div>
  );
};

export default TextField;
