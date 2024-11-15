import React from "react";
import { Input } from "@nextui-org/react";

interface EmailFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const EmailField: React.FC<EmailFieldProps> = ({
  name,
  label,
  value,
  onChange,
  error,
}) => {
  const validateEmail = (value: string) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);

  const isInvalid = React.useMemo(() => {
    if (value === "") return false;
    return !validateEmail(value);
  }, [value]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Input
      name={name}
      value={value}
      type="email"
      label={label}
      variant="bordered"
      isInvalid={isInvalid}
      color={isInvalid ? "danger" : "primary"}
      errorMessage={isInvalid ? error : undefined}
      onChange={handleEmailChange}
      className="max-w-xs h-8 "
     
    />
  );
};

export default EmailField;
