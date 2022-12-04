import React, { createContext, useEffect, useReducer } from 'react';
export const CategoryContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'GETALLCATEGORY':
      return { categorys: action.payload };
    // category: action.payload,

    case 'ADDCATEGORY':
      return {
        categorys: [...state.categorys, action.payload],
      };

    case 'DELETECATEGORY':
      return {
        categorys: [
          ...state.categorys.filter((data) => data._id !== action.payload._id),
        ],
      };

    default:
      return state;
  }
};
const CategoryContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { categorys: null });

  return (
    <CategoryContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CategoryContext.Provider>
  );
};
export default CategoryContextProvider;
