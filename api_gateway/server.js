const express = require('express')
const axios = require('axios')
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3002;

app.get('/', (req, res) => {
    const postcode = req.query.postcode;
    console.log("p", postcode)
    return axios
        .post('https://production.api.lyka.com.au/api/v1/shipping/deliverydates/postcodeonly', {
            postcode: postcode,
            weeks: 20
        })
        .then(resp => {
            console.log(`statusCode: ${resp.status}`)
            console.log(resp.data.data)
            return res.send(resp.data.data);
        })
        .catch(error => {
        console.error(error)
        })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})