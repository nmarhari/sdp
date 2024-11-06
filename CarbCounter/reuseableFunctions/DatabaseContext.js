// DatabaseContext.js
import React, { createContext, useContext } from 'react';
import { initDB } from '../reuseableFunctions/dbInit';

// Initialize the database
const db = initDB();

// Create a context with `db` as the default value
const DatabaseContext = createContext(db);

// Custom hook for accessing the database
export const useDatabase = () => {
  return useContext(DatabaseContext);
};

// Provider component to wrap your app
export const DatabaseProvider = ({ children }) => {
  return (
    <DatabaseContext.Provider value={db}>
      {children}
    </DatabaseContext.Provider>
  );
};
