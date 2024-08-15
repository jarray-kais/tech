import sharp from 'sharp';
import fs from 'fs';

const resizeImages = async (req, res, next) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) return next();

  await Promise.all(
    req.files.map(async (file) => {
      const outputFilePath = `${file.destination}${file.filename}`;

      await sharp(file.path)
        .resize(100, 100)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(outputFilePath);

      fs.unlinkSync(file.path); // Supprimer le fichier original

      // Mettre à jour le chemin du fichier dans req.files pour qu'il soit correct dans les middlewares suivants
      file.path = outputFilePath;
    })
  );
  next();
};
  export default resizeImages ;