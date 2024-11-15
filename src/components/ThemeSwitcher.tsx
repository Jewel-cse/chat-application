"use client";
import { useTheme } from "next-themes";
import { Switch } from "@nextui-org/react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";
  return (
    <div>
      <Switch
        style={{color:'text-cyan-400'}}
        onChange={() => setTheme(isDarkMode ? "light" : "dark")}
        startContent={<FaMoon />}
        endContent={<FaSun />}
      >
        {/* mode : {theme} */}
      </Switch>
    </div>
  );
}
