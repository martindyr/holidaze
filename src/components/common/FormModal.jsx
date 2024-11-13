import React from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import ModalWrapper from './ModalWrapper';

const FormModal = ({
  show,
  handleClose,
  title,
  formFields,
  handleSubmit,
  formData,
  handleInputChange,
  errorMessage,
  successMessage,
  submitButtonText,
}) => {
  return (
    <ModalWrapper show={show} handleClose={handleClose} title={title}>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        {formFields.map((field) => (
          <Form.Group controlId={`form${field.name}`} key={field.name} className="mb-3">
            <Form.Label>{field.label}</Form.Label>
            {field.type === 'checkbox' ? (
              <Form.Check
                type="checkbox"
                name={field.name}
                checked={formData.meta?.[field.name] || false}
                onChange={handleInputChange}
              />
            ) : (
              <Form.Control
                type={field.type}
                name={field.name}
                value={
                  field.name === 'text'
                    ? Array.isArray(formData.media)
                      ? formData.media.map((item) => item.url).join(', ')
                      : ''
                    : formData[field.name] || ''
                }
                onChange={handleInputChange}
                required={field.required}
                as={field.type === 'textarea' ? 'textarea' : 'input'}
                rows={field.type === 'textarea' ? 3 : undefined}
              />
            )}
          </Form.Group>
        ))}
        <Button variant="primary" type="submit">
          {submitButtonText}
        </Button>
      </Form>
    </ModalWrapper>
  );
};

export default FormModal;
