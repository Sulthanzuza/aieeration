const multer = require('multer');

// Configure multer for in-memory storage
const storage = multer.memoryStorage();

// File filter to accept only audio files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error('Only audio files are allowed!'), false);
  }
};

// Configure multer with size limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  },
});

module.exports = upload;