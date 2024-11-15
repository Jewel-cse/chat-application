"use client";
import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";
import { Switch } from "@nextui-org/react";

export default function Header() {
  return (
    <div className="flex sticky top-0 z-10 flex-col">
      <div className="w-full absolute text-blue-550 z-10 ">
        <nav className=" flex flex-wrap items-center justify-between mx-auto p-4 ">
          <Link className="font-bold text-3xl hover:text-blue-700" href="/">
            Home
          </Link>
          <div className="space-x-4 flex">
            <Link
              className="items-center hover:text-blue-700 hover:shadow-sm rounded-md p-1"
              href="/#"
            >
              About us
            </Link>
            <Link
              className="items-center hover:text-blue-700 hover:shadow-sm rounded-md p-1"
              href="/home"
            >
              Sign in
            </Link>
            <Link
              className="items-center hover:text-blue-700 hover:shadow-sm rounded-md p-1"
              href="/home"
            >
              Sign up
            </Link>
            <ThemeSwitcher />
          </div>
          
        </nav>
      </div>
    </div>
  );
}
