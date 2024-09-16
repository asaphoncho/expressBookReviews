const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session')

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const validUser = users.filter((user) => {return (user.username == username && user.password == password)})
  if(validUser.length > 0){
    return true
  }
  else{ return false}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  if(username && password){
    if(authenticatedUser(username, password)){
      let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60*60});

    // Store access token and username in session
    req.session.authorization = {
        accessToken, username
    }
    console.log(req.session.authorization.username)
    return res.status(200).send("User successfully logged in");
    }
    else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
  }
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.post("/auth/review/:isbn", (req, res) => {
  console.log("Request body:", req.body);

  if(req.session.authorization){
    const username = req.session.authorization.username;
    const review = req.body.review
    const ISBN = req.params.isbn
    const book = Object.values(books).find((book) => book.ISBN == ISBN)
    
    // Check if the book exists
    if (book) {
      book.reviews.push({"Username":username, "Review":review})
      // Add review (both username and review content)
      return res.status(200).json({ message: "Review Added!" });
    } else {
      return res.status(404).json({ message: "Book not found!" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized to add review!" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
