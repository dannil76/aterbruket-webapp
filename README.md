<!-- SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]

<p>
  <a href="https://github.com/helsingborg-stad/">
    <img src="public/hbg-github-logo-combo.png" alt="Logo" width="300">
  </a>
</p>
<h3>Haffa (återbruket web app)</h3>

Service for recycling office furniture.

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Run app](#run-app)
  - [Deploy](#deploy)
- [Contributing](#contributing)
- [License](#license)


## Built With

* [AWS Amplify](https://aws.amazon.com/amplify/)
* [React](https://reactjs.org/)


## Getting Started

To get a local copy up and running follow these simple steps.


### Prerequisites

* NPM
* Amplify CLI
```
npm install -g @aws-amplify/cli
```


### Installation

1. Clone repo
2. Install dependencies `$ npm install`
3. Initialize Amplify project `$ amplify init`

### Run app

```
npm run start
```

### Deploy
Push to __develop__ builds to staging environment. 
Merge __develop__ to __main__ to create a depoy to production environment

## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
    - When you have pushed the branch Amplify will create a new site
    - with url like https://feature-amazingfeature.d21bj89y0jdxx1.amplifyapp.com
5. Open a Pull Request to develop branch

## Notes

### Backend
Backend is built using typescript. Because Amplify uses src/ as build folder .js files is ignored and created at runtime from typescript built.
To don't show build files while developing VS Code has .js files ignored in backend folders. 

To help Amplify compile typescript you need to add a build script in package.json
e.g. "amplify:amazingfeature": "cd amplify/backend/function/amazingfeature/src && npm install && npm run build && cd -",

To run tests create a package.json script for unit testing. Jest files are added in a /spec folder. 

"test:amazingfeature": "cd amplify/backend/function/amazingfeature/src && npm install && npm run test && cd -",

### Frontend
Frontend is built using typescript. Jest tests are included in same folders as code files. 

Amplify generates a folder in /src/grapqhl 
Unless required please use one of the different models generated. To help intellisense and auto generation of types from BE.
  - Typescript models
  - Queries
  - Mutations

### Guides and documentation

OPENSEARCH: https://docs.amplify.aws/cli/graphql/search-and-result-aggregations/
BACKEND models: https://docs.amplify.aws/cli/graphql/data-modeling/
CODE GENERATION: https://docs.amplify.aws/cli/graphql/client-code-generation/#modify-graphql-schema-push-then-automatically-generate-code


## License

Distributed under the [MIT License][license-url].



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/helsingborg-stad/aterbruket-webapp.svg?style=flat-square
[contributors-url]: https://github.com/helsingborg-stad/aterbruket-webapp/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/helsingborg-stad/aterbruket-webapp.svg?style=flat-square
[forks-url]: https://github.com/helsingborg-stad/aterbruket-webapp/network/members
[stars-shield]: https://img.shields.io/github/stars/helsingborg-stad/aterbruket-webapp.svg?style=flat-square
[stars-url]: https://github.com/helsingborg-stad/aterbruket-webapp/stargazers
[issues-shield]: https://img.shields.io/github/issues/helsingborg-stad/aterbruket-webapp.svg?style=flat-square
[issues-url]: https://github.com/helsingborg-stad/aterbruket-webapp/issues
[license-shield]: https://img.shields.io/github/license/helsingborg-stad/aterbruket-webapp.svg?style=flat-square
[license-url]: https://raw.githubusercontent.com/helsingborg-stad/aterbruket-webapp/master/LICENSE
[product-screenshot]: images/screenshot.png
