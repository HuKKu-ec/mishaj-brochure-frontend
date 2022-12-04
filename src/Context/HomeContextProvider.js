import React, { createContext, useReducer } from 'react';

export const HomeContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'GETALLPRODUCTS':
      return { products: action.payload };
    // category: action.payload,
    default:
      return state;
  }
};
const HomeContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { products: null });

  return (
    <HomeContext.Provider value={{ ...state, dispatch }}>
      {children}
    </HomeContext.Provider>
  );
};
export default HomeContextProvider;
