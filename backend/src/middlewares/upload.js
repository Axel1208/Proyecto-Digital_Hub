const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 📂 Asegurar carpeta uploads
const uploadPath = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// ⚙️ Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// 🔍 Filtro de archivos (solo imágenes)
const fileFilter = (req, file, cb) => {
  const tiposPermitidos = /jpeg|jpg|png/;

  const ext = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
  const mime = tiposPermitidos.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes (jpg, jpeg, png)"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;