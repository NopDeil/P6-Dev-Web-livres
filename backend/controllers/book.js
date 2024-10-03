const Book = require("../models/Book");
const fs = require("fs");
const path = require("path");

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ message: error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(400).json({ error }));
};

exports.updateBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        if (req.file) {
          const oldFilename = book.imageUrl.split('/images/')[1];
          fs.unlink(path.resolve('images', oldFilename), (err) => {
              if (err) console.error('Erreur suppression ancienne image :', err);
          });
      }
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.createBook = (req, res, next) => {
  try {
      const bookObject = JSON.parse(req.body.book);
      delete bookObject._id;
      delete bookObject._userId;

      const { title, author, year, genre } = bookObject;

      const book = new Book({
          ...bookObject,
          userId: req.auth.userId,
          title: title,
          author: author,
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
          year: year,
          genre: genre
      });

      book.save()
          .then(() => {
              console.log('Livre créé avec succès');
              res.status(201).json({ message: 'Livre créé avec succès !' });
          })
          .catch(error => {
              console.error('Erreur lors de la sauvegarde du livre :', error);
              res.status(400).json({ error });
          });
  } catch (error) {
      console.error('Erreur dans createBook :', error);
      res.status(400).json({ error: 'Erreur lors de la création du livre' });
  }
};

exports.createRating = async (req, res, next) => {
  try {
    // Validation de la note (rating)
    if (req.body.rating < 1 || req.body.rating > 5) {
      return res.status(400).json({ message: "La note doit être comprise entre 1 et 5 !" });
    }

    // Trouver le livre dans la base de données en fonction de son ID
    const book = await Book.findOne({ _id: req.params.id });

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé !" });
    }

    const ratingObject = { userId: req.auth.userId, grade: req.body.rating };

    // Assurez-vous que book.ratings existe (si jamais c'est undefined)
    if (!book.ratings) {
      book.ratings = [];
    }

    // Ajout de la nouvelle note à la liste des notes
    book.ratings.push(ratingObject);

    // Calcul de la somme des notes
    const totalGrades = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);

    // Calcul de la moyenne des notes
    const averageGrades = totalGrades / book.ratings.length;
    book.averageRating = averageGrades;

    // Sauvegarde les modifications dans MongoDB
    await book.save();

    return res.status(201).json(book);
    
  } catch (error) {
    return res.status(500).json({ error: error.message || "Erreur serveur" });
  }
};

exports.getBestRating = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => {
      if (books.length === 0) {
        return res.status(404).json({ message: "Aucun livre trouvé." });
      }
      res.status(200).json(books); // Réponse avec les livres triés par meilleure note
    })
    .catch((error) => res.status(500).json({ error: "Erreur serveur" }));
};
