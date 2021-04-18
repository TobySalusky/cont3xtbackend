var net = require('net');

var SERVICE_HOST = 'whois.cymru.com';
var SERVICE_PORT = 43;

/**
 * <b>Team Cymru's IP to ASN Client</b>.
 * @constructor
 * @author Chad Bibler (https://chadbibler.com)
 */
var IPToASN = function () {
  this.serviceOptions = {
    host: SERVICE_HOST,
    port: SERVICE_PORT
  };
};

IPToASN.prototype.query = function (addresses, callback) {
  var that = this;
  var client = net.connect(this.serviceOptions);
  client.setEncoding('utf8');

  client.on('connect', function () {
    var request = that._generateRequest(addresses);
    client.write(request);
  });

  client.on('data', function (response) {
    var results = that._handleResponse(response, callback);
    callback(null, results);
  });

  client.on('error', function (err) {
    callback(err, null);
  });
};

IPToASN.prototype._generateRequest = function (addresses) {
  var request = '';

  request += 'begin\r\n';
  request += 'verbose\r\n';
  addresses.forEach(function (address) {
    request += address + '\r\n';
  });
  request += 'end\r\n';

  return request;
};

IPToASN.prototype._handleResponse = function (response) {
  var lines = response.split('\n');
  return this._processResponseLines(lines);
};

IPToASN.prototype._processResponseLines = function (lines) {
  var results = {};
  var that = this;

  lines.forEach(function (line) {
    var result = that._processResponseLine(line);
    if (result) {
      results[result.address] = {
        range: result.addressWithRange,
        countryCode: result.countryCode,
        ASN: result.ASN,
        registrar: result.registrar,
        dateString: result.dateString,
        description: result.description
      };
    }
  });

  return results;
};

IPToASN.prototype._processResponseLine = function (line) {
  // if we send an invalid address
  var errorLineMessage = 'Error: no ASN or IP match';
  var commentResponseLine = 'Bulk mode;';
  var fieldDelimiter = '|';

  if (line.length === 0) { return; }
  if (line.indexOf(errorLineMessage) === 0) { return; }
  if (line.indexOf(commentResponseLine) === 0) { return; }

  var resultChunks = line.split(fieldDelimiter).map(this._trimField);

  var asn = resultChunks[0];
  var ipAddress = resultChunks[1];
  var addressWithRange = resultChunks[2];
  var countryCode = resultChunks[3];
  var registrar = resultChunks[4];
  var dateString = resultChunks[5];
  var description = resultChunks[6];

  return {
    ASN: asn,
    address: ipAddress,
    addressWithRange: addressWithRange,
    countryCode: countryCode,
    registrar: registrar,
    dateString: dateString,
    description: description
  };
};

IPToASN.prototype._trimField = function (field) {
  return field.trim();
};

module.exports = IPToASN;
