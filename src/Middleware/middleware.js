const jwt = require("jsonwebtoken");
const BookModel = require("../Models/BooksModel");
const mongoose = require("mongoose");


//............................................MIDDLEWARE-FOR AUTHENTICATION..........................................................

const authentication = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"] || req.headers["x-Api-Key"];

    if (!token) {
      return res.status(401).send({ status: false, msg: "Token must be Present" });
    }

    let decodedtoken = jwt.verify(token, "group51"); // to verify that signature is valid or not
    if(!decodedtoken) return res.status(401).send({status:false,msg:"Incorrect token"})
    next();
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};




//............................................MIDDLEWARE-FOR AUTHORIZATION..........................................................


const authorization = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"] || req.headers["x-Api-Key"]; //token has jwt token

    const id = req.params.bookId;

    if (id) {
      let isValidbookId = mongoose.Types.ObjectId.isValid(id);
      if (!isValidbookId) {
        return res.status(400).send({ status: false, msg: "bookId is Not Valid type of ObjectId" });
      }
    }

    const findbookdatabyId = await BookModel.findById(id).select({ userId: 1 })
    //console.log(findbookdatabyId)
    if (!findbookdatabyId) {
      return res.status(400).send({ status: false, msg: "Incorrect BookId" });
    }

    let decodedtoken = jwt.verify(token, "group51");
    if(!decodedtoken) return res.status(401).send({status:false,msg:"Incorrect token"})
    if (decodedtoken.UserId != findbookdatabyId.userId)
      return res.status(403).send({ status: false, msg: "Sorry,You cannot access" });

    next(); //if match then move the execution to next
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};


module.exports.authentication = authentication
module.exports.authorization = authorization
