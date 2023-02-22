const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

//get books sin promises
// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   res.send(JSON.stringify(books,null,4));
// });


public_users.get('/',function (req, res) {
    const findBooks = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });
  });

// Get book details based on ISBN
// get books por ISBN sin usar promises
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;
//   if (books.hasOwnProperty(isbn)) {
//     res.json(books[isbn]);
//   } else {
//     res.status(404).json({message: 'Book not found'});
//   }
// });
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const findISBN = new Promise((resolve, reject) => {
      if (books.hasOwnProperty(isbn)) {
        resolve(books[isbn]);
      } else {
        reject({message: 'Book not found'});
      }
    });
    findISBN.then((result) => res.json(result)).catch((err) => res.status(404).json(err));
  });
  
// Get book details based on author
//get books by author sin promises
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   const author = req.params.author;
//   const book = Object.values(books).find((book) => book.author === author);
//   if (book) {
//     return res.status(200).json(book);
//   } else {
//     return res.status(404).json({message: "Book not found"});
//   }
// });

public_users.get('/author/:author',function (req, res) {
    //Write your code here
const author = req.params.author;
const findAuthor = new Promise((resolve, reject) => {
    const book = Object.values(books).find((book) => book.author === author);
    if (book) {
      resolve(book);
    } else {
      reject(new Error('Book not found'));
    }
  });
  findAuthor
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({ message: error.message });
    });
  });

// Get all books based on title
// get books by author sin promises
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   const title = req.params.title;
//   const book = Object.values(books).find((book) => book.title === title);
//   if (book) {
//     return res.status(200).json(book);
//   } else {
//     return res.status(404).json({message: "Book not found"});
//   }
// });

public_users.get('/title/:title',function (req, res) {
    //Write your code here
    const title = req.params.title;
const findTitle = new Promise((resolve, reject) => {
    const book = Object.values(books).find((book) => book.title === title);
    if (book) {
      resolve(book);
    } else {
      reject(new Error('Book not found'));
    }
  });
  findTitle
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({ message: error.message });
    });
  });

//  Get book review
// get book reviews by isbn sin promises
// public_users.get('/review/:isbn',function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;
//   const book = books[isbn];
//   if (book) {
//     const reviews = book.reviews;
//     return res.status(200).json(reviews);
//   } else {
//     return res.status(404).json({message: "Book not found"});
//   }
// });

public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
  const book = books[isbn];
  const findReview = new Promise((resolve, reject) => {
    if (book) {
      resolve(book.reviews);
    } else {
      reject({message: "Book not found"});
    }
  });
  findReview.then(reviews => {
    return res.status(200).json(reviews);
  }).catch(error => {
    return res.status(404).json(error);
  });
  });

module.exports.general = public_users;
