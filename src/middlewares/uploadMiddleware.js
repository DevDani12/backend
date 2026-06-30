const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "..", "..", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure disk storage properties
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generates a unique timestamped filename to prevent naming collisions
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
    );
  },
});

/**
 * Validates file signatures/extensions to ensure only secure image files are uploaded.
 */
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|webp/;

  // Check extension name
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  // Check MIME type
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Security Alert: Only image files (.jpg, .jpeg, .png, .webp) are allowed!",
      ),
      false,
    );
  }
};

// Initialize multer config
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // Strict 3MB limit per upload
  },
  fileFilter: fileFilter,
});

module.exports = upload;
