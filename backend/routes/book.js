const express = require("express");
const booksCtrl = require("../controllers/book");
const auth = require("../middleware/auth");
const router = express.Router();

const { upload, convertImage } = require('../middleware/multer-confg');


// Authentification non requise
router.get('/bestrating', booksCtrl.getBestRating);
router.get('/', booksCtrl.getAllBooks);
router.get('/:id', booksCtrl.getOneBook);

// Authentification requise
router.post('/', auth, upload, convertImage, booksCtrl.createBook);
router.put('/:id', auth, upload, convertImage, booksCtrl.updateBook);
router.delete('/:id', auth, booksCtrl.deleteBook);

router.post('/:id/rating', auth, booksCtrl.createRating);

module.exports = router;