import React from 'react';
import ContactUsForm from './ContactUsForm';

const ContactUs = () => {
  return (
    <section className="contact-section">
      <h2 className="contact-title">Contact Us</h2>
      <p className="contact-subtitle">Share your Ideas, thoughts, achievements, everything. We all will hear it..! <br /> or Write us directly to <a href="mailto:sdmpalumniassociation@gmail.com">sdmpalumniassociation@gmail.com</a></p>

      <ContactUsForm />
    </section>
  );
};

export default ContactUs;
