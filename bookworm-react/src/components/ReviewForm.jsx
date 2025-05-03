import React from 'react';
import { Form, Button } from 'react-bootstrap';

const ReviewForm = ({ title, detail, rating, handleTitle, handleDetail, handleRating, handleSubmit }) => {
    return (
        <Form className="px-4 pb-4" onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Add a title</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter review title"
                    required
                    maxLength={120}
                    value={title}
                    onChange={handleTitle}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Details please! Your review helps other shoppers.</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Write your review here..."
                    value={detail}
                    onChange={handleDetail}
                />
            </Form.Group>

            <Form.Group className="mb-4">
                <Form.Label>Select a rating star</Form.Label>
                <Form.Select value={rating} onChange={handleRating}>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                </Form.Select>
            </Form.Group>

            <hr className="w-100" />
            <div className="px-1">
                <Button variant="secondary" className="w-100 fw-bold" type="submit">
                    Submit Review
                </Button>
            </div>
        </Form>
    );
};

export default ReviewForm;