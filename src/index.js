import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminContextProvider from './Context/AdminContextProvider';
import CategoryContextProvider from './Context/CategoryContextProvider';
import ProductContextProvider from './Context/ProductContextProvider';
import HomeContextProvider from './Context/HomeContextProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HomeContextProvider>
      <ProductContextProvider>
        <CategoryContextProvider>
          <AdminContextProvider>
            <App />
          </AdminContextProvider>
        </CategoryContextProvider>
      </ProductContextProvider>
    </HomeContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
