process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;

chai.should();

chai.use(chaiHttp);
describe('Login', () => {
    before(done => {
        chai.request(server)
            .post('/register')
            .send({
                _method: 'post',
                firstname: 'test',
                lastname: 'karlsson',
                email: 'test@testsson.se',
                password: 'test12345',
                birthdate: '1997-09-30',
            })
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
    });
    it('200 Login', done => {
        chai.request(server)
            .post('/login')
            .send({
                _method: 'post',
                email: 'test@testsson.se',
                password: 'test12345',
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.token.should.be.an('string');
                res.body.username.should.be.an('string');
                done();
            });
    });

    it('422 Login, wrong password', done => {
        chai.request(server)
            .post('/login')
            .send({
                _method: 'post',
                email: 'test@testsson.se',
                password: 'test',
            })
            .end((err, res) => {
                res.should.have.status(422);
                res.body.should.be.an('string');
                done();
            });
    });

    it('422 Login, bad email', done => {
        chai.request(server)
            .post('/login')
            .send({
                _method: 'post',
                email: 'test@',
                password: 'test12345',
            })
            .end((err, res) => {
                res.should.have.status(422);
                res.body.should.be.an('object');
                done();
            });
    });

    it('422 Login, wrong email', done => {
        chai.request(server)
            .post('/login')
            .send({
                _method: 'post',
                email: 'testsson@notfound.se',
                password: 'test12345',
            })
            .end((err, res) => {
                res.should.have.status(422);
                res.body.should.be.an('string');
                done();
            });
    });
});
