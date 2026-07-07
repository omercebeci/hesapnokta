import React, { createContext, useContext } from 'react';

const CalculatorContext = createContext(null);

export function CalculatorContextProvider({ value, children }) {
  return <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>;
}

export function useCalculatorContext() {
  return useContext(CalculatorContext);
}
