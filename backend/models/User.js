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
        required: true
    },
    graduationYear: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    workingAs: {
        type: String,
        default: 'Not specified'
    },
    expertise: {
        type: String,
        default: 'Not specified'
    },
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