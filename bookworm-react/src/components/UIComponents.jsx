import React from 'react';
import { Spinner } from 'react-bootstrap';

export const LoadingSpinner = () => (
    <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" variant="secondary" />
    </div>
);

export const EmptyState = ({ message }) => (
    <p className="text-center text-muted">{message}</p>
);