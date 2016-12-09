const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const book = require('./routes/book');
//we load the db location from the JSON files
//加载config配置文件
const config = require('config');


//端口
const port = 8080

let options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 }},
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
}

//db connection 连接mongoose
mongoose.connect(config.DBHost, options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

//parse application/json and look for raw text
//引入中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

//根访问目录
app.get("/", (req, res) => res.json({message: "Welcome to our Bookstore!"}));

// 路由
app.route("/book")
    .get(book.getBooks)
    .post(book.postBook);
app.route("/book/:id")
    .get(book.getBook)
    .delete(book.deleteBook)
    .put(book.updateBook);

//启动express
app.listen(port);
console.log("Listening on port " + port);

//导出模块   测试需要用到
module.exports = app; // for testing
