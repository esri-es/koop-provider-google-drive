'use strict';
/*
  model.js

  This file is required. It must export a class with at least one public function called `getData`

  Documentation: http://koopjs.github.io/docs/specs/provider/
*/
const request = require('request').defaults({gzip: true, json: true});
//const config = require('config');

function Model (koop) {}

// This is the only public function you need to implement
Model.prototype.getData = function (req, callback) {
  // Call the remote API with our developer key

  const endpoint = 'https://spreadsheets.google.com/feeds/list/1d-eFcj_t_tJ0Mr5K_f3rJKkQckXSW1m6bUZBX6zcG0Y/1/public/values?alt=json';

  request(endpoint, (err, res, body) => {
    if (err) { return callback(err); }
    // translate the response into geojson
    const geojson = translate(body);
    // Cache data for 10 seconds at a time by setting the ttl or "Time to Live"
    geojson.ttl = 10;
    // hand off the data to Koop
    callback(null, geojson);
  });
  /*request(`https://developer.trimet.org/ws/v2/vehicles/onRouteOnly/false/appid/${key}`, (err, res, body) => {
    if (err) { return callback(err); }
    // translate the response into geojson
    const geojson = translate(body);
    // Cache data for 10 seconds at a time by setting the ttl or "Time to Live"
    geojson.ttl = 10;
    // hand off the data to Koop
    callback(null, geojson);
  });*/
};

function translate (input) {
  return {
    type: 'FeatureCollection',
    features: input.feed.entry.map(formatFeature)
  };
}

function formatFeature (row) {
  // Most of what we need to do here is extract the longitude and latitude
  let values = {};

  /*for (var i = 0; i < array.length; i++) {
    array[i]
  }row.gsx$fechafin.$t*/

  for(var r in row) {
   if (row.hasOwnProperty(r) && r.indexOf('gsx') != -1) {
      let prop = r.replace('gsx$', '');
      values[prop] = row[r].$t;
   }
 }

  const feature = {
    type: 'Feature',
    properties: values,
    geometry: {
      type: 'Point',
      coordinates: [row.gsx$lon.$t, row.gsx$lat.$t]
    }
  };
  // But we also want to translate a few of the date fields so they are easier to use downstream
  /*const dateFields = ['gsx$fechafin', 'gsx$fechainicio'];
  dateFields.forEach(field => {
    feature.properties[field] = new Date(feature.properties[field]).toISOString();
  });*/
  return feature;
}

module.exports = Model;

/* Example raw API response
{
  "resultSet": {
  "queryTime": 1488465776220,
  "vehicle": [
    {
      "expires": 1488466246000,
      "signMessage": "Red Line to Beaverton",
      "serviceDate": 1488441600000,
      "loadPercentage": null,
      "latitude": 45.5873117,
      "nextStopSeq": 1,
      "source": "tab",
      "type": "rail",
      "blockID": 9045,
      "signMessageLong": "MAX  Red Line to City Center & Beaverton",
      "lastLocID": 10579,
      "nextLocID": 10579,
      "locationInScheduleDay": 24150,
      "newTrip": false,
      "longitude": -122.5927705,
      "direction": 1,
      "inCongestion": null,
      "routeNumber": 90,
      "bearing": 145,
      "garage": "ELMO",
      "tripID": "7144393",
      "delay": -16,
      "extraBlockID": null,
      "messageCode": 929,
      "lastStopSeq": 26,
      "vehicleID": 102,
      "time": 1488465767051,
      "offRoute": false
    }
  ]
}
*/
