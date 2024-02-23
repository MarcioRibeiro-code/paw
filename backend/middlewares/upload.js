const multer = require('multer');
const path = require('path');

// Set the storage engine and destination folder
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function (req, file, callback) {
    // Generate a unique filename by adding a timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Append the file extension
    const extension = path.extname(file.originalname);
    callback(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

module.exports = upload;
