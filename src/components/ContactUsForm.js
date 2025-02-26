import React, { useState } from 'react';

const ContactUsForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="contact-form-container">
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="input-row">
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="form-input"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email ID"
            className="form-input"
            required
          />
        </div>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="We hear you...!"
          className="form-textarea"
          required
        />
        <button type="submit" className="form-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactUsForm;
