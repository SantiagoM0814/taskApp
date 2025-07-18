import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pathImg = '../data/uploads';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
  const dir = path.join(__dirname, pathImg);

  // Crear carpeta si no existe
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  cb(null, dir);
},
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: fileFilter
});

export const uploadFile=[
  upload.array('files', 5), // 'file' is the name of the form field
  (req, res) => {
    try {
      if(!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded.' });
      }

      const filePaths = req.files.map(file => file.path);

      res.status(200).json({
        message: 'Files uploaded successfully',
        files: filePaths
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error uploading files.' });
    }

  } 
];