const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Books API', () =>{
    let bookId;

    it("should POST a book", (done) =>{
        const book = {id: "1", title: "Test Book", author: "Test Author"};

        chai.request(server)
        .post('/books')
        .send(book)
        .end((err, res) =>{
            if(err){
                return done(err)
            }
            expect(res).to.have.status(201);
            expect(res.body).to.be.a('object');
            expect(res.body).to.have.property('id');
            expect(res.body).to.have.property('title');
            expect(res.body).to.have.property('author');
            bookId = res.body.id;
            done();
        });
    });

    it("should GET all books", (done) => {

        chai.request(server)
        .get('/books')
        .end((err, res) =>{
            if(err){
                return done(err);
            }
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('array');
            done();
        });
    });

    it("should GET single book", (done) =>{
        chai.request(server)
        .get(`/books/${bookId}`)
        .end((err, res) =>{
            if(err){
                return done(err);
            }
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('object');
            expect(res.body).to.have.property('id');
            expect(res.body.id).to.equal(bookId);
            done();
        });
    });

    it("should PUT in existing book", (done) =>{
        const updateBook = {id: bookId, title: "Update Test Book", author: "Update Test Author"}
        chai.request(server)
        .put(`/books/${bookId}`)
        .send(updateBook)
        .end((err, res) =>{
            if(err){
                return done(err);
            }
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('object');
            expect(res.body.title).to.equal(updateBook.title);
            expect(res.body.author).to.equal(updateBook.author);
            done();
        })
    });

    it("should DELET in existing book", (done) =>{
        chai.request(server)
        .delete(`/books/${bookId}`)
        .end((err, res) => {
            expect(res).to.have.status(204);
            done();
        })
    });

    it("should return 404 when trying to GET,PUT and DELETE a non-exsiting book", (done) =>{
        chai.request(server)
        .get('/books/9999')
        .end((err, res) => {
            expect(res).to.have.status(404)
        });

        chai.request(server)
        .put('/books/9999')
        .send({id: 9999, title: "Non-existing Book", author: "Non-existing Author"})
        .end((err, res) =>{
            expect(res).to.have.status(404);
        })

        chai.request(server)
        .delete('/books/9999')
        .end((err, res) =>{
            expect(res).to.have.status(404);
            done();
        })
    })



    


})