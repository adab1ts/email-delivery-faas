'use strict';

const config = require('./config.json');

exports.ping = (request, response) => {
  // Everything is ok
  response.status(200).send('Pong!');
};
