const express = require("express");
const booksCtrl = require("../controllers/book");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-confg");
const resizeImage = require("../middleware/resizeImage");
const router = express.Router();

router.get("/", booksCtrl.getAllBooks);
router.get("/:id", booksCtrl.getOneBook);
router.get("/bestrating", booksCtrl.getBestRating);
router.post("/", auth, multer, resizeImage, booksCtrl.createBook);
router.post("/:id/rating", auth, booksCtrl.createRating);
router.put("/:id", auth, multer, resizeImage, booksCtrl.updateBook);
router.delete("/:id", auth, booksCtrl.deleteBook);
module.exports = router;