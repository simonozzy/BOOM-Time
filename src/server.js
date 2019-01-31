const soap = require('soap');
const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
// const { db } = require('./dbConnection.js');
const config = require('../config');
const request = require('request');

// wsdl of the web service this client is going to invoke. For local wsdl you can use, url = './wsdls/stockquote.wsdl'
// ## From here ON tests alternative strong-soap package vs older "plain" soap
"use strict";
const strongSoap = require('strong-soap').soap;
const url = 'http://www.webservicex.net/stockquote.asmx?WSDL';

const requestArgs = {
  symbol: 'IBM'
};

const options = {};
strongSoap.createClient(url, options, function(err, client) {
  let method = client['StockQuote']['StockQuoteSoap']['GetQuote'];
  method(requestArgs, function(err, result, envelope, soapHeader) {
    //response envelope
    console.log('strongSoap Response Envelope: \n' + envelope);
    //'result' is the response body
    console.log('Result: \n' + JSON.stringify(result));
  });
});  // ## From here UP tests  alternative strong-soap package vs older "plain" soap


const soapHeader = `<AccessToken><TokenValue>${config.source.accessToken}</TokenValue></AccessToken>`;

app.use(bodyParser.json());

// GetArrivalBoard - requires req to be passed in via the api call as JSON in a defined format
router.post('/getArrivalBoard', (req, res) => {
  soap.createClient(config.source.soapUrl, (err, client) => {
    // console.log(err);
    console.dir(client) ;
    client.addSoapHeader(soapHeader);
    client.GetArrivalBoard(req.body, (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      } else {
    //response envelope
    console.log('Soap getArrivalBoard Response Envelope: \n' + envelope);
    //'result' is the response body
    console.log('Result: \n' + JSON.stringify(result));
        res.json(result);
      }
    });
  });
});

const payload = {
//  'content-type': 'application/json',
  "numRows": 4,
  "crs":"MOT",
  "timeWindowInMins": 30
} ;

// GetStationArrivals - use "payload" as saved constant to pass as req 
router.post('/GetStationArrivals/', (req, res) => {
  soap.createClient(config.source.soapUrl, (err, client) => {
    client.addSoapHeader(soapHeader);
    client.GetArrivalBoard(payload, (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      } else {
    console.log('Soap GetStationArrivals Response Envelope: \n' + envelope);
    //'result' is the response body
    console.log('Result: \n' + JSON.stringify(result));
        res.json(result);
        console.log( res.json(result) ) ;
      }
    });
  });
});

app.use(config.server.routePrefix, router);

app.listen(config.server.port, () => {
  console.log(`listening at ${config.server.port}`);
});

// request('http://www.google.com', function (error, response, body) {
//   console.log('error:', error); // Print the error if one occurred
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   console.log('body:', body); // Print the HTML for the Google homepage.
// });

// request('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', { json: true },  (err, res, body) => {
  request('http://localhost:8080/api/GetStationArrivals', { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    // console.dir(body);
    console.log(body.url);
// console.log(body.explanation);
});

request(
{ method: 'POST'
// , url: 'http://localhost:8080/api/getArrivalBoard' 
, url: 'getArrivalBoard' 
, multipart:
  [ { 'content-type': 'application/json'
    ,  body: JSON.stringify(
      {
        "numRows": 4,
        "crs":"MOT",
        "timeWindowInMins": 30
      }
      // {foo: 'bar', _attachments: {'message.txt': {follows: true, length: 18, 'content_type': 'text/plain' }}}
      )
    }
  ]
}
, function (error, response, body) {
  if(response.statusCode == 201){
    console.dir(body)
  } else {
    console.log('error: '+ response.statusCode)
    console.log(body)
  }
}
);

