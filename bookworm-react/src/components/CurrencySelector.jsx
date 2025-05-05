import React from 'react';
import { useCurrency } from '../contexts/CurrencyContext';

const CurrencySelector = () => {
    const { currency, changeCurrency } = useCurrency();
    return (
        <select
            className="form-select form-select-sm w-auto ms-2"
            value={currency}
            onChange={e => changeCurrency(e.target.value)}
            style={{ minWidth: 80 }}
        >
            <option value="USD">USD</option>
            <option value="VND">VNĐ</option>
        </select>
    );
};

export default CurrencySelector;
