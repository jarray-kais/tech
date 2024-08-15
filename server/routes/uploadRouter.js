import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const destinationFolder = 
  file.fieldname === 'logo' ? 'uploads/logo/' :
  file.fieldname === 'image' ? 'uploads/products/' :
  'uploads/profiles/';
    cb(null, destinationFolder);
  },
  // Définir le nom du fichier téléchargé
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname); // Extraire l'extension du fichier
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);

  }
});

const fileFilter = (req, file, cb) => {
  // Vérifier si le type de fichier est une image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed')); // Rejeter le téléchargement du fichier
  }
};

// Créer un middleware Multer avec la configuration définie
export const upload = multer({ storage , fileFilter });