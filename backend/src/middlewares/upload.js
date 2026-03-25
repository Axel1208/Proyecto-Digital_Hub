const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 📂 Carpeta uploads
const uploadPath = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// ⚙️ Configuración almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// 🔒 SOLO EXCEL Y CSV
const fileFilter = (req, file, cb) => {
  const extensionesPermitidas = [".xlsx", ".csv"];

  const ext = path.extname(file.originalname).toLowerCase();

  const mimeValido =
    file.mimetype.includes("spreadsheetml") || // excel
    file.mimetype.includes("csv") || // csv
    file.mimetype.includes("text"); // algunos csv vienen como text/plain

  if (extensionesPermitidas.includes(ext) && mimeValido) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos Excel (.xlsx) o CSV (.csv)"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

module.exports = upload;