const express = require('express')
const app = express()
const port = 4000

app.use(express.json());



app.get('/who-is-domain', async (req, res) => {
    
    console.log('hi')
    
    try {
        const whois = require('whois-json');

        const data = await whois(req.query.q);
        console.log(res)
        res.json(data)

    } catch (err) {
        console.log(err)
        res.send('err')
    }
})

app.get('/threat-stream', async (req, res) => {
    
    const axios = require('axios');
    
    const {q, url, user, apikey} = req.query;
    
    try {
        const threatStreamRes = await axios.get(`https://${url}/api/v2/intelligence`, {
            params: {
                value__exact: q
            },
            headers: {
                Authorization: `apikey ${user}:${apikey}`
            }
        });
        
        console.log('threatstream res', threatStreamRes);
        res.json(threatStreamRes.data);
        
    } catch (err) {
        console.log(err);
        res.send('err')
    }
})

app.get('/url-scan', async (req, res) => {

    const axios = require('axios');

    try {
        const urlScanRes = await axios.get('https://urlscan.io/api/v1/search/', {
            params: {
                q: req.query.q
            },
            headers: {
                'API-Key': req.query.key
            }
        })
        res.json(urlScanRes.data);

    } catch (err) {
        console.log(err);
        res.send('err')
    }
})

app.get('/virus-total-domain', async (req, res) => {
    
    const axios = require('axios');
    
    try {
    
        const virusTotalRes = await axios.get('https://www.virustotal.com/vtapi/v2/domain/report', {
            params: {
                apikey: req.query.key,
                domain: req.query.q,
            }
        });
    
        //console.log('virus total res', virusTotalRes);
        res.json(virusTotalRes.data);
    
    } catch (err) {
        console.log(err);
        res.send('err')
    }
})

app.get('/virus-total-ip', async (req, res) => {
    
    const axios = require('axios');
    
    try {
        
        const virusTotalRes = await axios.get('https://www.virustotal.com/vtapi/v2/ip-address/report', {
            params: {
                apikey: req.query.key,
                ip: req.query.q,
            }
        });
        
        //console.log('virus total res', virusTotalRes);
        res.json(virusTotalRes.data);
        
    } catch (err) {
        console.log(err);
        res.send('err')
    }
})

app.get('/virus-total-hash', async (req, res) => {
    
    const axios = require('axios');
    
    try {
        
        const virusTotalRes = await axios.get('https://www.virustotal.com/vtapi/v2/file/report', {
            params: {
                apikey: req.query.key,
                resource: req.query.q,
            }
        });
        
        //console.log('virus total res', virusTotalRes);
        res.json(virusTotalRes.data);
        
    } catch (err) {
        console.log(err);
        res.send('err')
    }
})


app.get('/shodan-search', async (req, res) => {
    
    const axios = require('axios');
    
    try {
        
        const {key, q} = req.query;
        
        const response = await axios.get(`https://api.shodan.io/shodan/host/${q}?key=${key}`, {
            /*params: {
                ip: q, key
            }*/
        });
        
        res.json(response.data);
        
    } catch (err) {
        console.log(err);
        res.send('err')
    }
})


app.get('/ip2asn', async (req, res) => {

    const IPToASN = require('ip-to-asn');

    const client = new IPToASN();
    const addresses = [req.query.ip];

    client.query(addresses, function (err, results) {
        if (err) {
            console.error(err);
            res.send('err')
            return;
        }

        res.json(results)
    });
})

app.get('/verify-email', async (req, res) => {
    
    const verifier = require('email-verify');
    const infoCodes = verifier.verifyCodes;
    
    verifier.verify( req.query.email, function( err, info ){
        if( err ) {
            console.log(err);
            res.send('err')
        } else{
            console.log( "Success (T/F): " + info.success );
            console.log( "Info: " + info.info );
            
            //Info object returns a code which representing a state of validation:
            
            //Connected to SMTP server and finished email verification
            console.log(info.code === infoCodes.finishedVerification);
            
            //Domain not found
            console.log(info.code === infoCodes.domainNotFound);
            
            //Email is not valid
            console.log(info.code === infoCodes.invalidEmailStructure);
            
            //No MX record in domain name
            console.log(info.code === infoCodes.noMxRecords);
            
            //SMTP connection timeout
            console.log(info.code === infoCodes.SMTPConnectionTimeout);
            
            //SMTP connection error
            console.log(info.code === infoCodes.SMTPConnectionError)
            
            res.json(info)
        }
    });
    
})

app.get('/verify-phone-number', async (req, res) => {
    
    console.log('test')
    console.log(req.query.phoneNumber)
    
    const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
    const number = phoneUtil.parse(req.query.phoneNumber, 'US');
    
    res.send(phoneUtil.isValidNumber(number))
})


app.listen(port, () => console.log(`Listening on port ${port}`))
module.exports = app
