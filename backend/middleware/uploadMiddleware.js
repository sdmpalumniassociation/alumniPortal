const multer = require('multer');
const { put } = require('@vercel/blob');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

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

// Image compression options
const compressionOptions = {
    jpeg: {
        quality: 80,
        chromaSubsampling: '4:4:4'
    },
    png: {
        compressionLevel: 9,
        quality: 80
    },
    webp: {
        quality: 80
    }
};

// Compress image function
const compressImage = async (buffer, mimetype) => {
    try {
        let sharpInstance = sharp(buffer).withMetadata();

        // Resize if image is too large (e.g., max width 1200px)
        const metadata = await sharpInstance.metadata();
        if (metadata.width > 1200) {
            sharpInstance = sharpInstance.resize(1200, null, {
                withoutEnlargement: true,
                fit: 'inside'
            });
        }

        // Apply compression based on image type
        if (mimetype === 'image/jpeg' || mimetype === 'image/jpg') {
            return await sharpInstance.jpeg(compressionOptions.jpeg).toBuffer();
        } else if (mimetype === 'image/png') {
            return await sharpInstance.png(compressionOptions.png).toBuffer();
        } else if (mimetype === 'image/webp') {
            return await sharpInstance.webp(compressionOptions.webp).toBuffer();
        }

        // For other formats, convert to JPEG
        return await sharpInstance.jpeg(compressionOptions.jpeg).toBuffer();
    } catch (error) {
        console.error('Image compression error:', error);
        throw new Error('Failed to compress image');
    }
};

// Blob upload middleware
const handleBlobUpload = async (req, res, next) => {
    try {
        if (!req.file) {
            return next();
        }

        // Compress the image
        const compressedImageBuffer = await compressImage(req.file.buffer, req.file.mimetype);

        // Generate unique filename
        const fileExt = path.extname(req.file.originalname);
        const fileName = `${crypto.randomBytes(16).toString('hex')}${fileExt}`;

        // Upload compressed image to Vercel Blob
        const { url } = await put(fileName, compressedImageBuffer, {
            access: 'public',
            token: BLOB_TOKEN,
            contentType: req.file.mimetype
        });

        // Add the blob URL to the request
        req.file.location = url;
        console.log('Uploaded compressed image URL:', url);
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