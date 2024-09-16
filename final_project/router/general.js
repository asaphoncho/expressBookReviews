const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let existingUser = users.filter((user) => {return user.username === username})
  if(existingUser.length > 0){
    return true
  }
  else{return false}
}

public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password
  if(username && password){
    if(!doesExist(username)){
      users.push({"username" : username, "password" : password})
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    }
    else{return res.status(200).json({message: "User already exists"});}
  }
  
});

// Get the book list available in the shop
/*public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4))
});*/

// Get book details based on ISBN
/*public_users.get('/isbn/:isbn',function (req, res) {
  const ISBN = req.params.isbn
  const searched_book = Object.values(books).find((book) => book.ISBN === ISBN)

  res.send(searched_book)
 });*/
  
// Get book details based on author
/*public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  const searched_book = Object.values(books).find((book) => book.author.toLowerCase() == author.toLowerCase())

  res.send(searched_book)
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});*/

// Get all books based on title
/*public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  const searched_book = Object.values(books).find((book) => book.title == title)

  res.send(searched_book)
});*/

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn
  const searched_book = Object.values(books).find((book) => book.ISBN === ISBN)
  let reviews = searched_book.reviews

  res.send(reviews)
});

function getAllBooks(){
  return new Promise((resolve,reject)=>{
    resolve(books);
  })
}

public_users.get('/',function (req, res) {
  getAllBooks().then(
    (book)=>res.send(JSON.stringify(book, null, 4)),
    (error) => res.send("request failed")
  );  
});

function getBookIsbn(isbn){
  return new Promise((resolve, reject)=>{
    const foundBooks = Object.values(books).find((book) => book.ISBN === isbn)
    if(foundBooks){
      resolve(foundBooks)
    }
  })
}

public_users.get('/isbn/:isbn', function(req, res){
  const ISBN = req.params.isbn
  getBookIsbn(ISBN).then(
    result => res.send(result)
  )
})

function getBookAuthor(author){
  return new Promise((resolve, reject)=>{
    const foundBooks = Object.values(books).find((book) => book.author === author)
    if(foundBooks){
      resolve(foundBooks)
    }
  })
}

public_users.get('/author/:author', function(req, res){
  const author = req.params.author
  getBookAuthor(author).then(
    result => res.send(result)
  )
})

function getBooksTitle(title){
  return new Promise((resolve, reject)=>{
    const foundBooks = Object.values(books).find((book)=> book.title == title)
    if(foundBooks){
      resolve(foundBooks)
    }
  })
}

public_users.get('/title/:title', function(req, res){
  const title = req.params.title
  getBooksTitle(title).then(
    result => res.send(result)
  )
})
module.exports.general = public_users;
