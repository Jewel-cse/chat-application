import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { format, parse } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

interface DateInputFieldProps  {
  name: string;
  label?: string;
  value?: string;
  onChange: (name: string, value: string) => void;
  disabled?: boolean;
  error?: string;
  myicon?: React.ReactNode;
  min?: string;
  max?: string;
  width?: string;
  displayFormat?: string;
  required?: boolean;
  [key: string]: any;
}

const DateInputField: React.FC<DateInputFieldProps> = ({
  name,
  label,
  value,
  onChange,
  disabled = false,
  error,
  myicon,
  min,
  max,
  width = "full",
  displayFormat = "dd-MMM-yyyy",
  required,
  ...rest
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (value) {
      const parsedDate = parse(value, "yyyy-MM-dd", new Date());
      setSelectedDate(parsedDate);
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedValue = format(date, "yyyy-MM-dd");
      onChange(name, formattedValue);
    } else {
      onChange(name, "");
    }
  };

  // Determine if we are in year picker mode
  const isYearPicker = displayFormat === "YYYY";

  return (
    <div className={`flex flex-col items-center gap-2 p-1 md:flex-row`}>
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
      <div className="relative">
        <DatePicker
          id={name}
          name={name}
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat={isYearPicker ? "yyyy" : displayFormat} // Set the date format based on displayFormat
          className={`${width === "full"
              ? "custom-datefield-style-1"
              : "custom-datefield-style-2"
            }
    ${error ? "ring-red-500 focus:ring-red-500" : "focus:ring-indigo-600"}
    ${disabled ? "cursor-not-allowed bg-gray-50" : ""}
`}
          minDate={min ? parse(min, "yyyy-MM-dd", new Date()) : undefined}
          maxDate={max ? parse(max, "yyyy-MM-dd", new Date()) : undefined}
          disabled={disabled}
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={100}
          showYearPicker={isYearPicker}
          {...rest}
        />
        <input type="hidden" name={name} value={value} />
        {myicon && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            {myicon}
          </div>
        )}
        {error && <div className="font-mono text-xs text-red-700">{error}</div>}
      </div>
    </div>
  );
};

export default DateInputField;
