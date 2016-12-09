const mongoose = require('mongoose');
const Book = require('../models/book');

/*
 * GET /book route to retrieve all the books.
 *   得到所有books 数据
 */
function getBooks(req, res) {
    //Query the DB and if no errors, send all the books
    let query = Book.find({});
    query.exec((err, books) => {
        if(err) res.send(err);
        //If no errors, send them back to the client
        res.json(books);
    });
}

/*
 * POST /book to save a new book.
 * 新增book
 */
function postBook(req, res) {
    //Creates a new book
    //得到前台传递过来的参数
    var newBook = new Book(req.body);
    //Save it into the DB.
    //调用save 保存到数据库
    newBook.save((err,book) => {
        if(err) {
            res.send(err);
        }
        else { //If no errors, send it back to the client
            res.json({message: "Book successfully added!", book });
        }
    });
}

/*
 * GET /book/:id route to retrieve a book given its id.
 * *id req.params.id
 * 根据 id  查询具体详情
 */
function getBook(req, res) {
    Book.findById(req.params.id, (err, book) => {
        if(err) res.send(err);
        //If no errors, send it back to the client
        res.json(book);
    });
}

/*
 * DELETE /book/:id to delete a book given its id.
 * @id  bookid
 * 根据id 删除book
 */
function deleteBook(req, res) {
    Book.remove({_id : req.params.id}, (err, result) => {
        res.json({ message: "Book successfully deleted!", result });
    });
}

/*
 * PUT /book/:id to updatea a book given its id
 * @id  bookid
 *根据id修改
 */
function updateBook(req, res) {
    Book.findById({_id: req.params.id}, (err, book) => {
        if(err) res.send(err);
        Object.assign(book, req.body).save((err, book) => {
            if(err) res.send(err);
            res.json({ message: 'Book updated!', book });
        });
    });
}

//export all the functions
module.exports = { getBooks, postBook, getBook, deleteBook, updateBook };
