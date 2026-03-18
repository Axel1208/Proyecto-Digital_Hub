const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadPath = "uploads";

// 🔥 Crear carpeta si no existe
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const nombre = Date.now() + path.extname(file.originalname);
        cb(null, nombre);
    }
});

const upload = multer({ storage });

module.exports = upload;