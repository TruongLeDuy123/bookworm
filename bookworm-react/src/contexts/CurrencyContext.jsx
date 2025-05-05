import React, { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'USD');
    const exchangeRate = 25000;

    const changeCurrency = (cur) => {
        setCurrency(cur);
        localStorage.setItem('currency', cur);
    };

    return (
        <CurrencyContext.Provider value={{ currency, changeCurrency, exchangeRate }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);
