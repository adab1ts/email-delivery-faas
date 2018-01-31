/**
 * MIT License
 *
 * Copyright (c) 2018 Adab1ts
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

const cors = require('cors');
const nodemailer = require('nodemailer');
const bunyan = require('bunyan');

const config = require('./config.json');


/**
 * Check Google Cloud Functions status
 *
 * Trigger this function by making a GET request to:
 * https://[YOUR_REGION].[YOUR_PROJECT_ID].cloudfunctions.net/ping
 *
 * @example
 * curl -X GET "https://us-central1.your-project-id.cloudfunctions.net/ping"
 *
 * @param {object} request Cloud Function request context.
 * @param {object} response Cloud Function response context.
 */
exports.ping = (request, response) => {
  // Everything is ok
  response.status(200).send('Pong!');
};

/**
 * Returns a nodemailer transporter.
 *
 * @returns {object} Transporter object.
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
 * Check your email provider status
 *
 * Trigger this function by making a GET request to:
 * https://[YOUR_REGION].[YOUR_PROJECT_ID].cloudfunctions.net/check
 *
 * @example
 * curl -X GET "https://us-central1.your-project-id.cloudfunctions.net/check"
 *
 * @param {object} request Cloud Function request context.
 * @param {object} response Cloud Function response context.
 */
exports.check = (request, response) => {
  return Promise.resolve()
    .then(_ => {
      const transporter = getTransporter();
      return transporter.verify();
    })
    .then(_ => {
      response.status(200).send('Success: Server ready to take our messages');
    })
    .catch(err => {
      console.log(`[Error] { code: ${err.code}, message: ${err.message} }`);
      response.status(400).send('Error: Server is not ready to accept messages');
    });
}

/**
 * Gets the email body data from the HTTP request body.
 *
 * @param {object} requestBody The request payload.
 * @param {string} requestBody.botTrap Field to prevent spam.
 * @param {string} requestBody.name Name of the sender.
 * @param {string} requestBody.email Email address of the sender.
 * @param {string} requestBody.message Body of the email message.
 * @returns {object} Payload object.
 */
function getPayload(requestBody) {
  if (requestBody.botTrap) {
    const error = new Error('Spam not allowed!');
    error.code = 400;
    throw error;
  } else if (!requestBody.name) {
    const error = new Error('Name not provided. Make sure you have a "name" property in your request');
    error.code = 400;
    throw error;
  } else if (!requestBody.email) {
    const error = new Error('Email address not provided. Make sure you have an "email" property in your request');
    error.code = 400;
    throw error;
  } else if (!requestBody.message) {
    const error = new Error('Email content not provided. Make sure you have a "message" property in your request');
    error.code = 400;
    throw error;
  }

  return {
    name: requestBody.name,
    email: requestBody.email,
    message: requestBody.message
  };
}

/**
 * Ask nodemailer to send an email using your email provider.
 *
 * @param {object} req Cloud Function request context.
 * @param {object} req.body The request payload.
 * @param {object} res Cloud Function response context.
 */
function fcontact(req, res) {
  return Promise.resolve()
    .then(_ => {
      const payload = getPayload(req.body);
      const message = {
        // email address of the sender
        from: config.envelope.sender,
        // comma separated list or an array of recipients email addresses
        to: config.envelope.recipient,
        // subject of the email
        subject: config.envelope.subject,
        // email address that will appear on the Reply-To: field
        replyTo: payload.email,
        // plaintext body
        text: `
          Formulario de contacto:

          Nombre: ${payload.name}
          Email: ${payload.email}

          ${payload.message}
        `,
        // HTML body
        html: `
          <h3>Formulario de contacto</h3>
          <p>
            <b>Nombre</b>: ${payload.name}<br>
            <b>Email</b>: ${payload.email}
          </p>
          <p>${payload.message}</p>
        `,
      };
      return message;
    })
    .then(message => {
      const transporter = getTransporter();
      return transporter.sendMail(message);
    })
    .then(_ => {
      // console.log(req.body);
      // Send number of emails sent successfully
      res.status(200).send("1");
    })
    .catch(err => {
      console.log(`[Error] { code: ${err.code}, message: ${err.message} }`);
      res.status(400).send(`Error: ${err.message}`);
    });
};

/**
 * Send an email using your email provider.
 *
 * Trigger this function by making a POST request with a payload to:
 * https://[YOUR_REGION].[YOUR_PROJECT_ID].cloudfunctions.net/contact
 *
 * @example
 * curl -X POST "https://us-central1.your-project-id.cloudfunctions.net/contact" --data '{"name":"Jane Doe","email":"jane.doe@email.com","message":"Hello World!"}'
 *
 * @param {object} request Cloud Function request context.
 * @param {object} response Cloud Function response context.
 */
exports.contact = (request, response) => {
  const fcors = cors({
    origin: true,
    methods: ['POST', 'OPTIONS']
  });

  fcors(request, response, () => fcontact(request, response));
};
