const multer = require('multer');
const { put } = require('@vercel/blob');
const path = require('path');
const crypto = require('crypto');

// Configure Blob token
const BLOB_TOKEN = "vercel_blob_rw_NY2fsuWtZwIQ1T6s_qeDP2lGd2K7r4NPEunqsgPc2KdUVYl";

// Configure memory storage instead of disk storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

// Create multer upload instance
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
    },
    fileFilter: fileFilter
});

// Blob upload middleware
const handleBlobUpload = async (req, res, next) => {
    try {
        if (!req.file) {
            return next();
        }

        // Generate unique filename
        const fileExt = path.extname(req.file.originalname);
        const fileName = `${crypto.randomBytes(16).toString('hex')}${fileExt}`;

        // Upload to Vercel Blob with token
        const { url } = await put(fileName, req.file.buffer, {
            access: 'public',
            token: BLOB_TOKEN,
            contentType: req.file.mimetype
        });

        // Add the blob URL to the request
        req.file.location = url;
        console.log(url);
        next();
    } catch (error) {
        next(error);
    }
};

// Error handling middleware
const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File is too large. Maximum size is 5MB'
            });
        }
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    next();
};

module.exports = {
    upload,
    handleBlobUpload,
    handleUploadError
}; 