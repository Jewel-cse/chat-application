'use client';

import React, { useEffect, useState } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropdownInputProps {
  name: string;
  label: string | { __html: string }; // Allow HTML labels
  options: { label: string; value: any }[];
  value?: any[];
  onChange: (name: string, value: any[]) => void;
  disabled?: boolean;
  myicon?: React.ReactNode;
  error?: string;
}

const DropdownInputMultiSelect: React.FC<DropdownInputProps> = ({
  name,
  label,
  options,
  value = [],
  onChange,
  disabled = false,
  myicon,
  error,
}) => {
  const handleSelect = (selectedValue: any) => {
    const updatedValue = value.includes(selectedValue)
      ? value.filter((v) => v !== selectedValue)
      : [...value, selectedValue];
    onChange(name, updatedValue);
  };

  return (
    <div className="flex w-full flex-col items-center gap-2 p-1 md:flex-row">
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
      <div className="">
        <DropdownMenuPrimitive.Root>
          <DropdownMenuPrimitive.Trigger
            className={cn(
              'custom-dropdown-style-1 m-0 flex items-center justify-between p-2',
              disabled ? 'cursor-not-allowed bg-gray-50' : '',
            )}
            disabled={disabled}
          >
            {/*<span>{value.length ? value.map(val => options.find(opt => opt.value === val)?.label).join(', ') : 'Select values'}</span>*/}
            {/*{myicon && (*/}
            {/*    <span className="ml-2">{myicon}</span>*/}
            {/*)}*/}
            {'Select ' + label} <ChevronDownIcon className="ml-2 h-4 w-4" />
          </DropdownMenuPrimitive.Trigger>
          <DropdownMenuPrimitive.Content
            className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
            sideOffset={4}
          >
            {options.map((option, index) => (
              <DropdownMenuPrimitive.CheckboxItem
                key={index}
                className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground"
                checked={value.includes(option.value)}
                onCheckedChange={() => handleSelect(option.value)}
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  <DropdownMenuPrimitive.ItemIndicator>
                    <Check className="h-4 w-4" />
                  </DropdownMenuPrimitive.ItemIndicator>
                </span>
                {option.label}
              </DropdownMenuPrimitive.CheckboxItem>
            ))}
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Root>
        {error && <div className="font-mono text-xs text-red-700">{error}</div>}
      </div>
    </div>
  );
};

export default DropdownInputMultiSelect;
