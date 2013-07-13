var chai = require('chai')
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai')
  , chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
chai.use(sinonChai)

global.sinon = sinon
global.chai = chai
global.expect = require('chai').expect
