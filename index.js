'use strict';

const nodemailer = require('nodemailer');
const bunyan = require('bunyan');

const config = require('./config.json');


/**
 *
 */
exports.ping = (request, response) => {
  // Everything is ok
  response.status(200).send('Pong!');
};

/**
 *
 */
function getTransporter() {
  const logger = bunyan.createLogger({ name: 'nodemailer' });
  logger.level('trace');

  return nodemailer.createTransport({
    service: config.transport.service,
    auth: config.transport.auth,
    logger,
    debug: true
  });
}

/**
 *
 */
exports.check = (request, response) => {
  const transporter = getTransporter();

  transporter.verify((error, success) => {
    if (error) {
      console.log(`Error: ${error}`);
      response.status(400).send('Error: Server is not ready to accept messages');
    } else {
      response.status(200).send('Success: Server ready to take our messages');
    }
  });
}
