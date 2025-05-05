import React from "react";
import { Card, Button } from 'react-bootstrap';
import { useCurrency } from '../contexts/CurrencyContext';
import { formatCurrency } from '../utils/formatCurrency';

const CartSummary = ({ cartTotal, handlePlaceOrder }) => {
    const { currency, exchangeRate } = useCurrency();
    return (
        <Card className="pb-5">
            <div className="bg-light border p-3 mb-3">
                <h6 className="mb-0 text-center fw-bold">
                    Cart Totals
                </h6>
            </div>

            <div className="mb-3 px-5 w-100">
                <div className="p-3 mb-3">
                    <h2 className="mb-0 text-center fw-bold">
                        {formatCurrency(cartTotal ? cartTotal : 0, currency, exchangeRate)}
                    </h2>
                </div>
            </div>

            <div className="px-5 w-100">
                <Button variant="secondary" className="w-100 mt-2" onClick={handlePlaceOrder}>
                    Place order
                </Button>
            </div>
        </Card>
    );
};

export default CartSummary;