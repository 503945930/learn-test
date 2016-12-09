//设置 NODE_ENV  为test
process.env.NODE_ENV = 'test'

const mongoose = require('mongoose')
const Book = require('../models/book')

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);


describe('Books', () => {
  // body...
  //每个测试之前都 运行
  //异步 async 都 要 done()
  beforeEach((done) => {
    //移除所有测试数据
    Book.remove({}, (err) => {
      done();
    })
  });

  /*
   * TEST THE /GET ROUTE
   */
   describe('/book  get', () => {
     // body...
     it("it should get all the books", (done) => {
       chai.request(server)
            .get('/book')
            .end((err, res) => {
              //测试状态 http 200
              res.should.have.status(200)
              //测试 body 类型
              res.body.should.be.a('array')
              //测试 body  长度  因为已经被清空了   所有长度为0
              res.body.length.should.be.eql(0)

              done();
            })
     })
   });

   /*
    *test /post route
    *
    *
    */

     describe('/book  post', function() {
      // body...
      //测试 pages 字段是 必需的
      it("it should not post a book without pages filed", (done) => {
        // 假数据   book  但没有pages
        let book = {
          title: "the lor of the ring",
          author: "j r r ",
          year: 1954
        }

        chai.request(server)
            .post('/book')
            .send(book)  //post 请求中添加 book 对象
            .end((err, res) => {
              //测试返回的状态 http 200
              res.should.have.status(200)
              //测试返回的数据 类型
              res.body.should.be.a('object')
              // 测试返回的错误提示  因为没有 pages， 错误对象中包含  errors
              res.body.should.have.property('errors');
              //测试 errors 对象中  包含 pages
              res.body.errors.should.have.property('pages')
              // 测试 errors  包含  kind 的value  === required
              res.body.errors.pages.should.have.property('kind').eql('required')
              done();
            })
      }),
      //测试正确的 post
      it("it should POST a book", (done) => {
        let book = {
          title: "the lor of the ring",
          author: "j r r ",
          year: 1954,
          pages: 1170
        }

        chai.request(server)
            .post('/book')
            .send(book)  //post 请求中添加 book 对象
            .end((err, res) => {
              //测试返回的状态 http 200
              res.should.have.status(200)
              //测试返回的数据 类型
              res.body.should.be.a('object')
              //测试返回的对象
              res.body.should.have.property('message').eql('Book successfully added!');
              res.body.book.should.have.property('title');
              res.body.book.should.have.property('author');
              res.body.book.should.have.property('pages');
              res.body.book.should.have.property('year');
              done();
            })
      })
    });


    /*
     * Test the /GET/:id route
     */
     describe('/GET/:id book', () => {
         it('it should GET a book by the given id', (done) => {
           let book = new Book({ title: "The Lord of the Rings", author: "J.R.R. Tolkien", year: 1954, pages: 1170 });
           //先要新增 数据
           book.save((err, book) => {
               chai.request(server)
               .get('/book/' + book.id)
               .send(book)
               .end((err, res) => {
                  // 测试状态码  Http 200
                   res.should.have.status(200);
                   //返回的数据类型
                   res.body.should.be.a('object');
                   //返回的对象 包含的属性
                   res.body.should.have.property('title');
                   res.body.should.have.property('author');
                   res.body.should.have.property('pages');
                   res.body.should.have.property('year');
                   //测试返回的id 等于 新增的 id
                   res.body.should.have.property('_id').eql(book.id);
                   done();
               });
           });

         });
     });


     /*
       * Test the /PUT/:id route
       */
    describe('/PUT/:id book', () => {
           it('it should UPDATE a book given the id', (done) => {
             //新增数据
             let book = new Book({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1948, pages: 778})
             book.save((err, book) => {
                     chai.request(server)
                     .put('/book/' + book.id)//http put
                     .send({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1950, pages: 778})
                     .end((err, res) => {

                         res.should.have.status(200);
                         res.body.should.be.a('object');
                         //测试message  === 修改后的值
                         res.body.should.have.property('message').eql('Book updated!');
                         //测试year  === 修改后的值
                         res.body.book.should.have.property('year').eql(1950);
                         done();
                     });
               });
           });
       });

       /*
        * Test the /DELETE/:id route
        */
    describe('/DELETE/:id book', () => {
            it('it should DELETE a book given the id', (done) => {
              let book = new Book({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1948, pages: 778})
              book.save((err, book) => {
                      chai.request(server)
                      .delete('/book/' + book.id)// http delete
                      .end((err, res) => {
                          res.should.have.status(200);
                          res.body.should.be.a('object');
                          //测试返回的对象属性
                          res.body.should.have.property('message').eql('Book successfully deleted!');
                          res.body.result.should.have.property('ok').eql(1);
                          res.body.result.should.have.property('n').eql(1);
                          done();
                      });
                });
            });
        });
});




/*

  总结：
  测试一般需要测试
  1. 状态码
  2. 返回的数据类型
  3. 返回的对象具体包含的属性和值
  4. 错误对象




*/
