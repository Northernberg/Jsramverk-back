process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const payload = { email: 'user@example.com' };
const testToken = jwt.sign(payload, secret, { expiresIn: '1h' });
const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;
const after = mocha.after;

chai.should();

chai.use(chaiHttp);
describe('Reports', () => {
    before(done => {
        chai.request(server)
            .post('/reports')
            .set({
                'x-access-token': testToken,
                'Content-type': 'Application/json',
            })
            .send({
                _method: 'post',
                week: 1,
                data: 'This is testdata week1',
            })
            .end((err, res) => {
                res.should.have.status(201);
                if (err) {
                    throw new Error('die');
                } else {
                    done();
                }
            });
    });
    it('200, Get report', done => {
        chai.request(server)
            .get('/reports/week/1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.data.should.be.an('string');
                res.body.data.length.should.be.above(0);

                done();
            });
    });

    it('404, Get report not existing', done => {
        chai.request(server)
            .get('/reports/week/27')
            .end((err, res) => {
                res.should.have.status(404);
                res.should.be.an('object');
                done();
            });
    });

    it('200, Update report', done => {
        chai.request(server)
            .post('/reports/update')
            .set({
                'x-access-token': testToken,
                'Content-type': 'Application/json',
            })
            .send({
                _method: 'post',
                week: 1,
                data: 'changed data',
            })
            .end((err, res) => {
                res.should.have.status(200);
                chai.request(server)
                    .get('/reports/week/1')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.data.should.equal('changed data');
                    });

                done();
            });
    });

    it('401, Update report not existing', done => {
        chai.request(server)
            .post('/reports/update')
            .set({
                'x-access-token': testToken,
                'Content-type': 'Application/json',
            })
            .send({
                _method: 'post',
            })
            .end((err, res) => {
                res.should.have.status(401);
                res.should.be.an('object');
                chai.request(server)
                    .get('/reports/week/1')
                    .end((err, result) => {
                        result.should.have.status(200);
                        result.body.data.should.not.equal('ny data');

                        done();
                    });
            });
    });

    it('401, Create report empty field', done => {
        chai.request(server)
            .post('/reports/update')
            .send({
                _method: 'post',
                week: 20,
            })
            .end((err, res) => {
                res.should.have.status(401);
                res.should.be.an('object');
                done();
            });
    });

    it('401, Fail No auth token', done => {
        chai.request(server)
            .post('/reports/update')
            .send({
                _method: 'post',
                week: 20,
                data: 'new report data',
            })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.an('string');
                done();
            });
    });

    after(() => {});
});
