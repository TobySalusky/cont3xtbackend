## About

[![Dependency Status](https://david-dm.org/chadkeck/ip-to-asn.svg?style=flat)](https://david-dm.org/chadkeck/ip-to-asn)

A JavaScript client for Team Cymru's [IP to ASN service](https://www.team-cymru.org/Services/ip-to-asn.html).

**Note:** this is not IP-to-geographical data.

## Install

```sh
$ npm install --save ip-to-asn
```

## Usage

### Node.js

```javascript
var IPToASN = require('ip-to-asn');

var client = new IPToASN();

var addresses = [
  '68.22.187.5',
  '207.229.165.18',
  '216.58.216.224',
  '198.6.1.65'
];

client.query(addresses, function (err, results) {
  if (err) {
    console.error(err);
    return;
  }

  console.log(results);
});
```

## Results Format

```js
{
  '68.22.187.5': {
    range: '68.22.187.0/24',
    countryCode: 'US',
    ASN: '23028',
    registrar: 'arin',
    dateString: '2002-03-15',
    description: 'TEAM-CYMRU - Team Cymru Inc.,US'
  },
  '207.229.165.18': {
    range: '207.229.128.0/18',
    countryCode: 'US',
    ASN: '6079',
    registrar: 'arin',
    dateString: '',
    description: 'RCN-AS - RCN,US'
  },
  '216.58.216.224': {
    range: '216.58.192.0/19',
    countryCode: 'US',
    ASN: '15169',
    registrar: 'arin',
    dateString: '2012-01-27',
    description: 'GOOGLE - Google Inc.,US'
  },
  '198.6.1.65': {
    range: '198.6.0.0/16',
    countryCode: 'US',
    ASN: '701',
    registrar: 'arin',
    dateString: '',
    description: 'UUNET - MCI Communications Services, Inc. d/b/a Verizon Business,US'
  }
}
```

## Testing

```sh
$ npm test
```

## License

MIT
