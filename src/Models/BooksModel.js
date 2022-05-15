const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        uppercase: true,
    },
    excerpt: {
        type: String,
        trim: true,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        refs: 'user'
    },
    ISBN: {
        type: String,
        requireed: true,
        trim: true,
        unique: true
    },
    category: {
        type: String,
        trim: true,
        required: true
    },
    subcategory:
        [{ type: String, trim: true, required: true, }],

    reviews: {
        type: Number,
        default: 0,
        trim: true

        //comment: Holds number of reviews of this book
    },
    deletedAt: {
        type: Date,
        default: null,
        //when the document is deleted
    },
    isDeleted: {
        type: Boolean,
        default: false,
        trim: true
    },
    releasedAt: {
        type: String,
        required: true,
        trim:true  // format("YYYY-MM-DD")
    },



}, { timestamps: true })
module.exports = mongoose.model('Book', bookSchema)