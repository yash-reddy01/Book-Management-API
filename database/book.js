const mongoose = require("mongoose");

//Create Book Schema
const BookSchema = mongoose.Schema(
    {
        ISBN: String,
        title: String,
        pubDate: String,
        language: String,
        numPage: Number,
        author: [Array],
        publications: [Array],
        category: [String]
    }
);

const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;