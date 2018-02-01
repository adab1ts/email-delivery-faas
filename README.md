# Email Delivery FaaS

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://choosealicense.com/licenses/mit/)

Serverless functions to deliver email sent from a website's contact form.

## Requirements

 + NodeJS 6+
 + Serverless
 + Google Cloud Platform Account

## Setup

These functions have been built using the [Serverless Framework](https://serverless.com/framework/).

```bash
# 1. Install serverless globally
$ npm install -g serverless

# 2. Install the project's dependencies
$ npm install
```

In order to use these functions you have to create a Google Cloud Platform account
as explained here: https://serverless.com/framework/docs/providers/google/guide/credentials/

Then configure your service using the `config.json.sample` file supplied:

```bash
# Rename the configuration file
$ mv config.json.sample config.json

# Fill the config file with your data.
# Read https://developers.google.com/gmail/api/quickstart/nodejs to know how to get the required data.
$ vi config.json
```

## Deploy

Once your Google Cloud Platform account is setup, you can deploy your functions to production:

```bash
$ npm run deploy
```

In order to see information about your deployed service you can run:

```bash
$ npm run info
```

## Test

If you want to test your functions you can run:

```bash
# Check Google Cloud Functions status
$ npm run call -- ping

# Check your email provider status
$ npm run call -- check

# Send an email using your email provider.
$ npm run call -- contact --data '{"name":"Jane Doe","email":"jane.doe@email.com","message":"Hello World!"}'
```

And to see your functions logs you can run:

```bash
# Display check function logs
$ npm run logs -- check

# Display contact function logs
$ npm run logs -- contact
```


## Contact

Email:    info[@]adabits[.]org  
Twitter:  [@adab1ts](https://twitter.com/adab1ts)  
Facebook: [Adab1ts](https://www.facebook.com/Adab1ts)  
LinkedIn: [adab1ts](https://www.linkedin.com/company/adab1ts)


## Contributors

Designed, developed and maintained by

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
[<img alt="laklau" src="https://avatars.githubusercontent.com/u/6210292?v=3&s=117" width="117">]((https://github.com/adab1ts/www.pareudepararme.org/commits?author=laklau)) |[<img alt="zuzust" src="https://avatars.githubusercontent.com/u/351530?v=3&s=117" width="117">](https://github.com/adab1ts/www.pareudepararme.org/commits?author=zuzust) |
:---: |:---: |
[Klaudia Alvarez](https://github.com/laklau) |[Carles Muiños](https://github.com/zuzust)
<!-- ALL-CONTRIBUTORS-LIST:END -->


## License

The code of this app is &copy; 2018 [Adab1ts](http://www.adabits.org) under the terms of the [MIT License](https://choosealicense.com/licenses/mit/).  
