const BookModel = require("../Models/BooksModel");
const userModel = require("../Models/usermodel");
const reviewModel = require("../Models/reviewmodel");
const mongoose = require("mongoose");

//STRING VALIDATION BY REJEX
const validatefeild = (shivam) => {
  return String(shivam)
    .trim()
    .match(/^[a-zA-Z]/);
};

const createReview = async (req, res) => {
  try {
    const id = req.params.bookId
    let data = req.body

    if (Object.keys(data).length == 0) {
      return res.status(400).send({
        status: false, msg: "Feild Can't Empty.Please Enter Some Details",
      });
    }


    const obj = {
      reviewedAt: new Date(),
    };
    const bookId = id;
    const reviewedBy = data.reviewedBy;
    const rating = data.rating;
    const review = data.review;
    const isDeleted = data.isDeleted;
    if (!id) {
      return res.status(400).send({ status: false, msg: "Please Give bookId" });
    }
    obj.bookId = id

    let isValidbookId = mongoose.Types.ObjectId.isValid(bookId); //return true or false

    if (!isValidbookId) {
      return res.status(400).send({ status: false, msg: "bookId is Not Valid" });
    }

    const findbookId = await BookModel.findOne({ _id: bookId, isDeleted: false, });

    if (findbookId) {
      if (!reviewedBy) {
        return res.status(400).send({ status: false, msg: "ReviewedBy must be present" })
      }
        obj.reviewedBy = reviewedBy

        if (!validatefeild(reviewedBy)) {
          return res.status(400).send({ status: false, msg: "Invalid format of reviewedBy" });
        }


      let validString = /\d/;
      if (validString.test(reviewedBy)) {
        return res.status(400).send({ status: false, msg: "reviewedBy must be valid it should not contains numbers", });
      }
      if (!rating) {
        return res.status(400).send({ status: false, msg: "Rating is missing" });
      }
      obj.rating = rating;

      if (typeof rating != "number") {
        return res
          .status(400)
          .send({ status: false, message: "Invalid rating Format" });
      }
      if (data.rating <= 0 || data.rating > 5) {
        return res
          .status(400)
          .send({ status: false, msg: "Rating should be in between 1-5 " });
      }
      if (review) {
        obj.review = review;

        if (!validatefeild(review)) {
          return res
            .status(400)
            .send({ status: false, msg: "Invalid format of review" });
        }
      }

      if (isDeleted) {
        obj.isDeleted = isDeleted;
        if (typeof isDeleted != "boolean") {
          return res
            .status(400)
            .send({
              status: false,
              message: "Invalid Input of isDeleted.It must be true or false ",
            });
        }
        if (isDeleted == true) {
          return res
            .status(400)
            .send({
              status: false,
              message: "isDeleted must be false while giving reviews",
            });
        }
      }
      data.bookId = bookId
      const reviews = await reviewModel.create(obj);
      let updateBook = await BookModel.findByIdAndUpdate({ _id: bookId }, { $inc: { reviews: +1 } }, { new: true, upsert: true })

      const bookdetails = JSON.parse(JSON.stringify(updateBook))
      bookdetails.reviewsData = reviews

      return res.status(200).send({ status: true, message: "Books with Reviews", data: bookdetails })

    }


    return res.status(400).send({ status: false, msg: "Sorry,This Book Not Exist" });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
;}
//=========================================PUT /books/:bookId/review/:reviewId==========================================//



const updateReview = async (req, res) => {
  const bookId = req.params.bookId
  const reviewId = req.params.reviewId

  try {



    if (bookId) {
      let isValidBookId = mongoose.Types.ObjectId.isValid(bookId);
      if (!isValidBookId) {
        return res.status(400).send({ status: false, msg: "BookId is Not a type of Valid objectId" })
      }
    }

    if (reviewId) {
      let isValidreviewId = mongoose.Types.ObjectId.isValid(reviewId);
      if (!isValidreviewId) {
        return res.status(400).send({ status: false, msg: "reviewId is Not a type of Valid objectId" })
      }
    }

    const BookIdExist = await BookModel.findById(bookId)
    if (!BookIdExist) {
      return res.status(400).send({ status: false, msg: "Incorrect bookId" })
    }
    if (BookIdExist.isDeleted == true) {
      return res.status(404).send({ status: false, msg: "Book not found might have been deleted already" })
    }
    const reviewIdExist = await reviewModel.findById(reviewId)
    if (!reviewIdExist) {
      return res.status(400).send({ status: false, msg: "Incorrect reviewId" })
    }

    const reviewdetails = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false })
    if (!reviewdetails) {
      return res.status(404).send({ status: false, msg: "No Reviews Found for this BookId" })
    }

    if (!req.body.review && !req.body.rating && !req.body.reviewedBy) {
      return res.status(400).send({ status: false, msg: "Please Provide data to update" })
    }

    if (req.body.review) {
      reviewdetails.review = req.body.review
    }
    if (req.body.rating) {
      reviewdetails.rating = req.body.rating
    }
    if (req.body.reviewedBy) {
      reviewdetails.reviewedBy = req.body.reviewedBy
    }

    if (!validatefeild(req.body.review)) {
      return res.status(400).send({ status: false, msg: "Invalid format of review" });
    }

    if (typeof req.body.rating != "number") {
      return res.status(400).send({ status: false, message: "Invalid rating Format" });
    }
    if (req.body.rating <= 0 || req.body.rating > 5) {
      return res.status(400).send({ status: false, msg: "Rating should be in between 1-5 " });
    }

    if (!validatefeild(req.body.reviewedBy)) {
      return res.status(400).send({ status: false, msg: "Invalid format of reviewedBy" });
    }

    let validString = /\d/;
    if (validString.test(req.body.reviewedBy.trim())) {
      return res.status(400).send({ status: false, msg: "reviewedBy must be valid it should not contains numbers", });
    }

    reviewdetails.save()

    const bookdetails = JSON.parse(JSON.stringify(BookIdExist))
    bookdetails.reviewsData = reviewdetails

    return res.status(200).send({ status: true, message: "Books with Reviews", data: bookdetails })
  }
  catch (err) {
    res.status(500).send({ status: false, error: err.message })
  }
}



