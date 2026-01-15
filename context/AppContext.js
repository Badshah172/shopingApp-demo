import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState({}); // { productId: quantity }

  const updateCart = (id, qty) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (qty <= 0) delete newCart[id];
      else newCart[id] = qty;
      return newCart;
    });
  };

  return (
    <AppContext.Provider value={{ cart, updateCart }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);