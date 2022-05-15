const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const moment = require("moment")

const reviewSchema = new mongoose.Schema({
    bookId: {
        type: ObjectId,
        ref: "Book",
        required: true,
        trim: true
    },
    reviewedBy: {
        type: String,
        required:true,
        default: "Guest",
        trim: true
    },
    reviewedAt: {
        type: Date,
        required: true,
        trim: true
    },
    rating: {
        type: Number,    // max : 5 , min : 1
        required: true,
        min: 1,
        max: 5,
        trim: true
    },
    review: {
        type: String,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        trim: true
    }
});

module.exports = mongoose.model('review', reviewSchema)