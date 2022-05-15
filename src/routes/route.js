const express = require('express');
const router = express.Router();
const userController = require("../controller/usercontroller");
const bookController = require("../controller/Bookscontroller");
const middleware = require("../Middleware/middleware");
const reviewcontroller=require("../controller/reviewcontroller")


//user Register
router.post("/register",userController.createuser)
router.post('/login',userController.login) //login Phase 2

//Books API
router.post("/books",middleware.authentication,bookController.createBook)
router.get('/books',middleware.authentication,bookController.getbooks)
router.get('/books/:bookId',middleware.authentication,bookController.getbooksbyId)
router.put("/books/:bookId",middleware.authentication,middleware.authorization,bookController.updateBooksById)
router.delete("/books/:bookId",middleware.authentication,middleware.authorization,bookController.deleteBooksById)


//Review API
router.post('/books/:bookId/review',reviewcontroller.createReview)
router.put("/books/:bookId/review/:reviewId",reviewcontroller.updateReview)
router.delete("/books/:bookId/review/:reviewId",reviewcontroller.deleteReview)

//If url is Incorrect
router.post("*", (req,res) =>{

    return res.status(404).send({ msg:"Page Not Found"})
})
router.get("*", (req,res) =>{
    return res.status(404).send({ msg:"Page Not Found"})
})
router.put("*", (req,res) =>{
    return res.status(404).send({ msg:"Page Not Found"})
})

router.delete("*", (req,res) =>{
    return res.status(404).send({ msg:"Page Not Found"})
})

module.exports = router;