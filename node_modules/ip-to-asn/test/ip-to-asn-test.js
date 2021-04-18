// BDD-style tests
var chai = require('chai');
chai.should();
var expect = chai.expect;

var S = require('string'); // for startsWith() and endsWith()
var fs = require('fs'); // for reading files

var IPToASN = require('../lib/ip-to-asn');

describe('IPToASN', function () {
  var client;
  var addresses;
  before(function () {
    client = new IPToASN();
    addresses = [
      '68.22.187.5',
      '207.229.165.18',
      '216.58.216.224',
      '198.6.1.65'
    ];
  });

  describe('#_generateRequest()', function () {
    it('should return begin/end wrapped addresses with newlines', function () {
      var request = client._generateRequest(addresses);
      expect(request).to.be.a('string');

      request = S(request);
      expect(request.startsWith('begin\r\nverbose\r\n')).to.be.true();
      expect(request.endsWith('end\r\n')).to.be.true();
    })
  })
})
