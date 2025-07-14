import React from "react";

/**
 * @const AppContext
 */
export const AppContext = React.createContext();

/**
 * @function AddAppContextProvider
 * @param {*} props
 * @returns
 */
export function AppContextProvider({ children }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://trivillinraffaele-hse3g6bfc8acg6ba.westeurope-01.azurewebsites.net';
  const FUNC1_URL = '<fun1 url here>';
  const FUNC2_URL = '<fun2 url here>';

  const value = {
    API_BASE_URL,
    FUNC1_URL,
    FUNC2_URL,
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
}
