const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    alumniId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    role: {
        type: String,
        default: 'alumni',
        enum: ['alumni', 'admin'], // restricting possible roles
        required: true
    },
    countryCode: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    hidePhone: {
        type: Boolean,
        default: false
    },
    whatsappNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long']
    },
    graduationYear: {
        type: String,
        required: true,
        enum: Array.from({ length: 15 }, (_, i) => (new Date().getFullYear() - i).toString())
    },
    branch: {
        type: String,
        required: true,
        enum: ['Civil Engineering', 'Computer Science & Engineering', 'Electronics & Communication Engineering', 'Mechanical Engineering', 'Information Science Engineering']
    },
    address: {
        type: String,
        default: ''
    },
    linkedIn: {
        type: String,
        default: ''
    },
    currentPosition: {
        type: String,
        default: 'Not specified'
    },
    company: {
        type: String,
        default: 'Not specified'
    },
    technicalExpertise: {
        type: [String],
        default: []
    },
    education: [{
        degree: String,
        field: String,
        institution: String,
        year: String
    }],
    imageUrl: {
        type: String,
        default: 'default-profile.jpg'
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to check password validity
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 