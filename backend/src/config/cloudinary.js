const cloudinary = require('cloudinary').v2;

cloudinary.config(true); // Automatically uses CLOUDINARY_URL from env

module.exports = cloudinary;
