require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

//database
const database = require("./database/database");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//Intialise express
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Connection Established"));

/*
Route           /
Description     Get all the books
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/", async(req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

/*
Route           /is
Description     Get a specific book
Access          PUBLIC
Parameter       isbn
Methods         GET
*/
// booky.get("/is/:isbn", (req, res) => {
//     const getSpecificBook = database.books.filter(
//         (book) => book.ISBN === req.params.isbn
//     );

//     if(getSpecificBook.length === 0) {
//         return res.json({error: `No book found for the ISBN ${req.params.isbn}`});
//     }

//     return res.json({book: getSpecificBook});
// })
booky.get("/is/:isbn", async(req, res) => {
    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});
    //null
    if(!getSpecificBook) {
        return res.json({error: `No Book found for the ISBN ${req.params.isbn}`});
    }

    return res.json(getSpecificBook);
})

/*
Route           /c
Description     Get a specific book based on category
Access          PUBLIC
Parameter       category
Methods         GET
*/
booky.get("/c/:category", async(req, res) => {
    // const getSpecificBook = database.books.filter(
    //     (book) => book.category.includes(req.params.category)
    // )
    const getSpecificBook = await BookModel.findOne({category: req.params.category});
    //null
    if(!getSpecificBook) {
        return res.json({error: `No Book found for the category ${req.params.category}`});
    }

    return res.json(getSpecificBook);
})



/*
Route           /lang
Description     Get a specific book based on language
Access          PUBLIC
Parameter       language
Methods         GET
*/
booky.get("/lang/:language", async(req, res) => {
    const getSpecificBook = await BookModel.findOne({language: req.params.language});
    
    //null
    if(!getSpecificBook){
        return res.json({error: `No book found for the language ${req.params.language}`});
    }

    return res.json(getSpecificBook);
})

/*
Route           /author
Description     Get all the authors
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/author", async(req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
});

/*
Route           /author/id
Description     Get a specific authors based on id
Access          PUBLIC
Parameter       id
Methods         GET
*/
booky.get("/author/id/:id", async(req, res) => {
    const getSpecificAuthor = await AuthorModel.findOne({id: req.params.id});
    //null
    if(!getSpecificAuthor) {
        return res.json({error: `No author found for the id ${req.params.id}`});
    }

    return res.json(getSpecificAuthor);
});

/*
Route           /author/book
Description     Get a list of author based on book
Access          PUBLIC
Parameter       isbn
Methods         GET
*/
booky.get("/author/book/:isbn", async(req, res) => {
    const getSpecificAuthor = await AuthorModel.findOne({books: req.params.isbn});

    if(!getSpecificAuthor) {
        return res.json({error: `No author found for the book ISBN ${req.params.isbn}`});
    }

    return res.json(getSpecificAuthor);
});

/*
Route           /publication
Description     Get all publications
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/publication", async(req, res) => {
    const getAllPublication = await PublicationModel.find();
    return res.json(getAllPublication);
});

/*
Route           /publication/id
Description     Get a specific publication based on ID
Access          PUBLIC
Parameter       id
Methods         GET
*/
booky.get("/publication/id/:id", async(req, res) => {
    const getSpecificPub = await PublicationModel.findOne({id: req.params.id});
    //null
    if(!getSpecificPub) {
        return res.json({error: `No publication found for the id ${req.params.id}`})
    }
});

/*
Route           /publication/book
Description     Get a list of publication based on book
Access          PUBLIC
Parameter       isbn
Methods         GET
*/
booky.get("/publication/book/:isbn", async(req, res) => {
    const getSpecificPub = await PublicationModel.findOne({books: req.params.isbn});

    //null
    if(!getSpecificPub) {
        return res.json({error: `No publication found for the ISBN ${req.params.isbn}`});
    }

    return res.json(getSpecificPub);
});

//POST

