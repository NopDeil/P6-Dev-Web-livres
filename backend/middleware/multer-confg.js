// module.exports = { upload, convertImage };
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const MIME_TYPES = {
    'image/jpg': 'webp',
    'image/jpeg': 'webp',
    'image/png': 'webp',
    'image/webp': 'webp',
};

// Utilisation de la mémoire pour le stockage temporaire des images téléchargées
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype];
        if (!extension) {
            return callback(new Error('Invalid file type'), false);
        }
        callback(null, true);
    }
}).single('image');

const convertImage = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        const fileNameWithoutExt = req.file.originalname.replace(/\.[^/.]+$/, "").split(' ').join('_');
        const newFileName = `resized_${fileNameWithoutExt}_${Date.now()}.webp`;

        // Conversion et redimensionnement de l'image en WebP
        await sharp(req.file.buffer)
            .resize({ width: 206, height: 260, fit: 'inside' })  // Redimensionne l'image à 206x260
            .webp({ quality: 60, smartSubsample: true })  // Conversion en WebP avec une qualité de 60
            .toFile(path.join('images', newFileName));  // Sauvegarde dans le dossier images

        // Mise à jour des informations du fichier dans req.file
        req.file.filename = newFileName;
        req.file.path = path.join('images', newFileName);
        req.file.mimetype = 'image/webp';
        req.file.destination = 'images';

        next();
    } catch (error) {
        console.error('Erreur lors de la transformation de l\'image :', error);
        return res.status(500).json({ error: 'Erreur lors de la transformation de l\'image.' });
    }
};

module.exports = { upload, convertImage };