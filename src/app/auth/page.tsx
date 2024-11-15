"use client";

import React, { useState, useEffect } from "react";
import { Input, Button, Checkbox } from "@nextui-org/react";
import { useLoginMutation } from "../../store/ApiSlices/authApiSlice";
import { FaSpinner } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setToken } from "../../store/reducers/authReducer";

export default function AuthPage() {
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [rememberPassword, setRememberPassword] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("Submit form data: ", formData);
      const response = await login(formData).unwrap();
      console.log("Response from server: ", response?.response.body);


      const { accessToken, publicId, username, email, roles } = response.response.body;

      dispatch(setToken(accessToken));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("username", username);
      localStorage.setItem("publicId", publicId);
      localStorage.setItem("email", email);
      localStorage.setItem("roles", roles);

      window.location.href = '/chat';

    } catch (error) {
      console.log("Error during login: ", error);
      //alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-end min-h-screen bg-gradient-to-r from-blue-800 to-blue-100 px-4">
      <div className="container mx-auto bg-white dark:bg-black rounded-2xl shadow-xl py-8 px-6 w-full max-w-sm">
        <div className="flex justify-between mb-6">
          <button
            className={`text-lg font-semibold ${isSignUp ? "text-blue-600" : "text-gray-400"}`}
            onClick={() => setIsSignUp(true)}
          >
            Sign Up
          </button>
          <button
            className={`text-lg font-semibold ${!isSignUp ? "text-blue-600" : "text-gray-400"}`}
            onClick={() => setIsSignUp(false)}
          >
            Sign In
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {isSignUp ? (
            <>
              <h2 className="text-2xl font-semibold text-center mb-4 dark:text-white">Create An Account</h2>
              <Input
                className="mb-4 shadow-lg rounded-lg"
                name="fullName"
                placeholder="Full Name"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                fullWidth
                isClearable
              />
              <Input
                className="mb-4 shadow-lg rounded-lg"
                name="email"
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                isClearable
              />
              <Input
                className="mb-4 shadow-lg rounded-lg"
                name="password"
                placeholder="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
              />
              <Button
                type="submit"
                className="w-full mb-4 bg-blue-600 shadow-lg rounded-lg"
                color="primary"
                size="lg"
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-center mb-4">Welcome Back!</h2>
              <Input
                className="mb-4 shadow-lg rounded-lg"
                name="username"
                placeholder="User Name"
                type="text"
                value={formData.username}
                onChange={handleChange}
                fullWidth
              />
              <Input
                className="mb-4 shadow-lg rounded-lg"
                name="password"
                placeholder="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
              />
              <div className="flex justify-between items-center mb-4">
                <Checkbox
                  size="sm"
                  color="primary"
                  checked={rememberPassword}
                  onChange={(e) => setRememberPassword(e.target.checked)}
                >
                  <span className="text-black dark:text-white">Remember Password</span>
                </Checkbox>
                <a href="#" className="text-red-700 text-sm px-2 ">
                  Forget Password?
                </a>
              </div>
              <Button
                type="submit"
                className="w-full mb-4 bg-blue-700"
                color="primary"
                size="lg"
                disabled={loginLoading} // Disable button if loading
              >
                Sign In
                {loginLoading && <FaSpinner className="ml-3 animate-spin" />}
              </Button>
            </>
          )}
        </form>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <span className="mx-4 text-gray-900 dark:text-white">
            Or sign {isSignUp ? "up" : "in"} with
          </span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        <div className="flex justify-center gap-4 mb-4">
          <Button
            size="lg"
            className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 dark:text-black shadow-lg"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              width="20"
              height="20"
            />
            Google
          </Button>

          <Button
            size="lg"
            className="flex items-center gap-2 bg-blue-700 text-white border border-[#1877F2] hover:bg-[#145DBF] shadow-lg"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
              alt="Facebook"
              width="20"
              height="20"
            />
            Facebook
          </Button>
        </div>
      </div>
    </div>
  );
}
