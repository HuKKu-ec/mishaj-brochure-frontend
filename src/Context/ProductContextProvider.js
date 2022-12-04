import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AdminContext } from './AdminContextProvider';

export const ProductContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'GETALLPRODUCTS':
      return { products: action.payload };
    // category: action.payload,

    case 'ADDPRODUCT':
      return {
        products: [...state.products, action.payload],
      };

    case 'DELETEPRODUCT':
      return {
        products: [
          ...state.products.filter((data) => data._id !== action.payload._id),
        ],
      };
    case 'DELETEPRODUCTSONCATEGORYDELETE':
      return {
        products: [
          ...state.products.filter(
            (data) => data.category !== action.payload.category
          ),
        ],
      };
    default:
      return state;
  }
};
const ProductContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { products: null });



  return (
    <ProductContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};
export default ProductContextProvider;
