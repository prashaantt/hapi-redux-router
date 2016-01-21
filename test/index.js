'use strict';

const Code = require('code');
const Hapi = require('hapi');
const HapiReduxRouter = require('..');
const Lab = require('lab');
const Vision = require('vision');


const lab = exports.lab = Lab.script();


lab.experiment('The plugin', () => {

    let server;

    lab.beforeEach((done) => {

        server = new Hapi.Server();
        server.connection();
        done();
    });

    lab.test('registers successfully with dependency', (done) => {

        server.register([Vision, HapiReduxRouter], () => {});
        server.start((err) => {

            Code.expect(err).to.not.exist();
            done();
        });
    });

    lab.test('fails to register without dependency', (done) => {

        server.register(HapiReduxRouter, () => {});
        server.start((err) => {

            Code.expect(err).to.exist();
            done();
        });
    });

    lab.afterEach((done) => {

        server.stop();
        done();
    });
});
