import { createContext, useEffect, useState } from "react";
import { Props } from "./commonModel.ts";

interface DarkState {
  dark: boolean;
  setDark: (dark: boolean) => void;
}

export const DarkModeContext = createContext<DarkState>({
  dark: false,
  setDark: (_) => {},
});

export const DarkModeContextProvider = ({ children }: Props) => {
  const [dark, setDark] = useState<boolean>(false);
  useEffect(() => {
    const isDark = window.localStorage["dark"] === "true";
    setDark(isDark);
    if (isDark) {
      document.body.classList.add("dark");
    }
  }, []);
  return (
    <DarkModeContext.Provider value={{ dark, setDark }}>
      {children}
    </DarkModeContext.Provider>
  );
};
