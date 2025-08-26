const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err);

  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        error: 'File too large. Maximum size allowed is 25MB.'
      });
    }
    
    return res.status(400).json({
      success: false,
      error: `File upload error: ${err.message}`
    });
  }

  // Custom file filter errors
  if (err.message === 'Only audio files are allowed!') {
    return res.status(400).json({
      success: false,
      error: 'Invalid file type. Please upload an audio file.'
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    error: 'Internal server error. Please try again later.'
  });
};

module.exports = errorHandler;