//=========================================DELETE /books/:bookId/review/:reviewId==========================================//



const deleteReview = async (req, res) => {
  const bookId = req.params.bookId
  const reviewId = req.params.reviewId

  try {


    if (bookId) {
      let isValidBookId = mongoose.Types.ObjectId.isValid(bookId);
      if (!isValidBookId) {
        return res.status(400).send({ status: false, msg: "BookId is Not a type of Valid objectId" })
      }
    }

    if (reviewId) {
      let isValidreviewId = mongoose.Types.ObjectId.isValid(reviewId);
      if (!isValidreviewId) {
        return res.status(400).send({ status: false, msg: "reviewId is Not a type of Valid objectId" })
      }
    }

    const BookIdExist = await BookModel.findOne({ _id: bookId, isDeleted: false })

    if (!BookIdExist) {
      return res.status(404).send({ status: false, msg: "No Book Exist With this BookId" })
    }
    const countreviews = BookIdExist.reviews

    const reviewIdExist = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false })
    if (!reviewIdExist) {
      return res.status(404).send({ status: false, msg: "No Review Exist With this reviewId" })
    }
    let decreasereview = await BookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: { reviews: countreviews - 1 } }, { new: true, upsert: true })
    let deletereview = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId, isDeleted: false }, { $set: { isDeleted: true } }, { new: true, upsert: true })


    return res.status(200).send({ status: true, message: "Review Deleted Successfully" })

  }
  catch (err) {
    res.status(500).send({ status: false, msg: err.message })
  }
}


module.exports.createReview = createReview;
module.exports.updateReview = updateReview;
module.exports.deleteReview = deleteReview;
