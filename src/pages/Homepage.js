import React from 'react';
import ContactUs from '../components/ContactUs';
import AlumniLogo from '../assets/images/sdmp-logo.png';
import CollegeImage from '../assets/images/sdmpcollege.jpg';

const Homepage = () => {
  return (
    <div className="homepage">
      {/* Our Story Section */}
      <section className="our-story-section">
        <div className="story-container">
          <div className="story-image">
            <img src={CollegeImage} alt="SDM Polytechnic Building" />
          </div>
          <div className="story-content">
            <h2 className="section-title">Our Story</h2>
            <p>SDM Polytechnic was established in the year 2008 and is managed by SDM Educational Society – Ujire.</p>
            <p>The institution offers 3 years 6 Semester Diploma courses in the disciplines of Civil Engineering, Computer Science, Electronics & Communication Engineering and Mechanical Engineering.</p>
            <p>Since its establishment the management has taken huge strides towards enhancing excellence in all spheres of education. We are consistently exerting efforts to develop quality of education including appropriate attitude, behavior, technical and non-technical competencies.</p>
          </div>
        </div>
      </section>

      {/* Alumni Association Section */}
      <section className="alumni-section">
        <div className="alumni-container">
          <div className="alumni-content">
            <h2 className="section-title">Alumni Association</h2>
            <p>SDM Polytechnic has successfully contributed outstanding students over the years. The first batch of alumni graduated in 2011, and since then, unique and talented individuals have enriched society with their technical expertise and soft skills. Many students have excelled in the engineering field, while others have made remarkable achievements in cultural and skill-based domains.</p>
            <p>Together, we are stronger. Let's build this community to support one another, guide future students, and warmly welcome them to the Alumni Association.</p>
          </div>
          <div className="alumni-logo">
            <img src={AlumniLogo} alt="Alumni Association Logo" />
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <ContactUs />
    </div>
  );
};

export default Homepage;
