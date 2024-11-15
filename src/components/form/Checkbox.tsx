import React from 'react';

interface CheckboxInputProps {
  name?: string;
  label?: string;
  checked?: boolean;
  onChange: (name: string, checked: boolean) => void;
  disabled?: boolean;
  error?: string;
  required?:boolean;
  height?: string,   
  width?: string,    
  borderColor?:string, 
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({
  name,
  label,
  checked,
  onChange,
  disabled = false,
  error,
  required,
  height = '16px',   
  width = '16px',    
  borderColor = 'blue-600', 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name!, e.target.checked);
  };

  return (
    <div className="flex items-center  gap-2 p-1 ">
      {label && required ? (
        <label htmlFor={name} className="text-gray-800 dark:text-white font-normal">
          {label}
          <span className='text-red-600'>*</span>
        </label>
      ) : (
        <label htmlFor={name} className="text-gray-800">
          {label}
        </label>
      )}
      <input
        type="checkbox"
        id={name}
        name={name}
        style={{
          height,  
          width,   
        }}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={`rounded-md focus:border-${borderColor}  border-${borderColor} ${disabled ? 'cursor-not-allowed bg-gray-100' : ''}`}
      />

      {error && <div className="font-mono text-xs text-red-700">{error}</div>}
    </div>
  );
};

export default CheckboxInput;
