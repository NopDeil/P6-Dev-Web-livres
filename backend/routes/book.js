const express = require("express");
const booksCtrl = require("../controllers/book");
const auth = require("../middleware/auth");
const router = express.Router();
const multer = require("../middleware/multer-confg")

router.get("/", booksCtrl.getAllBooks);
router.get("/:id", booksCtrl.getOneBook);
router.post("/", auth, multer, booksCtrl.createBook);
router.put("/:id", auth, multer, booksCtrl.updateBook);
router.delete("/:id", auth, booksCtrl.deleteBook);
module.exports = router;