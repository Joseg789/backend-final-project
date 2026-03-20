const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// storage cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "tienda-ropa",
    resource_type: "image",
  },
});

// validación formato
const fileFilter = (req, file, cb) => {
  const tiposPermitidos = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/gif",
  ];

  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Formato de imagen no permitido. Solo JPG, PNG, WEBP, AVIF o GIF",
      ),
      false,
    );
  }
};

// middleware upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

module.exports = upload;
