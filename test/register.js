process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;

chai.should();

chai.use(chaiHttp);
describe('Register', () => {
    it('201 Register', done => {
        chai.request(server)
            .post('/register')
            .set('Content-Type', 'Application/json')
            .send({
                _method: 'post',
                firstname: 'test',
                lastname: 'karlsson',
                email: 'test@gmail.com',
                password: 'test12345',
                birthdate: '1997-09-30',
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.text.should.be.an('string');
                done();
            });
    });

    it('422 Register, bad email', done => {
        chai.request(server)
            .post('/register')
            .send({
                _method: 'post',
                firstname: 'test',
                lastname: 'karlsson',
                email: '',
                password: 'test12345',
                birthdate: '1997-09-30',
            })
            .end((err, res) => {
                res.should.have.status(422);
                res.body.should.be.an('object');
                done();
            });
    });

    it('422 Register, no password', done => {
        chai.request(server)
            .post('/register')
            .send({
                _method: 'post',
                firstname: 'test',
                lastname: 'karlsson',
                email: 'test@karlsson.se',
                password: '',
                birthdate: '1997-09-30',
            })
            .end((err, res) => {
                res.should.have.status(422);
                res.text.should.be.an('string');
                done();
            });
    });
});