/*
Route           /book/new
Description     Add new book
Access          PUBLIC
Parameter       NONE
Methods         POST
*/
booky.post("/book/new", async(req, res) => {
    const { newBook } = req.body;
    const addNewBook = BookModel.create(newBook);
    return res.json(
        {
            books: addNewBook,
            message: "Book was Added!!!"
        }
    );
});

/*
Route           /author/new
Description     Add new author
Access          PUBLIC
Parameter       NONE
Methods         POST
*/
booky.post("/author/new", async(req, res) => {
    const { newAuthor } = req.body;
    const addNewAuthor = AuthorModel.create(newAuthor);
    return res.json({
        authors: addNewAuthor,
        message: "Author was added!!"
    });
});

/*
Route           /publication/new
Description     Add new publication
Access          PUBLIC
Parameter       NONE
Methods         POST
*/
booky.post("/publication/new", async(req, res) => {
    const { newPublication } = req.body;
    const addNewPublication = PublicationModel.create(newPublication);
    return res.json(
        {
            publication: addNewPublication,
            message: "Publication was added!!!"
        }
    );
});

/*********PUT***********/
/*
Route           /book/update
Description     Update book on isbn
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/
booky.put("/book/update/:isbn", async(req, res) => {
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            title: req.body.bookTitle
        },
        {
            new: true
        }
    );

    return res.json(
        {
            books: updatedBook
        }
    )
});

/**********Updating New Author**************/
/*
Route           /book/author/update
Description     Update/Add new Auhtor
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/
booky.put("/book/author/update/:isbn", async(req, res) => {
    //Update Book Database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $addToSet: {
                author: req.body.newAuthor
            }
        },
        {
            new: true
        }
    );

    //Update the author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: req.body.newAuthor
        },
        {
            $addToSet: {
                books: req.params.isbn
            }
        },
        {
            new: true
        }
    );

    return res.json(
        {
            Books: updatedBook,
            Authors: updatedAuthor,
            message: "New author was added"
        }
    );
});


/*
Route           /publication/update/book
Description     Update/Add new publication
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/

/*lets say the body of req or the input is : 
{
    "pubId": 2,
    etc
} 
*/
booky.put("/publication/update/book/:isbn", (req, res) => {
    //Update the publication database
    database.publication.forEach((pub) => {
        if(pub.id === req.body.pubId) {
            return pub.books.push(req.params.isbn);
        }
    });

    //Update the books database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            book.publications = req.body.pubId;
            return;
        }
    });
    return res.json(
        {
            books: database.books,
            publications: database.publication,
            message: "Successfully updated the publications"
        }
    );
});

/*****DELETE******/
/*
Route           /book/delete
Description     Delete a book
Access          PUBLIC
Parameter       isbn
Methods         DELETE
*/
booky.delete("/book/delete/:isbn", async(req, res) => {
    //Whichever book that doesnot match with the isbn, just send it to an updatedBookDatabase array
    //and rest will be filteres out
    const updatedBookDatabase = await BookModel.findOneAndDelete(
        {
            ISBN: req.params.isbn
        }
    );

    return res.json(
        {books: updatedBookDatabase}
    );
});

/*
Route           /book/delete/author
Description     Delete an author from book and vice versa
Access          PUBLIC
Parameter       authId and isbn
Methods         DELETE
*/
booky.delete("/book/delete/author/:isbn/:authId", (req, res) => {
    //Update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            const newAuthorList = book.author.filter(
                (eachAuthor) => eachAuthor !== parseInt(req.params.authId)
            );
            book.author = newAuthorList;
            return;
        }
    });

    //update the author database
    database.author.forEach((eachAuthor) => {
        if(eachAuthor.id === parseInt(req.params.authId)) {
            const newBookList = eachAuthor.books.filter(
                (book) => book !== req.params.isbn
            );
            eachAuthor.books = newBookList;
            return;
        }
    });

    return res.json(
        {
            books: database.books,
            author: database.author,
            message: "Author was deleted!!!"
        }
    );
});

booky.listen(3000, () => {
    console.log("Server is up and running");
})