import React, { createContext, useEffect, useReducer } from 'react';
export const AdminContext = createContext();
const reducer = (state, action) => {
  switch (action.type) {
    case 'ADMINLOGIN':
      return { admin: action.payload };
    case 'ADMINLOGOUT':
      return { admin: null };
    default:
      return state;
  }
};
const AdminContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { admin: null });
  useEffect(() => {
    const admin = localStorage.getItem('admin');
    dispatch({ type: 'ADMINLOGIN', payload: JSON.parse(admin) });
  }, []);

  return (
    <AdminContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
