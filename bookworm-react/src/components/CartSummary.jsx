import React from "react";
import { Card, Button } from 'react-bootstrap';

const CartSummary = ({ cartTotal, handlePlaceOrder }) => {
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
                        ${cartTotal ? cartTotal.toFixed(2) : 0}
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