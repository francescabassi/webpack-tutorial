# WEBPACK TUTORIAL - STEP 2 - Configuring Webpack

This is a step by step tutorial to show how set up a React project using Webpack.

## Setup

To start clone this project:

```
git clone --branch 2_step https://github.com/francescabassi/webpack-tutorial.git
```

## Usage

Install the dependencies:

```
npm install
```

Then build the project:

```
npm start
```

You can see the result open in your browser the `dist/index.html` file.

## Tutorial

Webpack has a lot of different and advanced options and allows for the usage of loaders and plugins to apply transformations on the loaded modules. Although its possible to use webpack with all options from the command line, the process tends to get slow and error-prone. A better approach is to define a configuration file - a simple JavaScript module where you can put all information relating to your build.

Create a file named `webpack.config.js`; at bare minimum, the Webpack configuration file must reference the entry file and the destination for the bundled file:

**webpack.config.js**

```javascript
module.exports = {
  entry: __dirname + "src/main.js",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  }
}
```

Executing a long command such as `node_modules/.bin/webpack` is boring and error prone. Thankfully, npm can be used as a task runner, hiding verbose scripts under simple commands such as `npm start`. This can be achieved easily by setting up a scripts section to `package.json`, as shown below:

**package.json**

```json
{
  "name": "webpack-tutorial",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "webpack",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^1.13.3"
  }
}
```

To make it easier to develop our configuration, we can integrate a _tool_ known as [webpack-validator] to our project. It will validate the configuration against a schema and warn if we are trying to do something not sensible. This takes some pain out of learning and using Webpack.

```
npm i webpack-validator --save-dev
```

**webpack.config.js**

```javascript
const validate = require('webpack-validator');

const config = {
  entry: __dirname + "/src/main.js",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  }
}

module.exports = validate(config);
```

Now you can build the project with this command:

```
npm start
```  

The result will be the same as the previous step.

## Sources
- [SurviveJS]
- [Pro React]

[SurviveJS]: <http://survivejs.com/webpack/introduction/>
[Pro React]: <http://www.pro-react.com/materials/appendixA/>
[webpack-validator]: <https://www.npmjs.com/package/webpack-validator>
