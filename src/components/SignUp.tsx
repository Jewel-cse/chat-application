import { Input } from "@nextui-org/react";
import React from "react";

export default function SignUp() {
  return (
    <div className="container mx-auto p-2">
      <Input
        type="email"
        label="Email"
        variant="bordered"
        defaultValue="junior2nextui.org"
        isInvalid={true}
        errorMessage="Please enter a valid email"
        className="max-w-xs"
      />
    </div>
  );
}
