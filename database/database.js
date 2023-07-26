const books = [
    {
        ISBN: "12345Book",
        title: "Tesla",
        pubDate: "2023-07-23",
        language: "en",
        numPage: 250,
        author: [1, 2],
        publications: [1],
        category: ["tech", "space", "education"]
    }
]

const author = [
    {
        id: 1,
        name: "Yash",
        books: ["12345Book", "secretBooks"]
    },
    {
        id: 2,
        name: "Elon Musk",
        books: ["12345Book"]
    }
]

const publication = [
    {
        id: 1,
        name: "writex",
        books: ["12345Book"]
    },
    {
        id: 2,
        name: "writex2",
        books: []
    }
]

module.exports = {books, author, publication};