var sinonChai = require('sinon-chai')

global.sinon = require('sinon')
global.chai = require('chai')
global.expect = require('chai').expect

chai.use(sinonChai)