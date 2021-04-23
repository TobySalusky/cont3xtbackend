const express = require('express')
const app = express()
const port = 3001

app.use(express.json());



app.get('/whoisdomain', async (req, res) => {

    try {
        const whois = require('whois-json');

        const data = await whois(req.query.domain);
        res.json(data)

    } catch (err) {
        console.log(err)
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

app.listen(port, () => console.log(`Listening on port ${port}`))
module.exports = app
