import React from 'react'
import NavBar from '../components/NavBar'
import facultyData from '../assets/data/Faculties.json'

// Import all faculty images
const importAll = (r) => {
    let images = {};
    r.keys().forEach((item) => {
        const name = item.replace('./', '').split('.')[0];
        images[name] = r(item);
    });
    return images;
};

// Import all images from the assets/images directory
const images = importAll(require.context('../assets/images', false, /\.(png|jpe?g|svg)$/));

function Faculties() {
    // Find principal's data
    const principal = facultyData.find(faculty => faculty.designation === "Principal");

    // Group faculty members by branch (excluding principal)
    const facultyByBranch = facultyData
        .filter(faculty => faculty.designation !== "Principal")
        .reduce((acc, faculty) => {
            if (!acc[faculty.branch]) {
                acc[faculty.branch] = [];
            }
            acc[faculty.branch].push(faculty);
            return acc;
        }, {});

    // Helper function to get image source
    const getImageSrc = (profilePhoto) => {
        try {
            const imageName = profilePhoto.split('/').pop().split('.')[0];
            // Check if the image exists in our imported images
            if (images[imageName]) {
                return images[imageName];
            }
            // If image doesn't exist, return default user image
            return images['default-user'] || '/default-user.png';
        } catch (error) {
            // If there's any error in processing the image path, return default
            return images['default-user'] || '/default-user.png';
        }
    };

    return (
        <div className="user-homepage">
            <NavBar />
            <main className="user-content">
                <div className="faculties-content">
                    <h1 className="section-title">Our Faculties</h1>

                    {/* Principal Card */}
                    {principal && (
                        <div className="principal-section">
                            <div className="principal-card">
                                <div className="faculty-image">
                                    <img
                                        src={getImageSrc(principal.profilePhoto)}
                                        alt={principal.fullName}
                                        onError={(e) => {
                                            e.target.src = images['default-user'] || '/default-user.png';
                                        }}
                                    />
                                </div>
                                <div className="faculty-info">
                                    <h3 className="faculty-name">
                                        {principal.fullName}
                                        <span className="principal-tag">Principal</span>
                                    </h3>
                                    <div className="faculty-contact">
                                        <p>
                                            <i className="fas fa-phone"></i>
                                            {principal.phoneNumber}
                                        </p>
                                        <p>
                                            <i className="fas fa-envelope"></i>
                                            {principal.emailId}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {Object.entries(facultyByBranch).map(([branch, facultyMembers]) => (
                        <div key={branch} className="department-section">
                            <h2 className="department-title">{branch}</h2>
                            <div className="faculties-grid">
                                {facultyMembers.map((faculty, index) => (
                                    <div key={index} className="faculty-card">
                                        <div className="faculty-image">
                                            <img
                                                src={getImageSrc(faculty.profilePhoto)}
                                                alt={faculty.fullName}
                                                onError={(e) => {
                                                    e.target.src = images['default-user'] || '/default-user.png';
                                                }}
                                            />
                                        </div>
                                        <div className="faculty-info">
                                            <h3 className="faculty-name">
                                                {faculty.fullName}
                                                {faculty.designation.includes('Head of Department') && (
                                                    <span className="hod-tag">(HOD)</span>
                                                )}
                                            </h3>
                                            <p className="faculty-designation">{faculty.designation}</p>
                                            <div className="faculty-contact">
                                                <p>
                                                    <i className="fas fa-phone"></i>
                                                    {faculty.phoneNumber}
                                                </p>
                                                <p>
                                                    <i className="fas fa-envelope"></i>
                                                    {faculty.emailId}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default Faculties